import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const toJson = (values: string[]) => JSON.stringify(values);

const UNIVERSAL_FIT = ["Universal Fit"];
const WHEEL_SIZES_SEDAN = ["16-inch", "17-inch", "18-inch"];
const WHEEL_SIZES_SUV = ["18-inch", "20-inch", "22-inch"];
const WHEEL_SIZES_TRUCK = ["17-inch", "18-inch", "20-inch"];
const TIRE_SIZES_SEDAN = ["195/65R15", "205/55R16", "215/55R17"];
const TIRE_SIZES_SUV = ["235/60R18", "245/60R20"];
const TIRE_SIZES_TRUCK = ["265/70R17", "275/65R18"];

// Product photography is intentionally NOT sourced from guessed stock-photo IDs — an
// earlier version of this seed picked Unsplash photo IDs from memory without ever
// visually confirming their contents, and one of them turned out to render a copyrighted
// character photo instead of the intended product. These generated placeholders (plain
// color + text label, no photographic content at all) remove that risk entirely. Swap
// them for your own real product photography before launch.
const PLACEHOLDER_SHADES = ["e5e7eb", "d1d5db"] as const;

function placeholderImage(title: string, index: number): string {
  const bg = PLACEHOLDER_SHADES[index % PLACEHOLDER_SHADES.length];
  const label = encodeURIComponent(index === 0 ? title : `${title} — Alt View`);
  // .png forces a raster response — Next/Image's optimizer blocks remote SVG by default
  // (placehold.co's default format) as an XSS precaution.
  return `https://placehold.co/800x1000/${bg}/1f2937.png?text=${label}`;
}

// Category slugs follow a fixed `${vehicleTypeSlug}-${type}` convention so the
// /[vehicleType]/[category] route can reconstruct a lookup key from the URL alone
// (see getProductsByCategorySlug in lib/products.ts) without an extra join table.
const VEHICLE_TYPES = [
  { slug: "sedans", name: "Sedans", vehicleType: "SEDAN" },
  { slug: "suvs", name: "SUVs & Crossovers", vehicleType: "SUV" },
  { slug: "trucks", name: "Trucks & Vans", vehicleType: "TRUCK" },
] as const;

const TYPES = [
  { type: "exterior", label: "Exterior" },
  { type: "interior", label: "Interior" },
  { type: "electronics", label: "Electronics" },
  { type: "tires-wheels", label: "Tires & Wheels" },
  { type: "accessories", label: "Accessories" },
] as const;

const collections = [
  { slug: "new-arrivals", title: "New Arrivals" },
  { slug: "winter", title: "Winter Driving Essentials" },
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
  category: string; // `${vehicleTypeSlug}-${type}`
  collections: string[];
}

