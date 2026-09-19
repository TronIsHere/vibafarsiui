import { trackPageview } from "./lib/analytics/client";

trackPageview();

export function onRouterTransitionStart(url: string) {
  trackPageview(url);
}
