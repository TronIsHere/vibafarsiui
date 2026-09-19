"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_scale;uniform float u_opacity;
void main(){
  vec2 p=gl_FragCoord.xy/u_resolution.y*u_scale;
  float t=u_time*0.06;
  vec2 q=vec2(fbm(p+t),fbm(p+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p+4.0*q+vec2(1.7,9.2)+0.3*t),fbm(p+4.0*q+vec2(8.3,2.8)-0.25*t));
  float f=fbm(p+3.0*r);
  vec3 col=mix(u_color1,u_color0,clamp(length(q)*1.2,0.0,1.0));
  col=mix(col,u_color0,clamp(r.x*1.4-0.2,0.0,1.0));
  float a=smoothstep(0.25,0.85,f*f*2.2)*u_opacity;
  gl_FragColor=vec4(col,a);
}`;

/** سحابی. Domain-warped noise, like clouds of gas; brand and foreground. WebGL via ShaderCanvas. */
export function NebulaBackground({ scale = 1.4, speed = 1, opacity = 0.4, className }: { scale?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} uniforms={{ u_scale: scale, u_opacity: opacity }} speed={speed} className={className} />;
}
