"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_scale;uniform float u_opacity;
void main(){
  vec2 p=gl_FragCoord.xy/u_resolution.y*u_scale;
  vec2 c=floor(p);
  vec2 f=fract(p);
  float h=hash(c);
  float flip=step(0.5,hash(c+floor(u_time*0.12+h*7.0)));
  if(flip>0.5)f.x=1.0-f.x;
  float d=min(abs(length(f)-0.5),abs(length(f-1.0)-0.5));
  float w=fwidth(p.x);
  float line=1.0-smoothstep(w*0.5,w*1.6,d);
  float wave=0.55+0.45*sin((c.x+c.y)*0.6-u_time*0.5);
  vec2 uv=gl_FragCoord.xy/u_resolution;
  float mask=1.0-smoothstep(0.4,0.95,distance(uv,vec2(0.5)));
  gl_FragColor=vec4(u_color0,line*wave*mask*u_opacity);
}`;

/** تروشه. Quarter-circle tiles that occasionally flip and re-route the maze. WebGL via ShaderCanvas. */
export function TruchetBackground({ scale = 8, speed = 1, opacity = 0.4, className }: { scale?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--foreground"]} uniforms={{ u_scale: scale, u_opacity: opacity }} speed={speed} className={className} />;
}
