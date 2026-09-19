import type { ComponentType } from "react";

export type DemoLoader = () => Promise<{ default: ComponentType<{ replay?: number }> }>;

function named<M, K extends keyof M>(load: () => Promise<M>, key: K): DemoLoader {
  return () => load().then((m) => ({ default: m[key] as ComponentType<{ replay?: number }> }));
}

/** Live peeks on `/` only. `/templates` loads the rest on viewport. */
export const HOME_TEMPLATE_SLUGS = ["shop-dashboard", "startup-landing", "store", "auth"] as const;

export const templateLoaders: Record<string, DemoLoader> = {
  "shop-dashboard": named(() => import("@/registry/templates/shop-dashboard"), "ShopDashboard"),
  auth: named(() => import("@/registry/templates/auth"), "AuthPage"),
  "startup-landing": named(() => import("@/registry/templates/startup-landing"), "StartupLanding"),
  pricing: named(() => import("@/registry/templates/pricing"), "PricingPage"),
  "ai-chat": named(() => import("@/registry/templates/ai-chat"), "AiChat"),
  invoice: named(() => import("@/registry/templates/invoice"), "InvoicePage"),
  blog: named(() => import("@/registry/templates/blog"), "BlogPost"),
  settings: named(() => import("@/registry/templates/settings"), "SettingsPage"),
  checkout: named(() => import("@/registry/templates/checkout"), "CheckoutPage"),
  store: named(() => import("@/registry/templates/store"), "StorePage"),
  onboarding: named(() => import("@/registry/templates/onboarding"), "OnboardingPage"),
  "admin-orders": named(() => import("@/registry/templates/admin-orders"), "AdminOrdersPage"),
  booking: named(() => import("@/registry/templates/booking"), "BookingPage"),
  wallet: named(() => import("@/registry/templates/wallet"), "WalletPage"),
  "error-pages": named(() => import("@/registry/templates/error-pages"), "ErrorPagesDemo"),
  email: named(() => import("@/registry/templates/email"), "EmailPreview"),
  "saas-landing": named(() => import("@/registry/templates/saas-landing"), "SaasLanding"),
  "finance-dashboard": named(() => import("@/registry/templates/finance-dashboard"), "FinanceDashboard"),
  "food-delivery": named(() => import("@/registry/templates/food-delivery"), "FoodDelivery"),
  kanban: named(() => import("@/registry/templates/kanban"), "KanbanBoard"),
  course: named(() => import("@/registry/templates/course"), "CoursePage"),
  receipt: named(() => import("@/registry/templates/receipt"), "PaymentReceipt"),
  "travel-search": named(() => import("@/registry/templates/travel-search"), "TravelSearch"),
  "coming-soon": named(() => import("@/registry/templates/coming-soon"), "ComingSoon"),
};

export const backgroundLoaders: Record<string, DemoLoader> = {
  grid: named(() => import("@/registry/backgrounds/grid"), "GridBackground"),
  dots: named(() => import("@/registry/backgrounds/dots"), "DotsBackground"),
  girih: named(() => import("@/registry/backgrounds/girih"), "GirihBackground"),
  hatch: named(() => import("@/registry/backgrounds/hatch"), "HatchBackground"),
  aurora: named(() => import("@/registry/backgrounds/aurora"), "AuroraBackground"),
  spotlight: named(() => import("@/registry/backgrounds/spotlight"), "SpotlightBackground"),
  grain: named(() => import("@/registry/backgrounds/grain"), "GrainBackground"),
  "retro-grid": named(() => import("@/registry/backgrounds/retro-grid"), "RetroGridBackground"),
  mesh: named(() => import("@/registry/backgrounds/mesh"), "MeshBackground"),
  flicker: named(() => import("@/registry/backgrounds/flicker"), "FlickerBackground"),
  rings: named(() => import("@/registry/backgrounds/rings"), "RingsBackground"),
  "gradient-mesh": named(() => import("@/registry/backgrounds/gradient-mesh"), "GradientMeshBackground"),
  "conic-spin": named(() => import("@/registry/backgrounds/conic-spin"), "ConicSpinBackground"),
  "light-leak": named(() => import("@/registry/backgrounds/light-leak"), "LightLeakBackground"),
  stars: named(() => import("@/registry/backgrounds/stars"), "StarsBackground"),
  sonar: named(() => import("@/registry/backgrounds/sonar"), "SonarBackground"),
  "dot-wave": named(() => import("@/registry/backgrounds/dot-wave"), "DotWaveBackground"),
  "aurora-ribbons": named(() => import("@/registry/backgrounds/aurora-ribbons"), "AuroraRibbonsBackground"),
  "gradient-grain": named(() => import("@/registry/backgrounds/gradient-grain"), "GradientGrainBackground"),
  "moving-stripes": named(() => import("@/registry/backgrounds/moving-stripes"), "MovingStripesBackground"),
  shader: () => import("./shader-hello"),
  silk: named(() => import("@/registry/backgrounds/silk"), "SilkBackground"),
  fog: named(() => import("@/registry/backgrounds/fog"), "FogBackground"),
  nebula: named(() => import("@/registry/backgrounds/nebula"), "NebulaBackground"),
  contour: named(() => import("@/registry/backgrounds/contour"), "ContourBackground"),
  voronoi: named(() => import("@/registry/backgrounds/voronoi"), "VoronoiBackground"),
  "warp-grid": named(() => import("@/registry/backgrounds/warp-grid"), "WarpGridBackground"),
  godrays: named(() => import("@/registry/backgrounds/godrays"), "GodraysBackground"),
  "water-ripple": named(() => import("@/registry/backgrounds/water-ripple"), "WaterRippleBackground"),
  dither: named(() => import("@/registry/backgrounds/dither"), "DitherBackground"),
  halftone: named(() => import("@/registry/backgrounds/halftone"), "HalftoneBackground"),
  waves: named(() => import("@/registry/backgrounds/waves"), "WavesBackground"),
};

export function loadComponentDemo(slug: string): DemoLoader {
  return () =>
    import("./components").then((m) => ({
      default: function ComponentDemo() {
        return m.componentDemos[slug] ?? null;
      },
    }));
}

export function loadAnimationDemo(slug: string): DemoLoader {
  return () =>
    import("./animations").then((m) => ({
      default: function AnimationDemo({ replay = 0 }: { replay?: number }) {
        return m.animationDemos[slug]?.(replay) ?? null;
      },
    }));
}

export function loadBlockDemo(slug: string): DemoLoader {
  return () =>
    import("./blocks").then((m) => ({
      default: function BlockDemo() {
        return m.blockDemos[slug] ?? null;
      },
    }));
}

export function loadDemo(
  kind: "component" | "animation" | "background" | "block" | "template",
  slug: string,
): DemoLoader | undefined {
  switch (kind) {
    case "component":
      return loadComponentDemo(slug);
    case "animation":
      return loadAnimationDemo(slug);
    case "background":
      return backgroundLoaders[slug];
    case "block":
      return loadBlockDemo(slug);
    case "template":
      return templateLoaders[slug];
  }
}
