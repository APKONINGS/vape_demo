// SQLite has no native enum support in Prisma, so Role/OrderStatus are plain String
// columns in schema.prisma, constrained at the application layer by these literal unions.

export const ROLES = ["ADMIN", "CUSTOMER"] as const;
export type Role = (typeof ROLES)[number];

export const ORDER_STATUSES = ["PENDING", "PAID", "FULFILLED", "CANCELLED", "REFUNDED"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const VAPE_TYPES = ["DISPOSABLE", "POD_SYSTEM", "MOD_TANK", "E_LIQUID", "ANY"] as const;
export type VapeType = (typeof VAPE_TYPES)[number];

export const NAV_VAPE_TYPES = [
  { slug: "disposables", label: "Disposables", value: "DISPOSABLE" },
  { slug: "pod-systems", label: "Pod Systems & Kits", value: "POD_SYSTEM" },
  { slug: "mods-tanks", label: "Mods & Tanks", value: "MOD_TANK" },
  { slug: "e-liquids", label: "E-Liquids", value: "E_LIQUID" },
] as const satisfies ReadonlyArray<{ slug: string; label: string; value: Exclude<VapeType, "ANY"> }>;

// Category slugs in the DB follow `${vapeTypeSlug}-${type}` (see prisma/seed.ts), so
// the /[vapeType]/[category] route and the header mega menu both derive links from
// this list. Flavor profile applies across every vape type (disposables, pod-kit juice,
// mod/tank juice, and standalone e-liquid bottles all come in these profiles); the
// "accessories" bucket covers the non-flavor items each vape type also needs (coils,
// batteries, chargers, cases, nic shots, etc.).
export const PRODUCT_TYPES = [
  { type: "fruit", label: "Fruit" },
  { type: "menthol-ice", label: "Menthol & Ice" },
  { type: "dessert-sweet", label: "Dessert & Sweet" },
  { type: "tobacco-classic", label: "Tobacco & Classic" },
  { type: "accessories", label: "Accessories" },
] as const;

// Minimum age required to confirm entry via the age-verification gate — vaping/nicotine
// products are age-restricted (18+). See components/age-gate.tsx.
export const AGE_GATE_MINIMUM_AGE = 18;

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
