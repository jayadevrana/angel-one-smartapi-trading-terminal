import { ok, fail } from "@/lib/api";
import { getStore } from "@/lib/server/store";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recommendation = getStore().recommendations.find((item) => item.id === id);
  return recommendation ? ok(recommendation) : fail("Recommendation not found.", 404);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const recommendation = getStore().recommendations.find((item) => item.id === id);
  if (!recommendation) return fail("Recommendation not found.", 404);
  if (body.status) recommendation.status = body.status;
  if (body.notes != null) recommendation.notes = body.notes;
  if (body.quantity != null) recommendation.quantity = Number(body.quantity);
  if (body.status === "closed") recommendation.closedAt = new Date().toISOString();
  return ok(recommendation);
}
