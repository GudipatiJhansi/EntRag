import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAdminMetrics } from "@/lib/metrics";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  return NextResponse.json(await getAdminMetrics());
}
