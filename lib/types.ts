export type Role = "admin" | "analyst";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
};

export type DocumentRecord = {
  id: string;
  title: string;
  source: string;
  department: string;
  sensitivity: "public" | "internal" | "confidential";
  owner: string;
  status: "indexed" | "review" | "blocked";
  uploadedAt: string;
  tokens: number;
  content: string;
};

export type RetrievalHit = {
  document: DocumentRecord;
  score: number;
  excerpt: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type EvaluationResult = {
  id: string;
  query: string;
  answer: string;
  contextPrecision: number;
  faithfulness: number;
  answerRelevancy: number;
  risk: "low" | "medium" | "high";
};
