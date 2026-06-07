import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateAnswer } from "@/lib/rag";
import { getDocumentsForRole } from "@/lib/repository";
import { inspectPrompt, redactSensitiveText } from "@/lib/security";
import { retrieve } from "@/lib/vector-store";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { query } = await request.json();
  const cleanQuery = redactSensitiveText(String(query || ""));
  const inspection = inspectPrompt(cleanQuery);

  if (!inspection.allowed) {
    return NextResponse.json(
      {
        answer:
          "I blocked this request because it resembles a prompt-injection or policy-bypass attempt. Please rephrase it as a normal business question.",
        hits: [],
        security: inspection
      },
      { status: 400 }
    );
  }

  const corpusWarning = "MongoDB was unavailable, so local demo documents were used for retrieval.";
  let usedLocalCorpus = false;
  let hits;

  try {
    const corpus = await getDocumentsForRole(user.role);
    hits = retrieve(cleanQuery, user.role, corpus);
  } catch {
    usedLocalCorpus = true;
    hits = retrieve(cleanQuery, user.role);
  }

  const generation = await generateAnswer(cleanQuery, hits);
  const warning = [usedLocalCorpus ? corpusWarning : null, generation.warning].filter(Boolean).join(" ");

  return NextResponse.json({
    answer: generation.answer,
    hits,
    security: inspection,
    trace: {
      retrievalMode: process.env.VECTOR_DB_PROVIDER || "local",
      model: generation.provider === "openai" ? process.env.OPENAI_MODEL || "gpt-4o-mini" : "deterministic-demo",
      generator: generation.provider,
      warning: warning || null,
      role: user.role
    }
  });
}
