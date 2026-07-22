import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/product-card";
import type { ProductDTO } from "@/lib/products";

export function CollectionCarousel({
  title,
  viewAllHref,
  products,
  className,
}: {
  title: string;
  viewAllHref?: string;
  products: ProductDTO[];
  className?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className={className ?? "container py-12"}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm font-medium underline-offset-4 hover:underline">
            View all
          </Link>
        )}
      </div>

      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}
