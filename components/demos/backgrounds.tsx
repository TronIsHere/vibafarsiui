"use client";

import { GridBackground } from "@/registry/backgrounds/grid";
import { DotsBackground } from "@/registry/backgrounds/dots";
import { GirihBackground } from "@/registry/backgrounds/girih";
import { HatchBackground } from "@/registry/backgrounds/hatch";
import { AuroraBackground } from "@/registry/backgrounds/aurora";
import { SpotlightBackground } from "@/registry/backgrounds/spotlight";
import { GrainBackground } from "@/registry/backgrounds/grain";
import { RetroGridBackground } from "@/registry/backgrounds/retro-grid";
import { MeshBackground } from "@/registry/backgrounds/mesh";
import { FlickerBackground } from "@/registry/backgrounds/flicker";
import { RingsBackground } from "@/registry/backgrounds/rings";
import { GradientMeshBackground } from "@/registry/backgrounds/gradient-mesh";
import { ConicSpinBackground } from "@/registry/backgrounds/conic-spin";
import { LightLeakBackground } from "@/registry/backgrounds/light-leak";
import { StarsBackground } from "@/registry/backgrounds/stars";
import { SonarBackground } from "@/registry/backgrounds/sonar";
import { DotWaveBackground } from "@/registry/backgrounds/dot-wave";
import { AuroraRibbonsBackground } from "@/registry/backgrounds/aurora-ribbons";
import { GradientGrainBackground } from "@/registry/backgrounds/gradient-grain";
import { MovingStripesBackground } from "@/registry/backgrounds/moving-stripes";
import { ShaderCanvas } from "@/registry/backgrounds/shader";
import { SilkBackground } from "@/registry/backgrounds/silk";
import { FogBackground } from "@/registry/backgrounds/fog";
import { NebulaBackground } from "@/registry/backgrounds/nebula";
import { ContourBackground } from "@/registry/backgrounds/contour";
import { VoronoiBackground } from "@/registry/backgrounds/voronoi";
import { WarpGridBackground } from "@/registry/backgrounds/warp-grid";
import { GodraysBackground } from "@/registry/backgrounds/godrays";
import { WaterRippleBackground } from "@/registry/backgrounds/water-ripple";
import { DitherBackground } from "@/registry/backgrounds/dither";
import { HalftoneBackground } from "@/registry/backgrounds/halftone";
import { WavesBackground } from "@/registry/backgrounds/waves";
import { PlasmaBackground } from "@/registry/backgrounds/plasma";
import { TruchetBackground } from "@/registry/backgrounds/truchet";
import { HexGridBackground } from "@/registry/backgrounds/hex-grid";
import { MarbleBackground } from "@/registry/backgrounds/marble";
import { MetaballsBackground } from "@/registry/backgrounds/metaballs";
import { KaleidoscopeBackground } from "@/registry/backgrounds/kaleidoscope";
import { CursorTrailBackground } from "@/registry/backgrounds/cursor-trail";
import { ParticlesBackground } from "@/registry/backgrounds/particles";
import { MoireBackground } from "@/registry/backgrounds/moire";
import { ScanlinesBackground } from "@/registry/backgrounds/scanlines";
import { IsoCubesBackground } from "@/registry/backgrounds/iso-cubes";
import { LiquidGradientBackground } from "@/registry/backgrounds/liquid-gradient";

/** The shader primitive's own demo: the usage example from its docs page. */
const HELLO_SHADER = /* glsl */ `
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float glow = smoothstep(0.7, 0.0, distance(uv, u_pointer));
  vec3 color = mix(u_color0, u_color1, uv.y);
  gl_FragColor = vec4(color, glow * 0.35);
}`;

/** Each demo is an absolutely-positioned layer; render inside a `relative overflow-hidden` box. */
export const backgroundDemos: Record<string, React.ReactNode> = {
  grid: <GridBackground />,
  dots: <DotsBackground />,
  girih: <GirihBackground />,
  hatch: <HatchBackground />,
  aurora: <AuroraBackground />,
  spotlight: <SpotlightBackground />,
  grain: <GrainBackground />,
  "retro-grid": <RetroGridBackground />,
  mesh: <MeshBackground />,
  flicker: <FlickerBackground />,
  rings: <RingsBackground />,
  "gradient-mesh": <GradientMeshBackground />,
  "conic-spin": <ConicSpinBackground />,
  "light-leak": <LightLeakBackground />,
  stars: <StarsBackground />,
  sonar: <SonarBackground />,
  "dot-wave": <DotWaveBackground />,
  "aurora-ribbons": <AuroraRibbonsBackground />,
  "gradient-grain": <GradientGrainBackground />,
  "moving-stripes": <MovingStripesBackground />,
  shader: <ShaderCanvas fragment={HELLO_SHADER} colors={["--brand", "--foreground"]} pointer />,
  silk: <SilkBackground />,
  fog: <FogBackground />,
  nebula: <NebulaBackground />,
  contour: <ContourBackground />,
  voronoi: <VoronoiBackground />,
  "warp-grid": <WarpGridBackground />,
  godrays: <GodraysBackground />,
  "water-ripple": <WaterRippleBackground />,
  dither: <DitherBackground />,
  halftone: <HalftoneBackground />,
  waves: <WavesBackground />,
  plasma: <PlasmaBackground />,
  truchet: <TruchetBackground />,
  "hex-grid": <HexGridBackground />,
  marble: <MarbleBackground />,
  metaballs: <MetaballsBackground />,
  kaleidoscope: <KaleidoscopeBackground />,
  "cursor-trail": <CursorTrailBackground />,
  particles: <ParticlesBackground />,
  moire: <MoireBackground />,
  scanlines: <ScanlinesBackground />,
  "iso-cubes": <IsoCubesBackground />,
  "liquid-gradient": <LiquidGradientBackground />,
};
