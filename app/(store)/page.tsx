import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CollectionCarousel } from "@/components/collection-carousel";
import { Reveal } from "@/components/motion/reveal";
import { TapScale } from "@/components/motion/tap-scale";
import { FloatingBadge } from "@/components/motion/floating-badge";
import { AnimatedCar } from "@/components/motion/animated-car";
import { getProductsByCollectionSlug } from "@/lib/products";

const HOME_COLLECTIONS = [
  { slug: "new-arrivals", title: "New Arrivals" },
  { slug: "sale", title: "On Sale" },
  { slug: "winter", title: "Winter Driving Essentials" },
] as const;

export default async function HomePage() {
  const collections = await Promise.all(
    HOME_COLLECTIONS.map(async (c) => ({
      ...c,
      products: await getProductsByCollectionSlug(c.slug),
    }))
  );

  return (
    <div>
      <section className="overflow-hidden border-b bg-secondary/40">
        <div className="container grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <Reveal>
              <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
                Welcome to 4F Store! 🚗
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-lg text-muted-foreground">
                Exterior, interior, electronics, tires & wheels, and accessories for sedans, SUVs,
                trucks and vans — we&apos;re so glad you&apos;re here.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <TapScale>
                  <Button size="lg" asChild>
                    <Link href="/sedans">Shop Sedans</Link>
                  </Button>
                </TapScale>
                <TapScale>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/suvs">Shop SUVs</Link>
                  </Button>
                </TapScale>
                <TapScale>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/trucks">Shop Trucks</Link>
                  </Button>
                </TapScale>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="relative flex items-center justify-center px-6 sm:px-10">
            <AnimatedCar className="w-full max-w-md" />
            <FloatingBadge className="absolute -top-2 left-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg sm:left-6">
              👋 Welcome!
            </FloatingBadge>
            <FloatingBadge className="absolute -bottom-2 right-2 rounded-full bg-background px-4 py-2 text-sm font-semibold shadow-lg sm:right-6">
              🔧 New Parts Weekly
            </FloatingBadge>
          </Reveal>
        </div>
      </section>

      {collections.map((collection) => (
        <Reveal key={collection.slug}>
          <CollectionCarousel
            title={collection.title}
            viewAllHref={`/collections/${collection.slug}`}
            products={collection.products}
          />
        </Reveal>
      ))}
    </div>
  );
}
