"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_cell;uniform float u_opacity;
void main(){
  float s=u_cell*u_dpr;
  float c=cos(0.5),si=sin(0.5);
  vec2 q=mat2(c,-si,si,c)*gl_FragCoord.xy;
  vec2 id=floor(q/s)+0.5;
  vec2 center=id*s;
  vec2 cuv=(mat2(c,si,-si,c)*center)/u_resolution;
  float t=u_time*0.12;
  float v=fbm(cuv*vec2(u_resolution.x/u_resolution.y,1.0)*2.2+vec2(t,-t));
  v=smoothstep(0.3,0.85,v);
  float r=v*s*0.48;
  float d=distance(q,center);
  float dot_=1.0-smoothstep(r-1.0,r+1.0,d);
  float mask=1.0-smoothstep(0.35,0.95,distance(cuv,vec2(0.5)));
  gl_FragColor=vec4(u_color0,dot_*mask*u_opacity);
}`;

/** ترام. Print halftone dots whose size follows a soft moving wave. WebGL via ShaderCanvas. */
export function HalftoneBackground({ cell = 10, speed = 1, opacity = 0.45, className }: { cell?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--foreground"]} uniforms={{ u_cell: cell, u_opacity: opacity }} speed={speed} className={className} />;
}
