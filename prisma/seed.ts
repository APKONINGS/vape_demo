import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const toJson = (values: string[]) => JSON.stringify(values);

const DEVICE_COLORS = ["Black", "Silver", "Blue", "Red", "Teal"];
const NIC_STRENGTHS = ["0mg", "20mg", "50mg"];

// Product photography is intentionally NOT sourced from guessed stock-photo IDs — an
// earlier version of this seed picked Unsplash photo IDs from memory without ever
// visually confirming their contents, and one of them turned out to render a copyrighted
// character photo instead of the intended product. These generated placeholders (plain
// color + text label, no photographic content at all) remove that risk entirely. Swap
// them for real product photography once the client provides it.
const PLACEHOLDER_SHADES = ["e5e7eb", "d1d5db"] as const;

function placeholderImage(title: string, index: number): string {
  const bg = PLACEHOLDER_SHADES[index % PLACEHOLDER_SHADES.length];
  const label = encodeURIComponent(index === 0 ? title : `${title} — Alt View`);
  // .png forces a raster response — Next/Image's optimizer blocks remote SVG by default
  // (placehold.co's default format) as an XSS precaution.
  return `https://placehold.co/800x1000/${bg}/1f2937.png?text=${label}`;
}

// Category slugs follow a fixed `${vapeTypeSlug}-${type}` convention so the
// /[vapeType]/[category] route can reconstruct a lookup key from the URL alone
// (see getProductsByCategorySlug in lib/products.ts) without an extra join table.
const VAPE_TYPES = [
  { slug: "disposables", name: "Disposables", vapeType: "DISPOSABLE" },
  { slug: "pod-systems", name: "Pod Systems & Kits", vapeType: "POD_SYSTEM" },
  { slug: "mods-tanks", name: "Mods & Tanks", vapeType: "MOD_TANK" },
  { slug: "e-liquids", name: "E-Liquids", vapeType: "E_LIQUID" },
] as const;

// Flavor profile applies across every vape type — the "accessories" bucket covers the
// non-flavor items each type also needs (coils, batteries, chargers, cases, nic shots).
const TYPES = [
  { type: "fruit", label: "Fruit" },
  { type: "menthol-ice", label: "Menthol & Ice" },
  { type: "dessert-sweet", label: "Dessert & Sweet" },
  { type: "tobacco-classic", label: "Tobacco & Classic" },
  { type: "accessories", label: "Accessories" },
] as const;

const collections = [
  { slug: "new-arrivals", title: "New Arrivals" },
  { slug: "best-sellers", title: "Best Sellers" },
  { slug: "sale", title: "Sale" },
] as const;

interface SeedProduct {
  slug: string;
  title: string;
  description: string;
  price: number;
  salePrice?: number;
  sizes: string[];
  colors: string[];
  imageCount: 1 | 2;
  stock: number;
  category: string; // `${vapeTypeSlug}-${type}`
  collections: string[];
}

