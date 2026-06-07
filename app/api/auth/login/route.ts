import { NextResponse } from "next/server";
import { createSessionToken, getSessionCookieName } from "@/lib/auth";
import { getUserByEmail } from "@/lib/repository";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const adminPassword = process.env.DEMO_ADMIN_PASSWORD || "Admin@12345";
  const userPassword = process.env.DEMO_USER_PASSWORD || "User@12345";
  const user = await getUserByEmail(String(email));

  const valid =
    user &&
    ((user.role === "admin" && password === adminPassword) ||
      (user.role === "analyst" && password === userPassword));

  if (!user || !valid) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }

  const response = NextResponse.json({ user });
  response.cookies.set(getSessionCookieName(), createSessionToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
