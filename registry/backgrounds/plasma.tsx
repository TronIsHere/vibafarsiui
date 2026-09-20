"use client";

import { ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = /* glsl */ `
uniform float u_scale;uniform float u_opacity;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution;
  vec2 p=uv;
  p.x*=u_resolution.x/u_resolution.y;
  p*=u_scale;
  float t=u_time*0.3;
  float v=sin(p.x+t);
  v+=sin((p.y+t)*0.7);
  v+=sin((p.x+p.y+t)*0.5);
  vec2 c=p+vec2(sin(t*0.7),cos(t*0.5))*1.5;
  v+=sin(length(c)*1.2-t);
  v*=0.25;
  float a=0.5+0.5*sin(v*PI);
  a=smoothstep(0.15,1.0,a);
  vec3 col=mix(u_color0,u_color1,0.5+0.5*sin(v*PI+2.0));
  float mask=1.0-smoothstep(0.45,1.0,distance(uv,vec2(0.5)));
  gl_FragColor=vec4(col,a*mask*u_opacity);
}`;

/** پلاسما. The classic demoscene sine plasma, slowed down and dimmed. WebGL via ShaderCanvas. */
export function PlasmaBackground({ scale = 3, speed = 1, opacity = 0.3, className }: { scale?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--brand", "--foreground"]} uniforms={{ u_scale: scale, u_opacity: opacity }} speed={speed} className={className} />;
}