const products: SeedProduct[] = [
  // --- Sedans / Exterior ---
  {
    slug: "sedan-chrome-grille-insert",
    title: "Chrome Grille Insert",
    description: "A bolt-on chrome grille insert that upgrades the front fascia in under an hour.",
    price: 8999,
    colors: ["Chrome", "Black"],
    sizes: UNIVERSAL_FIT,
    imageCount: 2,
    stock: 34,
    category: "sedans-exterior",
    collections: [],
  },
  {
    slug: "sedan-window-rain-visors",
    title: "Side Window Rain Visors",
    description: "Crack a window in the rain without the drips — smoke-tinted, tape-on install.",
    price: 5999,
    colors: ["Smoke", "Black"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 48,
    category: "sedans-exterior",
    collections: [],
  },

  // --- Sedans / Interior ---
  {
    slug: "sedan-leather-seat-covers",
    title: "Premium Leather Seat Covers",
    description: "A tailored, waterproof leatherette cover set that protects factory upholstery.",
    price: 18999,
    colors: ["Black", "Tan", "Charcoal"],
    sizes: UNIVERSAL_FIT,
    imageCount: 2,
    stock: 26,
    category: "sedans-interior",
    collections: ["new-arrivals"],
  },
  {
    slug: "sedan-all-weather-floor-liners",
    title: "All-Weather Floor Liners",
    description: "Deep-channel liners that trap water, mud, and road salt before it hits the carpet.",
    price: 7999,
    colors: ["Black", "Charcoal", "Tan"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 55,
    category: "sedans-interior",
    collections: ["winter"],
  },

  // --- Sedans / Electronics ---
  {
    slug: "sedan-hd-backup-camera-kit",
    title: "HD Backup Camera Kit",
    description: "A license-plate-mount backup camera with a wide-angle lens and night vision.",
    price: 12999,
    colors: ["Black"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 30,
    category: "sedans-electronics",
    collections: ["new-arrivals"],
  },
  {
    slug: "sedan-dash-cam-night-vision",
    title: "Dash Cam with Night Vision",
    description: "1080p continuous loop recording with a low-light sensor for clear night footage.",
    price: 9999,
    salePrice: 7999,
    colors: ["Black"],
    sizes: UNIVERSAL_FIT,
    imageCount: 2,
    stock: 40,
    category: "sedans-electronics",
    collections: ["sale", "new-arrivals"],
  },

  // --- Sedans / Tires & Wheels ---
  {
    slug: "sedan-alloy-wheel-set",
    title: "Sedan Alloy Wheel Set (4-Pack)",
    description: "A lightweight 5-spoke alloy wheel set that drops unsprung weight versus factory steel.",
    price: 89999,
    colors: ["Silver", "Black", "Gunmetal"],
    sizes: WHEEL_SIZES_SEDAN,
    imageCount: 2,
    stock: 12,
    category: "sedans-tires-wheels",
    collections: [],
  },
  {
    slug: "sedan-all-season-tire-set",
    title: "All-Season Tire Set (4-Pack)",
    description: "A balanced all-season tread built for year-round grip in wet and dry conditions.",
    price: 49999,
    colors: ["Black"],
    sizes: TIRE_SIZES_SEDAN,
    imageCount: 1,
    stock: 20,
    category: "sedans-tires-wheels",
    collections: ["winter"],
  },

  // --- Sedans / Accessories ---
  {
    slug: "sedan-collapsible-trunk-organizer",
    title: "Collapsible Trunk Organizer",
    description: "A rigid-base, foldable trunk organizer that keeps cargo from sliding around corners.",
    price: 3499,
    colors: ["Black", "Grey"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 60,
    category: "sedans-accessories",
    collections: ["new-arrivals"],
  },
  {
    slug: "sedan-full-car-cover",
    title: "Full Car Cover",
    description: "A breathable, water-resistant cover that shields paint from sun, sap, and frost.",
    price: 6999,
    colors: ["Grey", "Black"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 38,
    category: "sedans-accessories",
    collections: ["winter"],
  },

  // --- SUVs / Exterior ---
  {
    slug: "suv-side-running-boards",
    title: "Side Running Boards",
    description: "Textured-step running boards that make it easier to load roof racks and cargo boxes.",
    price: 24999,
    colors: ["Black", "Chrome"],
    sizes: UNIVERSAL_FIT,
    imageCount: 2,
    stock: 18,
    category: "suvs-exterior",
    collections: [],
  },
  {
    slug: "suv-roof-rack-cross-bars",
    title: "Roof Rack Cross Bars",
    description: "Lockable aluminum cross bars rated for cargo boxes, bike racks, and kayak mounts.",
    price: 15999,
    colors: ["Black"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 28,
    category: "suvs-exterior",
    collections: ["new-arrivals"],
  },

  // --- SUVs / Interior ---
  {
    slug: "suv-rear-cargo-liner",
    title: "Rear Cargo Liner",
    description: "A raised-lip cargo liner that contains spills and muddy gear behind the second row.",
    price: 5999,
    colors: ["Black"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 44,
    category: "suvs-interior",
    collections: [],
  },
  {
    slug: "suv-third-row-seat-covers",
    title: "Third-Row Seat Covers",
    description: "Stretch-fit covers sized for third-row bench seating, machine washable.",
    price: 11999,
    colors: ["Black", "Grey"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 22,
    category: "suvs-interior",
    collections: [],
  },

  // --- SUVs / Electronics ---
  {
    slug: "suv-wireless-backup-camera-system",
    title: "Wireless Backup Camera System",
    description: "A digital wireless feed to a dash-mounted monitor — no cabling through the cabin.",
    price: 14999,
    colors: ["Black"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 25,
    category: "suvs-electronics",
    collections: ["new-arrivals"],
  },
  {
    slug: "suv-bluetooth-obd2-scanner",
    title: "Bluetooth OBD2 Diagnostic Scanner",
    description: "Reads and clears check-engine codes from a phone app over Bluetooth.",
    price: 4999,
    salePrice: 3999,
    colors: ["Black"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 65,
    category: "suvs-electronics",
    collections: ["sale", "new-arrivals"],
  },

  // --- SUVs / Tires & Wheels ---
  {
    slug: "suv-offroad-alloy-wheel-set",
    title: "Off-Road Alloy Wheel Set (4-Pack)",
    description: "A reinforced-bead alloy wheel built for off-road clearance and load capacity.",
    price: 109999,
    colors: ["Black", "Gunmetal"],
    sizes: WHEEL_SIZES_SUV,
    imageCount: 2,
    stock: 10,
    category: "suvs-tires-wheels",
    collections: [],
  },
  {
    slug: "suv-all-terrain-tire-set",
    title: "All-Terrain Tire Set (4-Pack)",
    description: "An aggressive all-terrain tread for gravel, mud, and light off-road driving.",
    price: 69999,
    colors: ["Black"],
    sizes: TIRE_SIZES_SUV,
    imageCount: 1,
    stock: 16,
    category: "suvs-tires-wheels",
    collections: ["winter"],
  },

  // --- SUVs / Accessories ---
  {
    slug: "suv-rooftop-cargo-carrier",
    title: "Rooftop Cargo Carrier",
    description: "A weatherproof, expandable rooftop bag for road-trip overflow luggage.",
    price: 19999,
    colors: ["Black"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 20,
    category: "suvs-accessories",
    collections: [],
  },
  {
    slug: "suv-full-cover",
    title: "Full SUV Cover",
    description: "A snug, breathable cover sized for SUVs and crossovers, with a built-in mirror pocket.",
    price: 8999,
    colors: ["Grey", "Black"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 30,
    category: "suvs-accessories",
    collections: ["winter"],
  },

  // --- Trucks & Vans / Exterior ---
  {
    slug: "truck-spray-on-style-bed-liner-kit",
    title: "Spray-On Style Bed Liner Kit",
    description: "A roll-on protective bed liner kit that resists chipping, rust, and scratches.",
    price: 22999,
    colors: ["Black"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 24,
    category: "trucks-exterior",
    collections: [],
  },
  {
    slug: "truck-soft-rollup-tonneau-cover",
    title: "Soft Roll-Up Tonneau Cover",
    description: "A low-profile roll-up cover that secures cargo and improves highway fuel economy.",
    price: 34999,
    colors: ["Black"],
    sizes: UNIVERSAL_FIT,
    imageCount: 2,
    stock: 16,
    category: "trucks-exterior",
    collections: ["new-arrivals"],
  },

  // --- Trucks & Vans / Interior ---
  {
    slug: "truck-heavy-duty-seat-covers",
    title: "Heavy-Duty Seat Covers",
    description: "Rip-stop canvas covers built for job-site use — sand, sawdust, and spills included.",
    price: 13999,
    colors: ["Black", "Charcoal"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 34,
    category: "trucks-interior",
    collections: [],
  },
  {
    slug: "truck-heavy-duty-floor-mats",
    title: "Heavy-Duty Floor Mats",
    description: "Rigid, deep-well floor mats that trap mud and road salt off the cab carpet.",
    price: 8999,
    colors: ["Black", "Tan"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 40,
    category: "trucks-interior",
    collections: ["winter"],
  },

  // --- Trucks & Vans / Electronics ---
  {
    slug: "truck-trailer-brake-controller",
    title: "Trailer Brake Controller",
    description: "A proportional brake controller for safe, smooth stops while towing.",
    price: 17999,
    colors: ["Black"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 20,
    category: "trucks-electronics",
    collections: [],
  },
  {
    slug: "truck-bed-backup-camera",
    title: "Truck Bed Backup Camera",
    description: "A tailgate-mounted camera for hitching trailers and spotting the bed line.",
    price: 13999,
    salePrice: 10999,
    colors: ["Black"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 28,
    category: "trucks-electronics",
    collections: ["sale", "new-arrivals"],
  },

  // --- Trucks & Vans / Tires & Wheels ---
  {
    slug: "truck-alloy-wheel-set",
    title: "Truck Alloy Wheel Set (4-Pack)",
    description: "A high-load-rated alloy wheel set built for towing and heavy payloads.",
    price: 119999,
    colors: ["Black", "Chrome"],
    sizes: WHEEL_SIZES_TRUCK,
    imageCount: 2,
    stock: 9,
    category: "trucks-tires-wheels",
    collections: [],
  },
  {
    slug: "truck-mud-terrain-tire-set",
    title: "Mud-Terrain Tire Set (4-Pack)",
    description: "An aggressive mud-terrain tread with reinforced sidewalls for serious off-road use.",
    price: 79999,
    colors: ["Black"],
    sizes: TIRE_SIZES_TRUCK,
    imageCount: 1,
    stock: 14,
    category: "trucks-tires-wheels",
    collections: ["winter"],
  },

  // --- Trucks & Vans / Accessories ---
  {
    slug: "truck-bed-storage-organizer",
    title: "Truck Bed Storage Organizer",
    description: "A collapsible, water-resistant bed organizer that keeps tools and gear from sliding.",
    price: 5499,
    colors: ["Black"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 36,
    category: "trucks-accessories",
    collections: ["new-arrivals"],
  },
  {
    slug: "truck-towing-hitch-accessory-kit",
    title: "Towing Hitch Accessory Kit",
    description: "A hitch ball, pin, clip, and wiring adapter kit to get trailer-ready in one box.",
    price: 6499,
    colors: ["Black"],
    sizes: UNIVERSAL_FIT,
    imageCount: 1,
    stock: 32,
    category: "trucks-accessories",
    collections: [],
  },
];

async function main() {
  const validCategorySlugs = VEHICLE_TYPES.flatMap((v) => TYPES.map((t) => `${v.slug}-${t.type}`));

  // Drop categories from earlier seed runs that no longer fit the fixed taxonomy
  // (e.g. the old apparel-era "men-jackets" style categories).
  await prisma.category.deleteMany({ where: { slug: { notIn: validCategorySlugs } } });

  const categoryIdBySlug = new Map<string, string>();
  for (const v of VEHICLE_TYPES) {
    for (const t of TYPES) {
      const slug = `${v.slug}-${t.type}`;
      const row = await prisma.category.upsert({
        where: { slug },
        update: { name: `${v.name} ${t.label}`, vehicleType: v.vehicleType },
        create: { slug, name: `${v.name} ${t.label}`, vehicleType: v.vehicleType },
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
