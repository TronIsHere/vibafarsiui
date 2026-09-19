"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_scale;uniform float u_opacity;
vec2 site(vec2 c){float h=hash(c);float k=hash(c+7.1);return c+0.5+0.35*vec2(sin(u_time*0.4+h*6.28),cos(u_time*0.35+k*6.28));}
void main(){
  vec2 p=gl_FragCoord.xy/u_resolution.y*u_scale;
  vec2 c=floor(p);
  float d1=9.0,d2=9.0;vec2 best=vec2(0.0);
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
    vec2 cell=c+vec2(x,y);
    float d=distance(p,site(cell));
    if(d<d1){d2=d1;d1=d;best=cell;}else if(d<d2){d2=d;}
  }
  float edge=d2-d1;
  float w=fwidth(edge);
  float line=1.0-smoothstep(w*0.4,w*1.6,edge);
  float shade=hash(best)*0.08;
  vec2 uv=gl_FragCoord.xy/u_resolution;
  float mask=1.0-smoothstep(0.4,0.95,distance(uv,vec2(0.5)));
  gl_FragColor=vec4(u_color0,(line*0.9+shade)*mask*u_opacity);
}`;

/** سلول‌ها. Voronoi cells with thin borders whose sites wander. WebGL via ShaderCanvas. */
export function VoronoiBackground({ scale = 5, speed = 1, opacity = 0.4, className }: { scale?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--foreground"]} uniforms={{ u_scale: scale, u_opacity: opacity }} speed={speed} className={className} />;
}
