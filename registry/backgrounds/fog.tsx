"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_scale;uniform float u_opacity;
void main(){
  vec2 p=gl_FragCoord.xy/u_resolution.y*u_scale;
  float t=u_time*0.12;
  float n=fbm(p+vec2(t,-t*0.4)+fbm(p*0.6-t)*1.2);
  n=smoothstep(0.35,0.95,n);
  vec2 uv=gl_FragCoord.xy/u_resolution;
  float edge=smoothstep(0.0,0.5,uv.y);
  gl_FragColor=vec4(u_color0,n*edge*u_opacity);
}`;

/** مه. Layered noise drifting like fog; foreground color at low alpha. WebGL via ShaderCanvas. */
export function FogBackground({ scale = 2.2, speed = 1, opacity = 0.35, className }: { scale?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--foreground"]} uniforms={{ u_scale: scale, u_opacity: opacity }} speed={speed} className={className} />;
}
