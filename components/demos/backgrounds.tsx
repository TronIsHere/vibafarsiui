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
};
