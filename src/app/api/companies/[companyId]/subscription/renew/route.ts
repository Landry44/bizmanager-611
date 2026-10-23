export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireMembership } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { getSubscription, PLAN_LIMITS } from "@/src/lib/subscription";

export async function POST(_request: Request, { params }: { params: Promise<{ companyId: string }> }) {
  try {
    const { companyId } = await params;
    const { membership } = await requireMembership(companyId, ["OWNER", "ADMIN"]);
    const sub = await getSubscription(companyId);
    const plan = sub.plan;
    if (plan === "FREE") return NextResponse.json({ error: "Choisissez d'abord une formule Basic ou Avancé." }, { status: 400 });
    const limits = PLAN_LIMITS[plan];
    const existing = await db.paymentOrder.findFirst({ where: { companyId, plan, status: "PENDING", provider: "MANUAL" }, orderBy: { createdAt: "desc" } });
    if (existing) return NextResponse.json({ ok: true, alreadyPending: true, order: existing });
    const order = await db.paymentOrder.create({ data: { companyId, plan, amount: limits.price, currency: "XAF", provider: "MANUAL", status: "PENDING", metadata: { method: "CASH", requestedBy: membership.userId, requestType: "RENEWAL" } } });
    const admins = await db.membership.findMany({ where: { companyId, role: { in: ["OWNER", "ADMIN"] } }, select: { userId: true } });
    if (admins.length) await db.notification.createMany({ data: admins.map(a => ({ userId: a.userId, companyId, title: "Demande de renouvellement", message: `Une demande de renouvellement ${limits.label} de ${limits.price.toLocaleString("fr-FR")} FCFA a été envoyée.`, type: "SUBSCRIPTION" })) });
    return NextResponse.json({ ok: true, order }, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    const status = e?.message === "UNAUTHENTICATED" ? 401 : e?.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: e?.message || "Impossible d'envoyer la demande." }, { status });
  }
}
