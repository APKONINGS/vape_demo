/** The price actually charged: the sale price when one is set, otherwise list price. */
export function effectivePrice(product: { price: number; salePrice: number | null }): number {
  return product.salePrice ?? product.price;
}
