"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_scale;uniform float u_warp;uniform float u_opacity;
void main(){
  vec2 p=gl_FragCoord.xy/u_resolution.y;
  float t=u_time*0.15;
  vec2 d=vec2(fbm(p*1.6+t),fbm(p*1.6-t+5.0))-0.5;
  vec2 g=(p+d*u_warp)*u_scale;
  vec2 f=abs(fract(g)-0.5);
  vec2 w=fwidth(g);
  float lx=smoothstep(0.5-w.x*1.5,0.5-w.x*0.5,f.x);
  float ly=smoothstep(0.5-w.y*1.5,0.5-w.y*0.5,f.y);
  float line=max(lx,ly);
  vec2 uv=gl_FragCoord.xy/u_resolution;
  float mask=smoothstep(0.0,0.6,uv.y);
  gl_FragColor=vec4(u_color0,line*mask*u_opacity);
}`;

/** شبکه‌ی موج‌دار. A grid bent by noise, like graph paper under water. WebGL via ShaderCanvas. */
export function WarpGridBackground({ scale = 10, warp = 0.25, speed = 1, opacity = 0.35, className }: { scale?: number; warp?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--foreground"]} uniforms={{ u_scale: scale, u_warp: warp, u_opacity: opacity }} speed={speed} className={className} />;
}
