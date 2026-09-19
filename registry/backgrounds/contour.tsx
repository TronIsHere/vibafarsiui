"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_scale;uniform float u_levels;uniform float u_opacity;
void main(){
  vec2 p=gl_FragCoord.xy/u_resolution.y*u_scale;
  float t=u_time*0.05;
  float h=fbm(p+vec2(t,t*0.6))*u_levels;
  float d=abs(fract(h)-0.5);
  float w=fwidth(h);
  float line=1.0-smoothstep(w*0.3,w*1.1,d);
  float major=step(mod(floor(h),4.0),0.5);
  vec2 uv=gl_FragCoord.xy/u_resolution;
  float mask=1.0-smoothstep(0.35,0.9,distance(uv,vec2(0.5)));
  gl_FragColor=vec4(u_color0,line*(0.45+0.55*major)*mask*u_opacity);
}`;

/** خطوط تراز. Topographic contour lines from noise that slowly drift. WebGL via ShaderCanvas. */
export function ContourBackground({ scale = 1.2, levels = 14, speed = 1, opacity = 0.45, className }: { scale?: number; levels?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--foreground"]} uniforms={{ u_scale: scale, u_levels: levels, u_opacity: opacity }} speed={speed} className={className} />;
}
