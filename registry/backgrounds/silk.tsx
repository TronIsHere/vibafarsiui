"use client";

import { ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = /* glsl */ `
uniform float u_scale;uniform float u_opacity;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution;
  uv.x*=u_resolution.x/u_resolution.y;
  vec2 q=uv*u_scale;
  float t=u_time*0.5;
  q.y+=0.08*sin(6.0*q.x-t);
  float ph=q.x+q.y+cos(3.0*q.x+5.0*q.y)+0.2*t;
  float v=0.5+0.5*sin(5.0*ph+sin(20.0*(q.x+q.y-0.05*t)));
  v=pow(v,1.6);
  vec3 col=mix(u_color0,u_color1,smoothstep(0.2,1.0,v));
  gl_FragColor=vec4(col,v*u_opacity);
}`;

/** ابریشم. Folded satin sheen that slowly slides. WebGL via ShaderCanvas. */
export function SilkBackground({ scale = 1.6, speed = 1, opacity = 0.35, className }: { scale?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} uniforms={{ u_scale: scale, u_opacity: opacity }} speed={speed} className={className} />;
}
