"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_count;uniform float u_opacity;
void main(){
  vec2 asp=vec2(u_resolution.x/u_resolution.y,1.0);
  vec2 p=gl_FragCoord.xy/u_resolution*asp;
  float t=u_time*0.3;
  float f=0.0;
  for(int i=0;i<12;i++){
    float fi=float(i);
    if(fi>=u_count)break;
    float h1=hash(vec2(fi,1.0)),h2=hash(vec2(fi,2.0)),h3=hash(vec2(fi,3.0));
    vec2 c=vec2(0.5+0.36*sin(t*(0.5+h1)+h2*6.28),0.5+0.32*cos(t*(0.4+h2)+h3*6.28))*asp;
    float r=0.07+0.08*h3;
    float d=distance(p,c);
    f+=r*r/(d*d+1e-4);
  }
  float body=smoothstep(0.9,1.5,f);
  float rim=smoothstep(0.7,1.0,f)-smoothstep(1.0,1.7,f);
  vec3 col=mix(u_color0,u_color1,rim);
  gl_FragColor=vec4(col,(body*0.55+rim*0.5)*u_opacity);
}`;

/** گوی‌های چسبناک. Metaballs that drift, merge, and split like a lava lamp. WebGL via ShaderCanvas. */
export function MetaballsBackground({ count = 6, speed = 1, opacity = 0.35, className }: { count?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--brand", "--foreground"]} uniforms={{ u_count: Math.min(count, 12), u_opacity: opacity }} speed={speed} className={className} />;
}
