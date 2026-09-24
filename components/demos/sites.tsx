import type * as React from "react";
import { SiteBase as AgencyBase } from "@/registry/sites/agency-site/shell";
import { HomePage as AgencyHome } from "@/registry/sites/agency-site/home";
import { WorkPage as AgencyWork } from "@/registry/sites/agency-site/work";
import { ServicesPage as AgencyServices } from "@/registry/sites/agency-site/services";
import { AboutPage as AgencyAbout } from "@/registry/sites/agency-site/about";
import { ContactPage as AgencyContact } from "@/registry/sites/agency-site/contact";
import { SiteBase as SaasBase } from "@/registry/sites/saas-site/shell";
import { HomePage as SaasHome } from "@/registry/sites/saas-site/home";
import { FeaturesPage as SaasFeatures } from "@/registry/sites/saas-site/features";
import { PricingPage as SaasPricing } from "@/registry/sites/saas-site/pricing";
import { BlogPage as SaasBlog } from "@/registry/sites/saas-site/blog";
import { LoginPage as SaasLogin } from "@/registry/sites/saas-site/login";
import { SiteBase as ShopBase } from "@/registry/sites/shop-site/shell";
import { HomePage as ShopHome } from "@/registry/sites/shop-site/home";
import { ShopPage as ShopShop } from "@/registry/sites/shop-site/shop";
import { ProductPage as ShopProduct } from "@/registry/sites/shop-site/product";
import { CartPage as ShopCart } from "@/registry/sites/shop-site/cart";
import { AboutPage as ShopAbout } from "@/registry/sites/shop-site/about";
import { SiteBase as ClinicBase } from "@/registry/sites/clinic-site/shell";
import { HomePage as ClinicHome } from "@/registry/sites/clinic-site/home";
import { ServicesPage as ClinicServices } from "@/registry/sites/clinic-site/services";
import { DoctorsPage as ClinicDoctors } from "@/registry/sites/clinic-site/doctors";
import { BookingPage as ClinicBooking } from "@/registry/sites/clinic-site/booking";
import { ContactPage as ClinicContact } from "@/registry/sites/clinic-site/contact";
import { SiteBase as RestaurantBase } from "@/registry/sites/restaurant-site/shell";
import { HomePage as RestaurantHome } from "@/registry/sites/restaurant-site/home";
import { MenuPage as RestaurantMenu } from "@/registry/sites/restaurant-site/menu";
import { ReservePage as RestaurantReserve } from "@/registry/sites/restaurant-site/reserve";
import { AboutPage as RestaurantAbout } from "@/registry/sites/restaurant-site/about";
import { ContactPage as RestaurantContact } from "@/registry/sites/restaurant-site/contact";
import { SiteBase as LodgeBase } from "@/registry/sites/lodge-site/shell";
import { HomePage as LodgeHome } from "@/registry/sites/lodge-site/home";
import { RoomsPage as LodgeRooms } from "@/registry/sites/lodge-site/rooms";
import { ExperiencesPage as LodgeExperiences } from "@/registry/sites/lodge-site/experiences";
import { BookPage as LodgeBook } from "@/registry/sites/lodge-site/book";
import { AboutPage as LodgeAbout } from "@/registry/sites/lodge-site/about";

export type SiteDemo = {
  /** The site's own base-path provider, so its internal links stay inside /preview/site/<slug>. */
  Base: React.ComponentType<{ base: string; children: React.ReactNode }>;
  /** Page components keyed by route path ("" is the home page). */
  pages: Record<string, React.ComponentType>;
};

/** Every site page, for /preview/site/<slug>/<path>. */
export const siteDemos: Record<string, SiteDemo> = {
  "agency-site": {
    Base: AgencyBase,
    pages: { "": AgencyHome, work: AgencyWork, services: AgencyServices, about: AgencyAbout, contact: AgencyContact },
  },
  "saas-site": {
    Base: SaasBase,
    pages: { "": SaasHome, features: SaasFeatures, pricing: SaasPricing, blog: SaasBlog, login: SaasLogin },
  },
  "shop-site": {
    Base: ShopBase,
    pages: { "": ShopHome, shop: ShopShop, product: ShopProduct, cart: ShopCart, about: ShopAbout },
  },
  "clinic-site": {
    Base: ClinicBase,
    pages: { "": ClinicHome, services: ClinicServices, doctors: ClinicDoctors, booking: ClinicBooking, contact: ClinicContact },
  },
  "restaurant-site": {
    Base: RestaurantBase,
    pages: { "": RestaurantHome, menu: RestaurantMenu, reserve: RestaurantReserve, about: RestaurantAbout, contact: RestaurantContact },
  },
  "lodge-site": {
    Base: LodgeBase,
    pages: { "": LodgeHome, rooms: LodgeRooms, experiences: LodgeExperiences, book: LodgeBook, about: LodgeAbout },
  },
};
