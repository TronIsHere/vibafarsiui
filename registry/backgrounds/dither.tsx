"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_pixel;uniform float u_opacity;
float bayer2(vec2 a){a=floor(a);return fract(a.x/2.0+a.y*a.y*0.75);}
float bayer4(vec2 a){return bayer2(0.5*a)*0.25+bayer2(a);}
void main(){
  float px=u_pixel*u_dpr;
  vec2 cell=floor(gl_FragCoord.xy/px);
  vec2 p=cell*px/u_resolution.y;
  float t=u_time*0.1;
  float v=fbm(p*1.8+vec2(t,-t*0.5));
  vec2 uv=(cell+0.5)*px/u_resolution;
  float vig=smoothstep(0.15,0.75,distance(uv,vec2(0.5,0.45)));
  v=smoothstep(0.3,0.8,v)*vig;
  float on=step(bayer4(cell),v);
  gl_FragColor=vec4(u_color0,on*u_opacity);
}`;

/** دیترینگ. Ordered Bayer dithering over a drifting gradient, like an old display. WebGL via ShaderCanvas. */
export function DitherBackground({ pixel = 3, speed = 1, opacity = 0.5, className }: { pixel?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--foreground"]} uniforms={{ u_pixel: pixel, u_opacity: opacity }} speed={speed} className={className} />;
}
