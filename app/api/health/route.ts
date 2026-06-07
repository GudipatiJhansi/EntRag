import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { checkMongoHealth } from "@/lib/mongodb";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  let database;
  try {
    database = await checkMongoHealth();
  } catch {
    database = {
      configured: Boolean(process.env.MONGODB_URI),
      connected: false,
      database: process.env.MONGODB_DB || "entrag_guard",
      message: "MongoDB is configured but the server could not connect."
    };
  }

  return NextResponse.json({
    database,
    ai: {
      configured: Boolean(process.env.OPENAI_API_KEY),
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      message: process.env.OPENAI_API_KEY
        ? "OpenAI key is configured. Chat trace will report if generation succeeds."
        : "OPENAI_API_KEY is not configured."
    },
    deployment: {
      runtime: "Vercel-compatible Next.js API routes",
      vectorProvider: process.env.VECTOR_DB_PROVIDER || "local"
    }
  });
}
