import { ShopDashboard } from "@/registry/templates/shop-dashboard";
import { AuthPage } from "@/registry/templates/auth";
import { StartupLanding } from "@/registry/templates/startup-landing";
import { PricingPage } from "@/registry/templates/pricing";
import { AiChat } from "@/registry/templates/ai-chat";
import { InvoicePage } from "@/registry/templates/invoice";
import { BlogPost } from "@/registry/templates/blog";
import { SettingsPage } from "@/registry/templates/settings";
import { CheckoutPage } from "@/registry/templates/checkout";
import { StorePage } from "@/registry/templates/store";
import { OnboardingPage } from "@/registry/templates/onboarding";
import { AdminOrdersPage } from "@/registry/templates/admin-orders";
import { BookingPage } from "@/registry/templates/booking";
import { WalletPage } from "@/registry/templates/wallet";
import { ErrorPagesDemo } from "@/registry/templates/error-pages";
import { EmailPreview } from "@/registry/templates/email";

export const templateComponents: Record<string, React.ComponentType> = {
  "shop-dashboard": ShopDashboard,
  auth: AuthPage,
  "startup-landing": StartupLanding,
  pricing: PricingPage,
  "ai-chat": AiChat,
  invoice: InvoicePage,
  blog: BlogPost,
  settings: SettingsPage,
  checkout: CheckoutPage,
  store: StorePage,
  onboarding: OnboardingPage,
  "admin-orders": AdminOrdersPage,
  booking: BookingPage,
  wallet: WalletPage,
  "error-pages": ErrorPagesDemo,
  email: EmailPreview,
};