const products: SeedProduct[] = [
  // --- Disposables / Fruit ---
  {
    slug: "disposable-tropical-mango-ice-3500",
    title: "Tropical Mango Ice Disposable (3500 Puffs)",
    description: "Ripe mango over a cool menthol finish in a pocket-sized disposable — no charging, no refilling.",
    price: 1999,
    colors: DEVICE_COLORS.slice(0, 3),
    sizes: ["3500 Puffs"],
    imageCount: 2,
    stock: 60,
    category: "disposables-fruit",
    collections: ["new-arrivals"],
  },
  {
    slug: "disposable-watermelon-burst-5000",
    title: "Watermelon Burst Disposable (5000 Puffs)",
    description: "A juicy, all-day watermelon flavor with a long-lasting battery and pre-filled pod.",
    price: 2499,
    colors: DEVICE_COLORS.slice(0, 3),
    sizes: ["5000 Puffs"],
    imageCount: 1,
    stock: 54,
    category: "disposables-fruit",
    collections: ["best-sellers"],
  },

  // --- Disposables / Menthol & Ice ---
  {
    slug: "disposable-blue-razz-ice-3500",
    title: "Blue Razz Ice Disposable (3500 Puffs)",
    description: "Tangy blue raspberry with an icy menthol kick, in a sleek pre-charged disposable.",
    price: 1999,
    colors: DEVICE_COLORS.slice(0, 3),
    sizes: ["3500 Puffs"],
    imageCount: 1,
    stock: 58,
    category: "disposables-menthol-ice",
    collections: ["best-sellers"],
  },
  {
    slug: "disposable-peppermint-frost-600",
    title: "Peppermint Frost Disposable (600 Puffs)",
    description: "A crisp peppermint disposable sized for trying a new flavor without committing to a big device.",
    price: 1099,
    salePrice: 899,
    colors: DEVICE_COLORS.slice(0, 2),
    sizes: ["600 Puffs"],
    imageCount: 1,
    stock: 70,
    category: "disposables-menthol-ice",
    collections: ["sale"],
  },

  // --- Disposables / Dessert & Sweet ---
  {
    slug: "disposable-vanilla-custard-3500",
    title: "Vanilla Custard Disposable (3500 Puffs)",
    description: "A smooth, creamy vanilla custard flavor that holds up puff after puff.",
    price: 1999,
    colors: DEVICE_COLORS.slice(1, 4),
    sizes: ["3500 Puffs"],
    imageCount: 1,
    stock: 46,
    category: "disposables-dessert-sweet",
    collections: [],
  },
  {
    slug: "disposable-strawberry-cream-5000",
    title: "Strawberry Cream Disposable (5000 Puffs)",
    description: "Sweet strawberry balanced with a light cream note, in our longest-lasting disposable size.",
    price: 2499,
    colors: DEVICE_COLORS.slice(1, 4),
    sizes: ["5000 Puffs"],
    imageCount: 2,
    stock: 40,
    category: "disposables-dessert-sweet",
    collections: ["new-arrivals"],
  },

  // --- Disposables / Tobacco & Classic ---
  {
    slug: "disposable-classic-tobacco-600",
    title: "Classic Tobacco Disposable (600 Puffs)",
    description: "A straightforward tobacco flavor for vapers who want the classic taste without the extras.",
    price: 1099,
    colors: ["Black", "Silver"],
    sizes: ["600 Puffs"],
    imageCount: 1,
    stock: 50,
    category: "disposables-tobacco-classic",
    collections: [],
  },
  {
    slug: "disposable-rich-tobacco-3500",
    title: "Rich Tobacco Disposable (3500 Puffs)",
    description: "A bolder, more robust tobacco profile in our mid-size disposable format.",
    price: 1999,
    colors: ["Black", "Silver"],
    sizes: ["3500 Puffs"],
    imageCount: 1,
    stock: 38,
    category: "disposables-tobacco-classic",
    collections: [],
  },

  // --- Disposables / Accessories ---
  {
    slug: "disposable-usb-c-charging-cable",
    title: "Disposable Vape Charging Cable (USB-C)",
    description: "A short, pocket-friendly USB-C cable sized for rechargeable disposable devices.",
    price: 899,
    colors: ["Black"],
    sizes: ["One Size"],
    imageCount: 1,
    stock: 90,
    category: "disposables-accessories",
    collections: [],
  },
  {
    slug: "disposable-carry-case-5-pack",
    title: "Disposable Vape Carry Case (5-Pack)",
    description: "Silicone protective sleeves that keep disposables scratch-free in a bag or pocket.",
    price: 1499,
    colors: ["Black", "Clear"],
    sizes: ["One Size"],
    imageCount: 1,
    stock: 65,
    category: "disposables-accessories",
    collections: ["new-arrivals"],
  },

  // --- Pod Systems / Fruit ---
  {
    slug: "pod-tropical-fruit-kit",
    title: "Tropical Fruit Pod Kit",
    description: "A complete starter kit with a rechargeable pod device and tropical fruit-flavored pods included.",
    price: 3499,
    colors: DEVICE_COLORS.slice(0, 3),
    sizes: ["2mL Pod"],
    imageCount: 2,
    stock: 32,
    category: "pod-systems-fruit",
    collections: ["new-arrivals"],
  },
  {
    slug: "pod-berry-blast-refill-4pack",
    title: "Berry Blast Pod Refill (4-Pack)",
    description: "Pre-filled replacement pods in a mixed berry flavor, compatible with our standard pod kit.",
    price: 1799,
    colors: ["Berry Blast"],
    sizes: ["4-Pack Pods"],
    imageCount: 1,
    stock: 55,
    category: "pod-systems-fruit",
    collections: [],
  },

  // --- Pod Systems / Menthol & Ice ---
  {
    slug: "pod-arctic-mint-kit",
    title: "Arctic Mint Pod Kit",
    description: "A rechargeable pod starter kit with an ice-cold arctic mint flavor pre-loaded.",
    price: 3499,
    colors: DEVICE_COLORS.slice(0, 3),
    sizes: ["2mL Pod"],
    imageCount: 1,
    stock: 30,
    category: "pod-systems-menthol-ice",
    collections: ["best-sellers"],
  },
  {
    slug: "pod-ice-menthol-refill-4pack",
    title: "Ice Menthol Pod Refill (4-Pack)",
    description: "Cooling menthol replacement pods that fit our standard pod kit.",
    price: 1799,
    colors: ["Ice Menthol"],
    sizes: ["4-Pack Pods"],
    imageCount: 1,
    stock: 48,
    category: "pod-systems-menthol-ice",
    collections: [],
  },

  // --- Pod Systems / Dessert & Sweet ---
  {
    slug: "pod-caramel-macchiato-kit",
    title: "Caramel Macchiato Pod Kit",
    description: "A rechargeable pod kit pre-loaded with a smooth caramel macchiato flavor.",
    price: 3499,
    colors: DEVICE_COLORS.slice(1, 4),
    sizes: ["2mL Pod"],
    imageCount: 1,
    stock: 26,
    category: "pod-systems-dessert-sweet",
    collections: [],
  },
  {
    slug: "pod-sweet-custard-refill-4pack",
    title: "Sweet Custard Pod Refill (4-Pack)",
    description: "Rich custard-flavored replacement pods for our standard pod kit.",
    price: 1799,
    colors: ["Sweet Custard"],
    sizes: ["4-Pack Pods"],
    imageCount: 1,
    stock: 44,
    category: "pod-systems-dessert-sweet",
    collections: ["sale"],
    salePrice: 1499,
  },

  // --- Pod Systems / Tobacco & Classic ---
  {
    slug: "pod-classic-tobacco-kit",
    title: "Classic Tobacco Pod Kit",
    description: "A rechargeable pod starter kit pre-loaded with a traditional tobacco flavor.",
    price: 3499,
    colors: ["Black", "Silver"],
    sizes: ["2mL Pod"],
    imageCount: 1,
    stock: 28,
    category: "pod-systems-tobacco-classic",
    collections: [],
  },
  {
    slug: "pod-rich-tobacco-refill-4pack",
    title: "Rich Tobacco Pod Refill (4-Pack)",
    description: "Bold tobacco-flavored replacement pods that fit our standard pod kit.",
    price: 1799,
    colors: ["Rich Tobacco"],
    sizes: ["4-Pack Pods"],
    imageCount: 1,
    stock: 40,
    category: "pod-systems-tobacco-classic",
    collections: [],
  },

  // --- Pod Systems / Accessories ---
  {
    slug: "pod-charging-dock",
    title: "Pod System Charging Dock",
    description: "A magnetic USB-C charging dock that holds your pod device upright while it charges.",
    price: 1999,
    colors: ["Black"],
    sizes: ["One Size"],
    imageCount: 1,
    stock: 35,
    category: "pod-systems-accessories",
    collections: ["new-arrivals"],
  },
  {
    slug: "pod-replacement-coils-5pack",
    title: "Replacement Pod Coils (5-Pack)",
    description: "Standard-resistance replacement coils for our pod system kits.",
    price: 1499,
    colors: ["Black"],
    sizes: ["5-Pack"],
    imageCount: 1,
    stock: 60,
    category: "pod-systems-accessories",
    collections: [],
  },

  // --- Mods & Tanks / Fruit ---
  {
    slug: "mod-tropical-series-tank",
    title: "Tropical Series Sub-Ohm Tank",
    description: "An 8mL sub-ohm tank designed for big vapor and bold tropical-fruit e-liquids.",
    price: 4999,
    colors: ["Black", "Silver", "Rainbow"],
    sizes: ["5mL Tank", "8mL Tank"],
    imageCount: 2,
    stock: 20,
    category: "mods-tanks-fruit",
    collections: [],
  },
  {
    slug: "mod-fruit-fusion-starter-kit",
    title: "Fruit Fusion Starter Mod Kit",
    description: "A beginner-friendly mod and tank kit tuned for flavorful fruit e-liquids.",
    price: 6999,
    colors: ["Black", "Blue"],
    sizes: ["5mL Tank"],
    imageCount: 1,
    stock: 15,
    category: "mods-tanks-fruit",
    collections: ["new-arrivals"],
  },

  // --- Mods & Tanks / Menthol & Ice ---
  {
    slug: "mod-glacier-kit",
    title: "Glacier Mod Kit",
    description: "A compact mod kit with adjustable airflow, built for cool, icy menthol e-liquids.",
    price: 6999,
    colors: ["Black", "Silver"],
    sizes: ["5mL Tank"],
    imageCount: 1,
    stock: 18,
    category: "mods-tanks-menthol-ice",
    collections: [],
  },
  {
    slug: "mod-ice-series-tank",
    title: "Ice Series Sub-Ohm Tank",
    description: "A wide-bore sub-ohm tank optimized for cool, high-vapor menthol and ice flavors.",
    price: 4999,
    colors: ["Black", "Silver"],
    sizes: ["5mL Tank", "8mL Tank"],
    imageCount: 1,
    stock: 22,
    category: "mods-tanks-menthol-ice",
    collections: ["best-sellers"],
  },

  // --- Mods & Tanks / Dessert & Sweet ---
  {
    slug: "mod-dessert-series-tank",
    title: "Dessert Series Sub-Ohm Tank",
    description: "A flavor-focused sub-ohm tank tuned to bring out rich, sweet dessert e-liquids.",
    price: 4999,
    colors: ["Black", "Rose Gold"],
    sizes: ["5mL Tank", "8mL Tank"],
    imageCount: 1,
    stock: 16,
    category: "mods-tanks-dessert-sweet",
    collections: [],
  },
  {
    slug: "mod-sweet-shop-starter-kit",
    title: "Sweet Shop Starter Mod Kit",
    description: "An easy-to-use mod kit paired with a tank built for creamy, dessert-style e-liquids.",
    price: 6999,
    colors: ["Black", "Rose Gold"],
    sizes: ["5mL Tank"],
    imageCount: 1,
    stock: 14,
    category: "mods-tanks-dessert-sweet",
    collections: [],
  },

  // --- Mods & Tanks / Tobacco & Classic ---
  {
    slug: "mod-heritage-tobacco-kit",
    title: "Heritage Tobacco Mod Kit",
    description: "A classic-styled mod kit built for vapers who prefer traditional tobacco e-liquids.",
    price: 6999,
    colors: ["Black", "Gunmetal"],
    sizes: ["5mL Tank"],
    imageCount: 1,
    stock: 12,
    category: "mods-tanks-tobacco-classic",
    collections: [],
  },
  {
    slug: "mod-classic-series-tank",
    title: "Classic Series Sub-Ohm Tank",
    description: "A dependable, easy-to-rebuild sub-ohm tank for classic tobacco and neutral e-liquids.",
    price: 4999,
    colors: ["Black", "Gunmetal"],
    sizes: ["5mL Tank", "8mL Tank"],
    imageCount: 1,
    stock: 17,
    category: "mods-tanks-tobacco-classic",
    collections: [],
  },

  // --- Mods & Tanks / Accessories ---
  {
    slug: "mod-replacement-mesh-coils-5pack",
    title: "Replacement Mesh Coils (5-Pack)",
    description: "Mesh coil heads for sub-ohm tanks, built for even heating and bigger flavor.",
    price: 1999,
    colors: ["Black"],
    sizes: ["5-Pack"],
    imageCount: 1,
    stock: 50,
    category: "mods-tanks-accessories",
    collections: [],
  },
  {
    slug: "mod-18650-battery-2pack-case",
    title: "18650 Battery (2-Pack) & Case",
    description: "Two rechargeable 18650 batteries with a protective travel case for mod devices.",
    price: 2999,
    salePrice: 2399,
    colors: ["Black"],
    sizes: ["2-Pack"],
    imageCount: 2,
    stock: 25,
    category: "mods-tanks-accessories",
    collections: ["sale"],
  },

  // --- E-Liquids / Fruit ---
  {
    slug: "eliquid-tropical-mango-60ml",
    title: "Tropical Mango E-Liquid (60mL)",
    description: "A bold tropical mango e-liquid formulated for sub-ohm tanks and mods.",
    price: 2499,
    colors: NIC_STRENGTHS,
    sizes: ["60mL"],
    imageCount: 2,
    stock: 40,
    category: "e-liquids-fruit",
    collections: ["new-arrivals"],
  },
  {
    slug: "eliquid-mixed-berry-30ml",
    title: "Mixed Berry E-Liquid (30mL)",
    description: "A blend of ripe berries in a nicotine-salt formula suited for pod systems.",
    price: 1799,
    colors: NIC_STRENGTHS,
    sizes: ["30mL"],
    imageCount: 1,
    stock: 46,
    category: "e-liquids-fruit",
    collections: [],
  },

  // --- E-Liquids / Menthol & Ice ---
  {
    slug: "eliquid-polar-mint-60ml",
    title: "Polar Mint E-Liquid (60mL)",
    description: "An intensely cool mint e-liquid built for high-vapor sub-ohm setups.",
    price: 2499,
    colors: NIC_STRENGTHS,
    sizes: ["60mL"],
    imageCount: 1,
    stock: 38,
    category: "e-liquids-menthol-ice",
    collections: ["best-sellers"],
  },
  {
    slug: "eliquid-ice-menthol-30ml",
    title: "Ice Menthol E-Liquid (30mL)",
    description: "A crisp menthol nicotine-salt e-liquid designed for pod systems.",
    price: 1799,
    colors: NIC_STRENGTHS,
    sizes: ["30mL"],
    imageCount: 1,
    stock: 42,
    category: "e-liquids-menthol-ice",
    collections: [],
  },

  // --- E-Liquids / Dessert & Sweet ---
  {
    slug: "eliquid-vanilla-custard-60ml",
    title: "Vanilla Custard E-Liquid (60mL)",
    description: "A rich, creamy vanilla custard e-liquid formulated for sub-ohm tanks.",
    price: 2499,
    colors: NIC_STRENGTHS,
    sizes: ["60mL"],
    imageCount: 1,
    stock: 30,
    category: "e-liquids-dessert-sweet",
    collections: [],
  },
  {
    slug: "eliquid-strawberry-cheesecake-30ml",
    title: "Strawberry Cheesecake E-Liquid (30mL)",
    description: "A dessert-inspired nicotine-salt e-liquid blending strawberry and creamy cheesecake.",
    price: 1799,
    salePrice: 1499,
    colors: NIC_STRENGTHS,
    sizes: ["30mL"],
    imageCount: 1,
    stock: 34,
    category: "e-liquids-dessert-sweet",
    collections: ["sale"],
  },

  // --- E-Liquids / Tobacco & Classic ---
  {
    slug: "eliquid-classic-tobacco-60ml",
    title: "Classic Tobacco E-Liquid (60mL)",
    description: "A traditional tobacco e-liquid formulated for sub-ohm tanks and mods.",
    price: 2499,
    colors: NIC_STRENGTHS,
    sizes: ["60mL"],
    imageCount: 1,
    stock: 26,
    category: "e-liquids-tobacco-classic",
    collections: [],
  },
  {
    slug: "eliquid-rich-havana-30ml",
    title: "Rich Havana E-Liquid (30mL)",
    description: "A bold, full-bodied tobacco nicotine-salt e-liquid for pod systems.",
    price: 1799,
    colors: NIC_STRENGTHS,
    sizes: ["30mL"],
    imageCount: 1,
    stock: 28,
    category: "e-liquids-tobacco-classic",
    collections: [],
  },

  // --- E-Liquids / Accessories ---
  {
    slug: "eliquid-nicotine-shots-10pack",
    title: "Nicotine Shots (10-Pack)",
    description: "18mg nicotine shots for mixing into shortfill e-liquid bottles to your preferred strength.",
    price: 1299,
    colors: ["18mg"],
    sizes: ["10-Pack"],
    imageCount: 1,
    stock: 55,
    category: "e-liquids-accessories",
    collections: [],
  },
  {
    slug: "eliquid-empty-bottles-5pack",
    title: "Empty Chubby Gorilla Bottles (5-Pack)",
    description: "BPA-free refillable dropper bottles for mixing or decanting your own e-liquid.",
    price: 899,
    colors: ["Clear", "Black"],
    sizes: ["5-Pack"],
    imageCount: 1,
    stock: 60,
    category: "e-liquids-accessories",
    collections: ["new-arrivals"],
  },
];

