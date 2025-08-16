import { PrismaClient } from "../../generated/prisma";

// Ensure a single PrismaClient instance across hot-reloads (e.g., in dev with Nuxt/Nodemon)
// In production, a single instance per process is created.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
