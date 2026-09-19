"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_lines;uniform float u_opacity;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution;
  float asp=u_resolution.x/u_resolution.y;
  float t=u_time*0.35;
  float px=1.0/u_resolution.y;
  float a=0.0;
  for(int i=0;i<16;i++){
    float fi=float(i);
    if(fi>=u_lines)break;
    float k=fi/max(u_lines-1.0,1.0);
    float y=0.12+k*0.76
      +0.05*sin(uv.x*asp*3.0+t+fi*0.45)
      +0.025*sin(uv.x*asp*7.0-t*1.4+fi*0.9)
      +0.03*(noise(vec2(uv.x*asp*2.0+fi,t*0.5))-0.5);
    float d=abs(uv.y-y);
    float line=1.0-smoothstep(px*0.6,px*1.8,d);
    a+=line*(0.35+0.65*(0.5+0.5*sin(uv.x*asp*4.0-t*0.8+fi)));
  }
  float mask=smoothstep(0.0,0.15,uv.x)*smoothstep(1.0,0.85,uv.x);
  gl_FragColor=vec4(u_color0,clamp(a,0.0,1.0)*mask*u_opacity);
}`;

/** امواج. Stacked sine lines that ripple like strands of light. WebGL via ShaderCanvas. */
export function WavesBackground({ lines = 12, speed = 1, opacity = 0.55, className }: { lines?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--foreground"]} uniforms={{ u_lines: lines, u_opacity: opacity }} speed={speed} className={className} />;
}
