"use client";

import { ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = /* glsl */ `
uniform float u_opacity;
float seg(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-5),0.0,1.0);return length(pa-ba*h);}
float fade(float age){return age<0.0?0.0:exp(-age*1.4);}
float link(vec2 p,vec3 a,vec3 b,vec2 asp){
  float dt=b.z-a.z;
  if(dt<=0.0||dt>0.5)return 0.0;
  float age=u_time-b.z;
  return exp(-seg(p,a.xy*asp,b.xy*asp)*55.0)*fade(age);
}
void main(){
  vec2 asp=vec2(u_resolution.x/u_resolution.y,1.0);
  vec2 p=gl_FragCoord.xy/u_resolution*asp;
  float g=0.0;
  float newest=-1e3;
  vec3 prev=u_trail[0];
  g+=exp(-distance(p,prev.xy*asp)*70.0)*fade(u_time-prev.z);
  newest=max(newest,prev.z);
  for(int i=1;i<8;i++){
    vec3 c=u_trail[i];
    g+=exp(-distance(p,c.xy*asp)*70.0)*fade(u_time-c.z);
    g+=link(p,prev,c,asp);
    newest=max(newest,c.z);
    prev=c;
  }
  g+=link(p,u_trail[7],u_trail[0],asp);
  float idle=smoothstep(1.0,2.5,u_time-newest);
  if(idle>0.0){
    for(int k=0;k<8;k++){
      float tk=u_time-float(k)*0.09;
      vec2 c=vec2(0.5+0.36*sin(tk*0.6),0.5+0.3*sin(tk*0.9+1.3))*asp;
      g+=exp(-distance(p,c)*70.0)*exp(-float(k)*0.35)*idle;
    }
  }
  g=clamp(g,0.0,1.0);
  vec3 col=mix(u_color0,u_color1,g*g);
  gl_FragColor=vec4(col,g*u_opacity);
}`;

/** رد ماوس. A comet that follows the pointer and, when idle, wanders on its own. WebGL via ShaderCanvas; needs a parent that receives pointer events. */
export function CursorTrailBackground({ speed = 1, opacity = 0.6, className }: { speed?: number; opacity?: number; className?: string }) {
  return <ShaderCanvas fragment={FRAG} colors={["--brand", "--foreground"]} uniforms={{ u_opacity: opacity }} speed={speed} pointer className={className} />;
}
