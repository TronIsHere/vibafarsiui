"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_segments;uniform float u_opacity;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution;
  vec2 c=uv-0.5;
  c.x*=u_resolution.x/u_resolution.y;
  float r=length(c);
  float a=atan(c.y,c.x)+u_time*0.03;
  float seg=PI*2.0/u_segments;
  a=mod(a,seg);
  a=abs(a-seg*0.5);
  vec2 p=vec2(cos(a),sin(a))*r;
  float t=u_time*0.08;
  float v=fbm(p*3.0+vec2(t,-t*0.7));
  float rings=abs(sin(r*20.0-u_time*0.3+v*6.0));
  float pat=smoothstep(0.5,0.95,v)*0.7+pow(1.0-rings,6.0)*0.6;
  vec3 col=mix(u_color0,u_color1,v);
  float mask=1.0-smoothstep(0.3,0.8,r);
  gl_FragColor=vec4(col,pat*mask*u_opacity);
}`;

/** کلایدوسکوپ. Noise folded into mirrored wedges that slowly turn around the center. WebGL via ShaderCanvas. */
export function KaleidoscopeBackground({ segments = 8, speed = 1, opacity = 0.35, className }: { segments?: number; speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--brand", "--foreground"]} uniforms={{ u_segments: segments, u_opacity: opacity }} speed={speed} className={className} />;
}
