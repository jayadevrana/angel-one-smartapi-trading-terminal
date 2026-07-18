import { ok } from "@/lib/api";
import { getSessionUser } from "@/lib/auth/session";
import { defaultUser } from "@/lib/server/store";

export async function GET() {
  return ok((await getSessionUser()) || defaultUser);
}
