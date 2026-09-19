"use client";

import { ShaderCanvas } from "@/registry/backgrounds/shader";

const HELLO_SHADER = /* glsl */ `
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float glow = smoothstep(0.7, 0.0, distance(uv, u_pointer));
  vec3 color = mix(u_color0, u_color1, uv.y);
  gl_FragColor = vec4(color, glow * 0.35);
}`;

/** The shader primitive's own demo: the usage example from its docs page. */
export default function ShaderHello() {
  return <ShaderCanvas fragment={HELLO_SHADER} colors={["--brand", "--foreground"]} pointer />;
}
