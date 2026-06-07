import { getDocumentsForRole, getEvaluations } from "./repository";

export async function getAdminMetrics() {
  const documents = await getDocumentsForRole("admin");
  const evaluations = await getEvaluations();
  const totalTokens = documents.reduce((sum, doc) => sum + doc.tokens, 0);
  const indexed = documents.filter((doc) => doc.status === "indexed").length;
  const averageFaithfulness =
    evaluations.reduce((sum, item) => sum + item.faithfulness, 0) / Math.max(evaluations.length, 1);

  return {
    activeUsers: 42,
    totalDocuments: documents.length,
    indexedDocuments: indexed,
    totalTokens,
    monthlyQueries: 12840,
    blockedPrompts: 31,
    averageLatencyMs: 820,
    averageFaithfulness: Number(averageFaithfulness.toFixed(2)),
    retrievalQuality: [
      { label: "Context precision", value: 91 },
      { label: "Faithfulness", value: 92 },
      { label: "Answer relevancy", value: 88 }
    ],
    queryTrend: [420, 520, 610, 730, 690, 840, 970],
    riskBreakdown: [
      { label: "Low", value: 78 },
      { label: "Medium", value: 17 },
      { label: "High", value: 5 }
    ]
  };
}
