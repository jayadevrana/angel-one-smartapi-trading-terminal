import { z } from "zod";
import { ok, fail } from "@/lib/api";
import { getSessionUser } from "@/lib/auth/session";
import { defaultUser, getStore } from "@/lib/server/store";

const schema = z.object({
  symbol: z.string(),
  exchange: z.string(),
  token: z.string(),
  type: z.enum(["trend_line", "horizontal_line", "vertical_line", "ray_line", "freehand"]),
  payload: z.record(z.string(), z.unknown()),
});

export async function GET(request: Request) {
  const symbol = new URL(request.url).searchParams.get("symbol") || "TATASTEEL";
  return ok(getStore().drawings.filter((item) => item.symbol === symbol));
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return fail("Invalid drawing payload.", 422);
  const session = (await getSessionUser()) || defaultUser;
  const drawing = {
    id: `drawing-${Date.now()}`,
    userId: session.id,
    ...parsed.data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  getStore().drawings.push(drawing);
  return ok(drawing, { status: 201 });
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  const store = getStore();
  store.drawings = id ? store.drawings.filter((item) => item.id !== id) : [];
  return ok(store.drawings);
}
