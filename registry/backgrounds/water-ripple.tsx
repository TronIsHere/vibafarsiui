"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_opacity;
float ring(vec2 p,vec2 c,float age){
  if(age<0.0||age>2.5)return 0.0;
  float r=distance(p,c);
  float front=age*0.35;
  float w=sin((r-front)*80.0)*exp(-abs(r-front)*18.0);
  return w*exp(-age*1.6)*smoothstep(front+0.05,front-0.05,r);
}
void main(){
  vec2 asp=vec2(u_resolution.x/u_resolution.y,1.0);
  vec2 uv=gl_FragCoord.xy/u_resolution;
  vec2 p=uv*asp;
  float h=0.0;
  for(int i=0;i<8;i++){vec3 d=u_trail[i];h+=ring(p,d.xy*asp,u_time-d.z);}
  for(int j=0;j<3;j++){
    float fj=float(j);
    float cyc=floor(u_time*0.3+fj*0.37);
    float ph=fract(u_time*0.3+fj*0.37)/0.3;
    vec2 c=vec2(hash(vec2(cyc,fj)),hash(vec2(fj,cyc)+3.1))*asp;
    h+=ring(p,c,ph)*0.6;
  }
  float caustic=pow(fbm(p*6.0+u_time*0.1),4.0)*0.25;
  float a=clamp(abs(h)*2.2+caustic,0.0,1.0);
  gl_FragColor=vec4(u_color0,a*u_opacity);
}`;

/** موج آب. Rings spread from the pointer; a few drops fall on their own. WebGL via ShaderCanvas; needs a parent that receives pointer events. */
export function WaterRippleBackground({ speed = 1, opacity = 0.6, className }: { speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--foreground"]} uniforms={{ u_opacity: opacity }} speed={speed} pointer className={className} />;
}
