import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const started = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      version: "6.2.2",
      database: "ok",
      latencyMs: Date.now() - started,
      hint: "La base PostgreSQL répond correctement.",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error: any) {
    const message = String(error?.message || "Connexion PostgreSQL indisponible");
    const poolIssue = /max clients reached|too many connections|P2024|connection.*pool/i.test(message);
    return NextResponse.json({
      ok: false,
      version: "6.2.2",
      database: "error",
      code: poolIssue ? "DATABASE_POOL_LIMIT" : "DATABASE_CONNECTION_ERROR",
      error: poolIssue
        ? "Le pool PostgreSQL est saturé. Configurez l'URL de connexion poolée et une limite de connexions basse."
        : message,
      latencyMs: Date.now() - started,
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
