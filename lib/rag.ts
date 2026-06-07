import { RetrievalHit } from "./types";

const systemPrompt = `You are EntRAG Guard, an enterprise RAG assistant. Answer only from retrieved context, cite document titles, mention uncertainty, and refuse unsafe requests.`;

export function getGeneratedProjectPrompt() {
  return `Build an enterprise-grade RAG SaaS platform named EntRAG Guard. It must include secure authentication, role based access control, document ingestion, vector retrieval, cited AI answers, an admin dashboard, usage analytics, prompt-injection defenses, RAGAS-inspired evaluation metrics, and Vercel deployment. The product should feel like a real internal AI knowledge platform for companies, not a classroom demo.`;
}

export async function generateAnswer(query: string, hits: RetrievalHit[]) {
  if (hits.length === 0) {
    return {
      answer:
        "I could not find enough approved context to answer that confidently. Upload a relevant document or ask an admin to approve the dataset.",
      provider: "demo-fallback",
      warning: "No approved retrieval context was found for this question."
    };
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Question: ${query}\n\nContext:\n${hits
                .map((hit, index) => `[${index + 1}] ${hit.document.title}: ${hit.excerpt}`)
                .join("\n")}`
            }
          ],
          temperature: 0.2
        })
      });

      if (response.ok) {
        const json = await response.json();
        const answer = json.choices?.[0]?.message?.content;
        if (answer) {
          return {
            answer,
            provider: "openai",
            warning: null
          };
        }
      }

      return {
        answer: fallbackAnswer(query, hits),
        provider: "demo-fallback",
        warning: `OpenAI request failed with status ${response.status}. Check billing, quota, model access, or project permissions.`
      };
    } catch {
      return {
        answer: fallbackAnswer(query, hits),
        provider: "demo-fallback",
        warning: "OpenAI request could not be completed from the server environment."
      };
    }
  }

  return {
    answer: fallbackAnswer(query, hits),
    provider: "demo-fallback",
    warning: "OPENAI_API_KEY is not configured."
  };
}

function fallbackAnswer(query: string, hits: RetrievalHit[]) {
  const question = query.toLowerCase();
  const topHit = hits[0];
  const supportingHits = hits.slice(1, 3);
  const focus = detectFocus(question);
  const lead = buildLead(focus, topHit);
  const support = supportingHits.length
    ? ` Supporting context also appears in ${supportingHits.map((hit) => hit.document.title).join(" and ")}.`
    : "";

  return `${lead} Source: ${topHit.document.title}.${support} Confidence is based on ${hits.length} retrieved source${hits.length === 1 ? "" : "s"} with the top match scoring ${topHit.score}.`;
}

function detectFocus(question: string) {
  if (/(security|control|rbac|encrypt|prompt|injection|confidential|policy)/.test(question)) return "security";
  if (/(support|customer|billing|agent|escalat|confidence)/.test(question)) return "support";
  if (/(revenue|sales|churn|pipeline|onboarding|conversion|account)/.test(question)) return "revenue";
  if (/(eval|ragas|faithful|precision|relevan|quality|score)/.test(question)) return "evaluation";
  if (/(govern|approve|production|release|red team)/.test(question)) return "governance";
  if (/(analytics|dashboard|metric|track|usage)/.test(question)) return "analytics";
  return "general";
}

function buildLead(focus: string, topHit: RetrievalHit) {
  const excerpt = topHit.excerpt.replace(/\s+/g, " ").trim();

  switch (focus) {
    case "security":
      return `The required security controls are role based access control, encrypted transport, audit logging, prompt-injection filtering, least-privilege API keys, and restricted handling for confidential records. The retrieved policy says: ${excerpt}`;
    case "support":
      return `For support workflows, the assistant should answer only from approved documentation, cite sources, escalate billing disputes, and avoid guessing when confidence is low. The retrieved playbook says: ${excerpt}`;
    case "revenue":
      return `For revenue operations, the knowledge base points to expansion accounts, faster onboarding, churn-risk analytics, pipeline velocity, and sales enablement as priorities. The retrieved plan says: ${excerpt}`;
    case "evaluation":
      return `For RAG evaluation, the system should track faithfulness, context precision, answer relevancy, retrieval traces, and unsafe-request detection. The retrieved checklist says: ${excerpt}`;
    case "governance":
      return `For AI governance, admins should approve datasets, run red-team checks before production release, and keep retrieval traces for review. The retrieved checklist says: ${excerpt}`;
    case "analytics":
      return `For analytics, the platform should track usage, retrieval quality, latency, blocked prompts, churn risk, pipeline velocity, and document-assisted workflows. The retrieved source says: ${excerpt}`;
    default:
      return `Here is the most relevant answer I found in the approved knowledge base: ${excerpt}`;
  }
}
