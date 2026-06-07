import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { getUserById } from "./repository";
import { Role, User } from "./types";

const cookieName = "entrag_session";

function secret() {
  return process.env.SESSION_SECRET || "local-development-secret-change-me";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(user: User) {
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + 1000 * 60 * 60 * 8
    })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export async function verifySessionToken(token?: string): Promise<User | null> {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  if (signature.length !== expected.length) return null;
  const valid = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return null;

  const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
    sub: string;
    exp: number;
    role: Role;
  };

  if (parsed.exp < Date.now()) return null;
  return getUserById(parsed.sub);
}

export async function getCurrentUser() {
  const store = await cookies();
  return verifySessionToken(store.get(cookieName)?.value);
}

export function getSessionCookieName() {
  return cookieName;
}
