import bcrypt from "bcryptjs";
import { z } from "zod";
import { ok, fail } from "@/lib/api";
import { createSession } from "@/lib/auth/session";
import { defaultUser, getStore } from "@/lib/server/store";

const schema = z.object({ email: z.email(), password: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return fail("Invalid login payload.", 422);
  if (parsed.data.email === "demo@terminal.local" && parsed.data.password === "demo1234") {
    await createSession(defaultUser);
    return ok(defaultUser);
  }
  const user = getStore().users.find((item) => item.email === parsed.data.email);
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return fail("Invalid email or password.", 401);
  await createSession(user);
  return ok({ id: user.id, email: user.email, name: user.name });
}
