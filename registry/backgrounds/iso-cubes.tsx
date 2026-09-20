"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_scale;uniform float u_opacity;
const vec2 S=vec2(1.0,1.7320508);
float hexd(vec2 p){p=abs(p);return max(dot(p,S*0.5),p.x);}
vec4 hexc(vec2 p){
  vec4 hc=floor(vec4(p,p-vec2(0.5,1.0))/S.xyxy)+0.5;
  vec4 h=vec4(p-hc.xy*S,p-(hc.zw+0.5)*S);
  return dot(h.xy,h.xy)<dot(h.zw,h.zw)?vec4(h.xy,hc.xy):vec4(h.zw,hc.zw+0.5);
}
void main(){
  vec2 p=gl_FragCoord.xy/u_resolution.y*u_scale;
  vec4 h=hexc(p);
  float sec=(atan(h.y,h.x)-PI/6.0)/(PI*2.0/3.0);
  float face=floor(mod(sec,3.0));
  float shade=face<0.5?1.0:(face<1.5?0.55:0.3);
  float t=u_time*0.3;
  float n=noise(h.zw*0.4+vec2(t*0.2,-t*0.15));
  n=smoothstep(0.3,0.85,n);
  float d=hexd(h.xy);
  float w=fwidth(d);
  float edge=smoothstep(0.5-w*1.5,0.5-w*0.5,d);
  float sw=min(fwidth(sec),0.1);
  float spoke=(1.0-smoothstep(sw*0.5,sw*1.5,min(fract(sec),1.0-fract(sec))))*smoothstep(0.02,0.08,length(h.xy));
  float fill=shade*(0.2+0.6*n);
  float a=fill*0.7+max(edge,spoke)*0.45;
  vec2 uv=gl_FragCoord.xy/u_resolution;
  float mask=1.0-smoothstep(0.35,0.95,distance(uv,vec2(0.5)));
  gl_FragColor=vec4(u_color0,a*mask*u_opacity);
}`;

/** مکعب‌های ایزومتریک. A field of isometric cubes (three shaded rhombi per hex) that breathe with a slow noise field. WebGL via ShaderCanvas. */
export function IsoCubesBackground({ scale = 6, speed = 1, opacity = 0.35, className }: { scale?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--foreground"]} uniforms={{ u_scale: scale, u_opacity: opacity }} speed={speed} className={className} />;
}
