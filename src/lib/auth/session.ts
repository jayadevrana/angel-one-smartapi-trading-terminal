import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const cookieName = "angel_terminal_session";

function secretKey() {
  const secret = process.env.APP_JWT_SECRET || "local-dev-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function createSession(user: { id: string; email: string; name?: string }) {
  const token = await new SignJWT({ email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());

  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  (await cookies()).delete(cookieName);
}

export async function getSessionUser() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return { id: payload.sub || "demo-user", email: String(payload.email || ""), name: String(payload.name || "") };
  } catch {
    return null;
  }
}
