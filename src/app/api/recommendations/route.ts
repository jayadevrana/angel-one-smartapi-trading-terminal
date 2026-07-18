import { z } from "zod";
import { ok, fail } from "@/lib/api";
import { getSessionUser } from "@/lib/auth/session";
import { createRecommendationFromScannerResult } from "@/lib/recommendations/engine";
import { getStore, defaultUser } from "@/lib/server/store";

const createSchema = z.object({ resultId: z.string(), quantity: z.number().int().positive().optional(), notes: z.string().optional() });

export async function GET() {
  return ok(getStore().recommendations);
}

export async function POST(request: Request) {
  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) return fail("Invalid recommendation payload.", 422);
  const store = getStore();
  const result = store.scannerResults.find((item) => item.id === parsed.data.resultId);
  if (!result) return fail("Scanner result not found. Run the scanner first.", 404);
  const session = (await getSessionUser()) || defaultUser;
  const recommendation = createRecommendationFromScannerResult(result, session.id);
  recommendation.quantity = parsed.data.quantity;
  recommendation.notes = parsed.data.notes;
  store.recommendations.unshift(recommendation);
  result.recommendationStatus = "created";
  return ok(recommendation, { status: 201 });
}
