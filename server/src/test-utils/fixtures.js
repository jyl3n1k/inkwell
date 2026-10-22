import { prisma } from "../db/client.js";
import bcrypt from "bcrypt";

let userCounter = 0;

export async function createTestUser({
  email,
  password = "correcthorse",
} = {}) {
  userCounter += 1;
  const resolvedEmail =
    email ?? `test-user-${userCounter}@example.com`;
  const passwordHash = await bcrypt.hash(password, 4);

  return prisma.user.create({
    data: {
      email: resolvedEmail,
      displayName: "Test User",
      passwordHash,
      isVerified: true,
    },
  });
}

export async function resetDatabase() {
  const url = new URL(process.env.DATABASE_URL);
  if (url.pathname !== "/inkwell_test") {
    throw new Error("Refusing to reset a database other than inkwell_test.");
  }

  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();
}
