// SQLite has no native enum support in Prisma, so Role/OrderStatus are plain String
// columns in schema.prisma, constrained at the application layer by these literal unions.

export const ROLES = ["ADMIN", "CUSTOMER"] as const;
export type Role = (typeof ROLES)[number];

export const ORDER_STATUSES = ["PENDING", "PAID", "FULFILLED", "CANCELLED", "REFUNDED"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const VEHICLE_TYPES = ["SEDAN", "SUV", "TRUCK", "ANY"] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const NAV_VEHICLE_TYPES = [
  { slug: "sedans", label: "Sedans", value: "SEDAN" },
  { slug: "suvs", label: "SUVs & Crossovers", value: "SUV" },
  { slug: "trucks", label: "Trucks & Vans", value: "TRUCK" },
] as const satisfies ReadonlyArray<{ slug: string; label: string; value: Exclude<VehicleType, "ANY"> }>;

// Category slugs in the DB follow `${vehicleTypeSlug}-${type}` (see prisma/seed.ts), so
// the /[vehicleType]/[category] route and the header mega menu both derive links from
// this list.
export const PRODUCT_TYPES = [
  { type: "exterior", label: "Exterior" },
  { type: "interior", label: "Interior" },
  { type: "electronics", label: "Electronics" },
  { type: "tires-wheels", label: "Tires & Wheels" },
  { type: "accessories", label: "Accessories" },
] as const;

// Placeholder hrefs — swap in the real profile URLs once these accounts exist.
// icon names map to lucide-react components (see components/site-footer.tsx).
export const SOCIAL_LINKS = [
  { label: "Instagram", icon: "Instagram", href: "#" },
  { label: "Facebook", icon: "Facebook", href: "#" },
  { label: "X (Twitter)", icon: "Twitter", href: "#" },
  { label: "YouTube", icon: "Youtube", href: "#" },
] as const;

// Flat-rate shipping — stakeholders have confirmed shipping is not free. Charged as a
// Stripe Checkout shipping_option (see app/api/stripe/checkout/route.ts) so it's part of
// the same payment, not a separate charge.
export const SHIPPING_FEE_CENTS = 1299;
