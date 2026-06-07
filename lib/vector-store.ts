import { documents } from "./data";
import { DocumentRecord, RetrievalHit, Role } from "./types";

const stopWords = new Set([
  "the",
  "and",
  "for",
  "are",
  "what",
  "how",
  "why",
  "with",
  "from",
  "that",
  "this",
  "should",
  "does",
  "about",
  "into",
  "your",
  "rag",
  "platform"
]);

const semanticHints: Record<string, string[]> = {
  security: ["security", "rbac", "encrypted", "audit", "injection", "privilege", "confidential", "policy"],
  controls: ["rbac", "encrypted", "audit", "injection", "privilege", "governance"],
  support: ["support", "agents", "customer", "billing", "escalate", "confidence"],
  revenue: ["revenue", "pipeline", "churn", "conversion", "accounts", "onboarding"],
  analytics: ["analytics", "dashboard", "track", "metrics", "weekly", "velocity"],
  evaluation: ["evaluate", "faithfulness", "precision", "relevancy", "ragas", "context"],
  governance: ["governance", "approve", "red", "team", "production", "release"],
  documents: ["documentation", "documents", "sources", "context", "knowledge"]
};

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

function score(query: string, document: DocumentRecord) {
  const baseTerms = tokenize(query);
  const expandedTerms = new Set([
    ...baseTerms,
    ...baseTerms.flatMap((term) => semanticHints[term] || [])
  ]);
  const docTerms = new Set(tokenize(`${document.title} ${document.department} ${document.content}`));
  const matches = [...expandedTerms].filter((term) => docTerms.has(term)).length;
  return Number((matches / Math.max(expandedTerms.size, 1)).toFixed(3));
}

function excerptFor(document: DocumentRecord, query: string) {
  const terms = tokenize(query);
  const sentences = document.content.split(/(?<=\.)\s+/);
  return (
    sentences.find((sentence) => terms.some((term) => sentence.toLowerCase().includes(term))) ||
    document.content.slice(0, 220)
  );
}

export function retrieve(query: string, role: Role, corpus: DocumentRecord[] = documents): RetrievalHit[] {
  return corpus
    .filter((doc) => role === "admin" || doc.sensitivity !== "confidential")
    .map((document) => ({
      document,
      score: score(query, document),
      excerpt: excerptFor(document, query)
    }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}
