import { auth } from "@/auth";

/** Defense-in-depth check for server actions — middleware already gates /admin/* routes. */
export async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Forbidden: admin access required.");
  }
  return session;
}
