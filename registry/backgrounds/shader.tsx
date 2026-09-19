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
 *   u_trail[8] (x, y, time of the last pointer moves), u_color0…u_color3 (sRGB 0–1),
 *   u_surface (parent background, used to composite opaque output for Safari)
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
  /** Render scale; defaults to an integer cap of devicePixelRatio (Safari cannot filter a 1.5× WebGL canvas cleanly). */
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
uniform vec3 u_color0;uniform vec3 u_color1;uniform vec3 u_color2;uniform vec3 u_color3;uniform vec3 u_surface;
`;

/** Hash, value noise, and fbm. Prepend to a fragment that needs them. Hash stays in 0–1 so mediump (iOS) does not overflow. */
export const GLSL_NOISE = `float hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*0.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f);
return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.0+17.0;a*=0.5;}return v;}
`;

/** WebKit (Safari, and iOS Chrome) ignores image-rendering on WebGL and bilinear-filters any backing-store mismatch. */
const isWebKit = () => typeof navigator !== "undefined" && navigator.vendor === "Apple Computer, Inc.";

function defaultScale() {
  const native = window.devicePixelRatio || 1;
  if (isWebKit()) return Math.min(Math.max(1, Math.round(native)), 2);
  return Math.min(native, 1.5);
}

/** Authors write straight-alpha `gl_FragColor`. Safari often ignores canvas alpha and shows RGB on black, so we mix onto the parent surface and output opaque pixels. */
function withSurface(src: string) {
  const rewritten = src.replace(/void\s+main\s*\(\s*\)/, "void _vf_main()");
  if (rewritten === src) return src;
  return `${rewritten}
