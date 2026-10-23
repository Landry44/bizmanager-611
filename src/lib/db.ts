import { PrismaClient } from "@prisma/client";

/**
 * Reuse one PrismaClient per warm serverless runtime and keep the pool small.
 * DATABASE_URL should still use the provider's serverless/transaction pooler.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getDatasourceUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    // Prevent each Vercel function instance from opening a large connection pool.
    if (!url.searchParams.has("connection_limit")) url.searchParams.set("connection_limit", "1");
    if (!url.searchParams.has("pool_timeout")) url.searchParams.set("pool_timeout", "20");
    return url.toString();
  } catch {
    // Let Prisma produce the standard DATABASE_URL validation error.
    return raw;
  }
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  ...(getDatasourceUrl() ? { datasourceUrl: getDatasourceUrl() } : {}),
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

globalForPrisma.prisma = db;
