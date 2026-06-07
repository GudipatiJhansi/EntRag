import { DocumentRecord, EvaluationResult, User } from "./types";

export const users: User[] = [
  {
    id: "usr_admin",
    name: "Aarav Mehta",
    email: process.env.DEMO_ADMIN_EMAIL || "admin@acme.ai",
    role: "admin",
    department: "Platform"
  },
  {
    id: "usr_analyst",
    name: "Isha Rao",
    email: process.env.DEMO_USER_EMAIL || "analyst@acme.ai",
    role: "analyst",
    department: "Revenue"
  }
];

export const documents: DocumentRecord[] = [
  {
    id: "doc_001",
    title: "Enterprise Security Policy",
    source: "security-policy.pdf",
    department: "Security",
    sensitivity: "confidential",
    owner: "Aarav Mehta",
    status: "indexed",
    uploadedAt: "2026-05-22",
    tokens: 4210,
    content:
      "All enterprise knowledge systems must enforce role based access control, encrypted transport, audit logging, prompt injection filtering, and least privilege API keys. Confidential records require citation grounded responses and cannot be exported by analyst roles."
  },
  {
    id: "doc_002",
    title: "Customer Support Playbook",
    source: "support-playbook.md",
    department: "Support",
    sensitivity: "internal",
    owner: "Isha Rao",
    status: "indexed",
    uploadedAt: "2026-05-25",
    tokens: 2980,
    content:
      "Support agents should answer from approved product documentation, cite source snippets, escalate billing disputes, and avoid guessing when context confidence is below the configured threshold. Customer satisfaction is tracked weekly."
  },
  {
    id: "doc_003",
    title: "Q2 Revenue Operating Plan",
    source: "revenue-plan.xlsx",
    department: "Revenue",
    sensitivity: "internal",
    owner: "Isha Rao",
    status: "indexed",
    uploadedAt: "2026-05-28",
    tokens: 5360,
    content:
      "The revenue team will prioritize expansion accounts, reduce onboarding delay by 18 percent, and use analytics dashboards to track churn risks, pipeline velocity, conversion quality, and document assisted sales enablement."
  },
  {
    id: "doc_004",
    title: "AI Governance Checklist",
    source: "governance-checklist.docx",
    department: "Platform",
    sensitivity: "confidential",
    owner: "Aarav Mehta",
    status: "review",
    uploadedAt: "2026-05-30",
    tokens: 1840,
    content:
      "RAG applications must log retrieval traces, evaluate faithfulness, measure context precision, detect unsafe requests, and run red team checks before production release. Admins approve datasets before public availability."
  }
];

export const evaluations: EvaluationResult[] = [
  {
    id: "eval_001",
    query: "What security controls are mandatory?",
    answer: "RBAC, transport encryption, audit logging, injection filtering, and least privilege keys.",
    contextPrecision: 0.92,
    faithfulness: 0.95,
    answerRelevancy: 0.9,
    risk: "low"
  },
  {
    id: "eval_002",
    query: "How should low confidence answers be handled?",
    answer: "The assistant should avoid guessing and escalate or ask for a better source.",
    contextPrecision: 0.84,
    faithfulness: 0.88,
    answerRelevancy: 0.86,
    risk: "medium"
  }
];
