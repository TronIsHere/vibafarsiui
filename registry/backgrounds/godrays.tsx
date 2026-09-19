"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_opacity;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution;
  vec2 d=uv-vec2(0.5,1.35);
  d.x*=u_resolution.x/u_resolution.y;
  float ang=atan(d.x,-d.y);
  float dist=length(d);
  float t=u_time*0.25;
  float rays=0.55+0.45*sin(ang*18.0+t*1.3+noise(vec2(ang*4.0,t))*3.0);
  rays*=0.6+0.4*sin(ang*7.0-t*0.8);
  rays*=0.7+0.3*noise(vec2(ang*12.0,dist*3.0-t));
  rays=pow(rays,2.2);
  float fall=smoothstep(1.35,0.35,dist);
  gl_FragColor=vec4(u_color0,rays*fall*u_opacity);
}`;

/** پرتو نور. Light shafts falling from the top edge and slowly swaying. WebGL via ShaderCanvas. */
export function GodraysBackground({ speed = 1, opacity = 0.45, className }: { speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--brand"]} uniforms={{ u_opacity: opacity }} speed={speed} className={className} />;
}
