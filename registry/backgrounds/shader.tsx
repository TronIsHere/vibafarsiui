"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * بوم شیدر. Raw WebGL (no library) that runs a fragment shader as a background layer.
 * Colors come from CSS variables and update when the theme changes; the loop pauses
 * off-screen, stops under prefers-reduced-motion, and frees the GPU context on unmount.
 *
 * Your fragment gets these uniforms for free:
 *   u_resolution (px), u_time (s), u_dpr, u_pointer (0–1, y up),
 *   u_trail[8] (x, y, time of the last pointer moves), u_color0…u_color3 (sRGB 0–1)
 */
export interface ShaderCanvasProps extends Omit<React.ComponentProps<"canvas">, "children"> {
  /** GLSL ES 1.00 fragment shader body with a `void main()`; the header above is prepended. */
  fragment: string;
  /** CSS custom properties resolved into u_color0…u_color3. */
  colors?: string[];
  /** Extra uniforms: a number becomes float, an array becomes vec2/vec3/vec4. */
  uniforms?: Record<string, number | number[]>;
  /** Multiplier on u_time. */
  speed?: number;
  /** Listen to pointer moves on the parent and feed u_pointer / u_trail. */
  pointer?: boolean;
  /** Render scale; defaults to devicePixelRatio capped at 1.5. */
  dpr?: number;
}

const VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
const HEADER = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
#define PI 3.14159265
uniform vec2 u_resolution;uniform float u_time;uniform float u_dpr;uniform vec2 u_pointer;uniform vec3 u_trail[8];
uniform vec3 u_color0;uniform vec3 u_color1;uniform vec3 u_color2;uniform vec3 u_color3;
`;

/** Hash, value noise, and fbm. Prepend to a fragment that needs them. */
export const GLSL_NOISE = `float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f);
return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.0+17.0;a*=0.5;}return v;}
`;

let probe: CanvasRenderingContext2D | null | undefined;

/** Resolves a CSS custom property (any color syntax, including oklch) to sRGB 0–1. */
export function cssColor(el: Element, token: string): [number, number, number] {
  if (probe === undefined) {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    probe = c.getContext("2d", { willReadFrequently: true });
  }
  const raw = getComputedStyle(el).getPropertyValue(token).trim();
  if (!probe || !raw) return [0.5, 0.5, 0.5];
  probe.clearRect(0, 0, 1, 1);
  probe.fillStyle = "#808080";
  probe.fillStyle = raw;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

const TRAIL = 8;
/** WEBGL_lose_context per canvas: it is only obtainable while the context is live, but restoreContext() is needed after it is lost. */
const losers = new WeakMap<HTMLCanvasElement, WEBGL_lose_context | null>();

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn("[ShaderCanvas]", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function ShaderCanvas({
  fragment,
  colors = ["--brand", "--foreground", "--background"],
  uniforms,
  speed = 1,
  pointer = false,
  dpr,
  className,
  ...rest
}: ShaderCanvasProps) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const colorKey = colors.join(",");
  const uniformKey = JSON.stringify(uniforms ?? {});

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
    if (!gl) return;
    if (!losers.has(canvas)) {
      losers.set(canvas, gl.getExtension("WEBGL_lose_context"));
      // Must stay attached for the canvas's whole life: without preventDefault a lost context can never be restored.
      canvas.addEventListener("webglcontextlost", (e) => e.preventDefault());
    }
    const lose = losers.get(canvas) ?? null;
    let disposed = false;

    const tokens = colorKey.split(",");
    const extra = JSON.parse(uniformKey) as Record<string, number | number[]>;
    const scale = dpr ?? Math.min(window.devicePixelRatio || 1, 1.5);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const trail = new Float32Array(TRAIL * 3).fill(-1e3);
    let ti = 0;
    let px = 0.5;
    let py = 0.5;
    let ready = false;
    let visible = false;
    let raf = 0;
    const t0 = performance.now();
    const now = () => ((performance.now() - t0) / 1000) * speed;
    const locs = new Map<string, WebGLUniformLocation | null>();
    let program: WebGLProgram | null = null;
    const loc = (n: string) => {
      if (!locs.has(n)) locs.set(n, program && gl.getUniformLocation(program, n));
      return locs.get(n) ?? null;
    };

    const setColors = () => tokens.forEach((t, i) => gl.uniform3fv(loc(`u_color${i}`), cssColor(canvas, t)));
    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(loc("u_resolution"), w, h);
    };
    const render = (t = now()) => {
      if (!ready || gl.isContextLost()) return;
      gl.uniform1f(loc("u_time"), t);
      gl.uniform2f(loc("u_pointer"), px, py);
      gl.uniform3fv(loc("u_trail"), trail);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const frame = () => {
      render();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (reduced) render(4);
      else raf = requestAnimationFrame(frame);
    };
    const stop = () => cancelAnimationFrame(raf);

    const setup = () => {
      locs.clear();
      const ext = gl.getExtension("OES_standard_derivatives");
      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, (ext ? "#extension GL_OES_standard_derivatives : enable\n" : "") + HEADER + fragment);
      if (!vs || !fs) return;
      program = gl.createProgram()!;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return console.warn("[ShaderCanvas]", gl.getProgramInfoLog(program));
      gl.useProgram(program);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const a = gl.getAttribLocation(program, "a");
      gl.enableVertexAttribArray(a);
      gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(loc("u_dpr"), scale);
      for (const [k, v] of Object.entries(extra)) {
        if (typeof v === "number") gl.uniform1f(loc(k), v);
        else if (v.length === 2) gl.uniform2fv(loc(k), v);
        else if (v.length === 3) gl.uniform3fv(loc(k), v);
        else if (v.length === 4) gl.uniform4fv(loc(k), v);
      }
      ready = true;
      setColors();
      resize();
    };

    const onRestored = () => {
      setup();
      if (visible) start();
      else lose?.loseContext();
    };
    // Restoring is only allowed once the lost event has been dispatched, hence the timeout.
    const onLost = () => {
      stop();
      ready = false;
      if (visible) setTimeout(() => !disposed && visible && lose?.restoreContext(), 0);
    };
    canvas.addEventListener("webglcontextrestored", onRestored);
    canvas.addEventListener("webglcontextlost", onLost);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) {
        // A no-op if the lost event has not fired yet; onLost then restores.
        if (gl.isContextLost()) lose?.restoreContext();
        else {
          if (!ready) setup();
          start();
        }
      } else {
        stop();
        ready = false;
        if (!gl.isContextLost()) lose?.loseContext();
      }
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      if (!ready) return;
      resize();
      if (reduced) render(4);
    });
    ro.observe(canvas);

    const mo = new MutationObserver(() => {
      if (!ready) return;
      setColors();
      if (reduced) render(4);
    });
    mo.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ["data-theme"] });

    const host = canvas.parentElement;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width;
      py = 1 - (e.clientY - r.top) / r.height;
      const t = now();
      const last = ((ti + TRAIL - 1) % TRAIL) * 3;
      if (t - trail[last + 2] > 0.06 || Math.hypot(px - trail[last], py - trail[last + 1]) > 0.04) {
        trail.set([px, py, t], ti * 3);
        ti = (ti + 1) % TRAIL;
      }
      if (reduced) render(4);
    };
    if (pointer && host) host.addEventListener("pointermove", onMove);

    return () => {
      disposed = true;
      stop();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      canvas.removeEventListener("webglcontextrestored", onRestored);
      canvas.removeEventListener("webglcontextlost", onLost);
      if (pointer && host) host.removeEventListener("pointermove", onMove);
      ready = false;
      if (!gl.isContextLost()) lose?.loseContext();
    };
  }, [fragment, colorKey, uniformKey, speed, pointer, dpr]);

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 size-full", className)} {...rest} />;
}
