/**
 * Promote (or create) a user as ADMIN.
 * Usage: npm run make:admin email=you@mail.com
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getArg(name: string): string | undefined {
  const prefix = `${name}=`;
  const arg = process.argv.slice(2).find((a) => a.startsWith(prefix));
  return arg?.slice(prefix.length);
}

async function main() {
  const email = getArg("email");

  if (!email) {
    console.error("Usage: npm run make:admin email=you@mail.com");
    process.exit(1);
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: { email, role: "ADMIN" },
  });

  console.log(`${user.email} is now ADMIN (id: ${user.id}).`);
  if (!user.passwordHash) {
    console.log(
      "This account has no password set yet. Sign in with Google using this same email, or set a password via /account/signup first."
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