void main(){
  _vf_main();
  float a=clamp(gl_FragColor.a,0.0,1.0);
  gl_FragColor=vec4(mix(u_surface,gl_FragColor.rgb,a),1.0);
}`;
}

let probe: CanvasRenderingContext2D | null | undefined;

/** Resolves a CSS custom property (any color syntax, including oklch) to sRGB 0–1. */
export function cssColor(el: Element, token: string): [number, number, number] {
  if (probe === undefined) {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    probe = c.getContext("2d", { willReadFrequently: true, colorSpace: "srgb" });
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

function paintCss(raw: string): [number, number, number, number] {
  if (probe === undefined) cssColor(document.documentElement, "--background");
  if (!probe || !raw) return [0, 0, 0, 0];
  probe.clearRect(0, 0, 1, 1);
  probe.fillStyle = raw;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = probe.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255, a / 255];
}

/** First non-transparent ancestor background, so the opaque canvas matches the card/page. */
function cssSurface(el: Element): [number, number, number] {
  let node: Element | null = el.parentElement ?? el;
  for (let i = 0; i < 10 && node; i++) {
    const [r, g, b, a] = paintCss(getComputedStyle(node).backgroundColor);
    if (a > 0.05) return [r, g, b];
    node = node.parentElement;
  }
  return cssColor(el, "--card");
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

  React.useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    if (!host) return;
    const scale = dpr ?? defaultScale();
    const apply = () => {
      const cssW = host.clientWidth;
      const cssH = host.clientHeight;
      if (cssW < 2 || cssH < 2) return;
      // Keep layout at 100% of the parent. Pinning getBoundingClientRect()
      // pixels overflowed the card by subpixels and shifted the RTL page in Safari.
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      const w = Math.max(1, Math.round(cssW * scale));
      const h = Math.max(1, Math.round(cssH * scale));
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(host);
    return () => ro.disconnect();
  }, [dpr]);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    // Opaque buffer: Safari ignores canvas alpha and would otherwise show premultiplied RGB on black.
    const gl =
      canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false }) ||
      canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    if (!gl) return;
    const colored = gl as WebGLRenderingContext & { drawingBufferColorSpace?: PredefinedColorSpace };
    if (colored.drawingBufferColorSpace) colored.drawingBufferColorSpace = "srgb";
    if (!losers.has(canvas)) {
      losers.set(canvas, gl.getExtension("WEBGL_lose_context"));
      // Must stay attached for the canvas's whole life: without preventDefault a lost context can never be restored.
      canvas.addEventListener("webglcontextlost", (e) => e.preventDefault());
    }
    const lose = losers.get(canvas) ?? null;
    let disposed = false;

    const tokens = colorKey.split(",");
    const extra = JSON.parse(uniformKey) as Record<string, number | number[]>;
    const scale = dpr ?? defaultScale();
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
      if (!locs.has(n)) {
        let l = program ? gl.getUniformLocation(program, n) : null;
        // Safari often only resolves array uniforms as name[0].
        if (program && l == null) l = gl.getUniformLocation(program, `${n}[0]`);
        locs.set(n, l);
      }
      return locs.get(n) ?? null;
    };

    const setColors = () => {
      tokens.forEach((t, i) => gl.uniform3fv(loc(`u_color${i}`), cssColor(canvas, t)));
      const surface = cssSurface(canvas);
      gl.uniform3fv(loc("u_surface"), surface);
      gl.clearColor(surface[0], surface[1], surface[2], 1);
    };
    const resize = () => {
      // Measure the parent. After canvas.width is set, WebKit may report the drawing
      // buffer as the canvas layout size, so reading the canvas itself stays stuck at 300×150.
      const hostEl = canvas.parentElement ?? canvas;
      const cssW = Math.max(1, hostEl.clientWidth);
      const cssH = Math.max(1, hostEl.clientHeight);
      if (cssW < 2 && cssH < 2) return;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      const max = (!gl.isContextLost() && gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)) || 8192;
      const w = Math.max(1, Math.min(max, Math.round(cssW * scale)));
      const h = Math.max(1, Math.min(max, Math.round(cssH * scale)));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      if (!ready || gl.isContextLost()) return;
      const dw = gl.drawingBufferWidth;
      const dh = gl.drawingBufferHeight;
      gl.viewport(0, 0, dw, dh);
      gl.uniform2f(loc("u_resolution"), dw, dh);
      gl.uniform1f(loc("u_dpr"), dw / cssW);
    };
    resize();
    const render = (t = now()) => {
      if (!ready || gl.isContextLost()) return;
      gl.uniform1f(loc("u_time"), t);
      gl.uniform2f(loc("u_pointer"), px, py);
      gl.uniform3fv(loc("u_trail"), trail);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
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
      const fs = compile(
        gl,
        gl.FRAGMENT_SHADER,
        (ext ? "#extension GL_OES_standard_derivatives : enable\n" : "") + withSurface(HEADER + fragment),
      );
      if (!vs || !fs) return;
      program = gl.createProgram()!;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return console.warn("[ShaderCanvas]", gl.getProgramInfoLog(program));
      gl.useProgram(program);
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      // Clip-space quad, not a giant triangle: fwidth/dFdx are stable on WebKit/Metal.
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const a = gl.getAttribLocation(program, "a");
      gl.enableVertexAttribArray(a);
      gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
      for (const [k, v] of Object.entries(extra)) {
        if (typeof v === "number") gl.uniform1f(loc(k), v);
        else if (v.length === 2) gl.uniform2fv(loc(k), v);
        else if (v.length === 3) gl.uniform3fv(loc(k), v);
        else if (v.length === 4) gl.uniform4fv(loc(k), v);
      }
      ready = true;
      setColors();
      resize();
      requestAnimationFrame(() => {
        if (!disposed && ready) resize();
      });
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
        if (ready) {
          ready = false;
          if (!gl.isContextLost()) lose?.loseContext();
        }
      }
    }, { rootMargin: "80px" });
    io.observe(canvas);
    // Safari sometimes skips the first IO callback on absolutely positioned canvases.
    requestAnimationFrame(() => {
      if (disposed || ready || gl.isContextLost()) return;
      const hostEl = canvas.parentElement ?? canvas;
      const r = hostEl.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      visible = true;
      setup();
      start();
    });

    const host = canvas.parentElement;
    const ro = new ResizeObserver(() => {
      resize();
      if (ready && reduced) render(4);
    });
    ro.observe(canvas);
    if (host) ro.observe(host);

    const mo = new MutationObserver(() => {
      if (!ready) return;
      setColors();
      if (reduced) render(4);
    });
    mo.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ["data-theme"] });

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

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 block size-full", className)} {...rest} />;
}
