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
  float d=hexd(h.xy);
  float w=fwidth(d);
  float edge=smoothstep(0.5-w*1.6,0.5-w*0.4,d);
  float t=u_time*0.5;
  float glow=noise(h.zw*0.35+vec2(t*0.3,-t*0.2));
  glow=smoothstep(0.55,0.9,glow);
  vec2 uv=gl_FragCoord.xy/u_resolution;
  float mask=1.0-smoothstep(0.35,0.95,distance(uv,vec2(0.5)));
  float a=edge*0.7+glow*0.4*(1.0-edge);
  gl_FragColor=vec4(u_color0,a*mask*u_opacity);
}`;

/** شش‌ضلعی. Honeycomb with thin borders; a few cells light up as a slow noise field passes. WebGL via ShaderCanvas. */
export function HexGridBackground({ scale = 7, speed = 1, opacity = 0.4, className }: { scale?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--foreground"]} uniforms={{ u_scale: scale, u_opacity: opacity }} speed={speed} className={className} />;
}
