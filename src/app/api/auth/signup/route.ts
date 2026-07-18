import bcrypt from "bcryptjs";
import { z } from "zod";
import { ok, fail } from "@/lib/api";
import { createSession } from "@/lib/auth/session";
import { getStore } from "@/lib/server/store";

const schema = z.object({
  email: z.email(),
  name: z.string().min(2).optional(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return fail("Enter a valid email and an 8+ character password.", 422);
  const store = getStore();
  const existing = store.users.find((user) => user.email === parsed.data.email);
  if (existing) return fail("Account already exists.", 409);
  const user = {
    id: `user-${Date.now()}`,
    email: parsed.data.email,
    name: parsed.data.name || "Trader",
    passwordHash: await bcrypt.hash(parsed.data.password, 10),
  };
  store.users.push(user);
  await createSession(user);
  return ok({ id: user.id, email: user.email, name: user.name });
}
