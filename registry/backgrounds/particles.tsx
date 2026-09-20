"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_density;uniform float u_opacity;
float layer(vec2 p,float t,float seed,float size){
  p.y-=t;
  vec2 c=floor(p);
  vec2 f=fract(p);
  float a=0.0;
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
    vec2 o=vec2(x,y);
    vec2 cell=mod(c+o,64.0)+seed;
    float h1=hash(cell),h2=hash(cell+3.7),h3=hash(cell+9.1);
    vec2 pos=o+vec2(h1,h2)*0.8+0.1;
    pos.x+=0.15*sin(t*2.0+h3*6.28);
    float d=distance(f,pos);
    float r=size*(0.4+0.6*h3);
    float dot_=exp(-d*d/(r*r)*3.0);
    float tw=0.6+0.4*sin(t*3.0+h1*6.28);
    a+=dot_*tw*step(0.4,h2);
  }
  return a;
}
void main(){
  vec2 p=gl_FragCoord.xy/u_resolution.y*u_density;
  float t=u_time*0.05;
  float a=layer(p*4.0,t*1.2,0.0,0.09)*0.9
         +layer(p*7.0,t*2.0,11.0,0.08)*0.6
         +layer(p*12.0,t*3.2,23.0,0.07)*0.35;
  vec2 uv=gl_FragCoord.xy/u_resolution;
  float mask=smoothstep(0.0,0.3,uv.y)*smoothstep(1.0,0.7,uv.y);
  gl_FragColor=vec4(u_color0,clamp(a,0.0,1.0)*mask*u_opacity);
}`;

/** ذرات شناور. Three depths of soft dust that rise, sway, and twinkle. WebGL via ShaderCanvas. */
export function ParticlesBackground({ density = 1, speed = 1, opacity = 0.6, className }: { density?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--foreground"]} uniforms={{ u_density: density, u_opacity: opacity }} speed={speed} className={className} />;
}
