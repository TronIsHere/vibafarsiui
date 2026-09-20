"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_gap;uniform float u_opacity;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution;
  float px=u_gap*u_dpr;
  float line=0.5+0.5*sin(gl_FragCoord.y/px*PI*2.0);
  line=smoothstep(0.3,0.9,line);
  float bar=1.0-smoothstep(0.0,0.14,abs(fract(uv.y-u_time*0.05)-0.5));
  float flick=0.9+0.1*noise(vec2(u_time*3.0,0.0));
  float grain=hash(floor(gl_FragCoord.xy/u_dpr)+floor(u_time*12.0))*0.12;
  float vig=1.0-smoothstep(0.35,0.95,distance(uv,vec2(0.5))*1.15);
  float a=(line*0.55+bar*0.35+grain)*vig*flick;
  gl_FragColor=vec4(u_color0,a*u_opacity);
}`;

/** اسکن‌لاین. CRT phosphor lines, a slow rolling bar, faint static, and a vignette. WebGL via ShaderCanvas. */
export function ScanlinesBackground({ gap = 3, speed = 1, opacity = 0.3, className }: { gap?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--foreground"]} uniforms={{ u_gap: gap, u_opacity: opacity }} speed={speed} className={className} />;
}
