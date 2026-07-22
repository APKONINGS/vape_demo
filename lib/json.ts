/** SQLite has no scalar-list or Json type in Prisma, so array fields are stored as JSON text. */
export function asStringArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function toJsonString(values: string[]): string {
  return JSON.stringify(values);
}

export interface CartItemSnapshot {
  productId: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export function asCartItems(value: string): CartItemSnapshot[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as CartItemSnapshot[]) : [];
  } catch {
    return [];
  }
}