async function main() {
  const validCategorySlugs = VAPE_TYPES.flatMap((v) => TYPES.map((t) => `${v.slug}-${t.type}`));
  const validProductSlugs = products.map((p) => p.slug);
  const validCollectionSlugs = collections.map((c) => c.slug);

  // Drop products, collections, and categories from earlier seed runs that no longer fit
  // the fixed taxonomy (e.g. the earlier car-parts-era catalog and its "winter" collection)
  // — Category's onDelete: SetNull on Product only orphans stale products from their
  // category, it doesn't remove them, so they need an explicit delete of their own or
  // they'd keep showing up in getActiveProducts()/the sitemap/generateStaticParams
  // alongside the new vape catalog.
  await prisma.product.deleteMany({ where: { slug: { notIn: validProductSlugs } } });
  await prisma.collection.deleteMany({ where: { slug: { notIn: validCollectionSlugs } } });
  await prisma.category.deleteMany({ where: { slug: { notIn: validCategorySlugs } } });

  const categoryIdBySlug = new Map<string, string>();
  for (const v of VAPE_TYPES) {
    for (const t of TYPES) {
      const slug = `${v.slug}-${t.type}`;
      const row = await prisma.category.upsert({
        where: { slug },
        update: { name: `${v.name} — ${t.label}`, vapeType: v.vapeType },
        create: { slug, name: `${v.name} — ${t.label}`, vapeType: v.vapeType },
      });
      categoryIdBySlug.set(slug, row.id);
    }
  }

  const collectionIdBySlug = new Map<string, string>();
  for (const collection of collections) {
    const row = await prisma.collection.upsert({
      where: { slug: collection.slug },
      update: { title: collection.title },
      create: { slug: collection.slug, title: collection.title },
    });
    collectionIdBySlug.set(collection.slug, row.id);
  }

  for (const product of products) {
    const categoryId = categoryIdBySlug.get(product.category);
    if (!categoryId) throw new Error(`Unknown category slug: ${product.category}`);

    const collectionIds = product.collections.map((slug) => {
      const id = collectionIdBySlug.get(slug);
      if (!id) throw new Error(`Unknown collection slug: ${slug}`);
      return { id };
    });

    const salePrice = product.salePrice ?? null;
    const images = Array.from({ length: product.imageCount }, (_, i) => placeholderImage(product.title, i));

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        title: product.title,
        description: product.description,
        price: product.price,
        salePrice,
        images: toJson(images),
        sizes: toJson(product.sizes),
        colors: toJson(product.colors),
        stock: product.stock,
        categoryId,
        collections: { set: collectionIds },
      },
      create: {
        slug: product.slug,
        title: product.title,
        description: product.description,
        price: product.price,
        salePrice,
        images: toJson(images),
        sizes: toJson(product.sizes),
        colors: toJson(product.colors),
        stock: product.stock,
        categoryId,
        collections: { connect: collectionIds },
      },
    });
  }

  console.log(
    `Seeded ${validCategorySlugs.length} categories, ${collections.length} collections, ${products.length} products.`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
