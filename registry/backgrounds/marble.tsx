"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_scale;uniform float u_opacity;
void main(){
  vec2 p=gl_FragCoord.xy/u_resolution.y*u_scale;
  float t=u_time*0.04;
  vec2 q=vec2(fbm(p+t),fbm(p+vec2(5.2,1.3)-t));
  float v=fbm(p+2.5*q);
  float veins=abs(sin((p.x+p.y)*1.5+v*8.0));
  veins=pow(1.0-veins,4.0);
  float body=smoothstep(0.35,0.8,v)*0.35;
  float a=clamp(veins*0.9+body,0.0,1.0);
  vec3 col=mix(u_color0,u_color1,veins*0.6);
  gl_FragColor=vec4(col,a*u_opacity);
}`;

/** مرمر. Domain-warped noise folded into sharp veins, like polished stone. WebGL via ShaderCanvas. */
export function MarbleBackground({ scale = 1.5, speed = 1, opacity = 0.35, className }: { scale?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--foreground", "--brand"]} uniforms={{ u_scale: scale, u_opacity: opacity }} speed={speed} className={className} />;
}
