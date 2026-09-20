"use client";

import { ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = /* glsl */ `
uniform float u_gap;uniform float u_opacity;
float rings(vec2 p,vec2 c,float freq){return 0.5+0.5*sin(distance(p,c)*freq);}
void main(){
  vec2 asp=vec2(u_resolution.x/u_resolution.y,1.0);
  vec2 uv=gl_FragCoord.xy/u_resolution;
  vec2 p=uv*asp;
  float t=u_time*0.15;
  float freq=2.0*PI*u_resolution.y/(u_gap*u_dpr);
  vec2 c1=vec2(0.5*asp.x+0.08*sin(t),0.5+0.06*cos(t*1.3));
  vec2 c2=vec2(0.5*asp.x-0.08*sin(t*0.8+1.0),0.5-0.06*cos(t*1.1));
  float v=rings(p,c1,freq)*rings(p,c2,freq*1.03);
  v=smoothstep(0.3,0.9,v);
  float mask=1.0-smoothstep(0.3,0.85,distance(uv,vec2(0.5)));
  gl_FragColor=vec4(u_color0,v*mask*u_opacity);
}`;

/** مواره. Two sets of fine rings whose centers drift; their interference draws large slow fringes. WebGL via ShaderCanvas. */
export function MoireBackground({ gap = 7, speed = 1, opacity = 0.3, className }: { gap?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--foreground"]} uniforms={{ u_gap: gap, u_opacity: opacity }} speed={speed} className={className} />;
}
