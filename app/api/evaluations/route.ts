import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDocumentsForRole, getEvaluations, insertEvaluation } from "@/lib/repository";
import { retrieve } from "@/lib/vector-store";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ evaluations: await getEvaluations() });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { query, answer } = await request.json();
  const corpus = await getDocumentsForRole(user.role);
  const hits = retrieve(String(query || ""), user.role, corpus);
  const contextPrecision = Math.min(0.98, 0.68 + hits.length * 0.08);
  const answerRelevancy = String(answer || "").toLowerCase().includes(String(query || "").split(" ")[0]?.toLowerCase())
    ? 0.86
    : 0.74;
  const faithfulness = hits.some((hit) => String(answer || "").includes(hit.document.title)) ? 0.91 : 0.79;

  const result = await insertEvaluation({
      id: `eval_${Date.now()}`,
      query,
      answer,
      contextPrecision,
      faithfulness,
      answerRelevancy,
      risk: faithfulness > 0.85 ? "low" : "medium"
  });

  return NextResponse.json({ result });
}
