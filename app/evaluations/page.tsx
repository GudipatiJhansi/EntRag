"use client";

import AppShell from "@/components/AppShell";
import ProgressMetric from "@/components/ProgressMetric";
import { ClipboardCheck } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { EvaluationResult } from "@/lib/types";

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  const [latest, setLatest] = useState<EvaluationResult | null>(null);

  useEffect(() => {
    fetch("/api/evaluations")
      .then((res) => res.json())
      .then((data) => setEvaluations(data.evaluations || []));
  }, []);

  async function runEvaluation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/evaluations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form))
    });
    const data = await response.json();
    setLatest(data.result);
    setEvaluations((items) => [data.result, ...items]);
  }

  return (
    <AppShell title="Evaluation" subtitle="RAGAS-inspired checks for faithfulness, context precision, and relevancy.">
      <div className="grid cols-2">
        <section className="card">
          <h2>Run evaluation</h2>
          <form className="form" onSubmit={runEvaluation}>
            <label className="field">
              <span>Question</span>
              <input className="input" name="query" defaultValue="What security controls are mandatory?" />
            </label>
            <label className="field">
              <span>Answer</span>
              <textarea
                className="textarea"
                name="answer"
                defaultValue="RBAC, transport encryption, audit logging, prompt injection filtering, and least privilege keys. Source: Enterprise Security Policy."
              />
            </label>
            <button className="button">
              <ClipboardCheck size={18} />
              Score answer
            </button>
          </form>
          {latest ? (
            <div className="grid" style={{ marginTop: 16 }}>
              <ProgressMetric label="Context precision" value={Math.round(latest.contextPrecision * 100)} />
              <ProgressMetric label="Faithfulness" value={Math.round(latest.faithfulness * 100)} />
              <ProgressMetric label="Answer relevancy" value={Math.round(latest.answerRelevancy * 100)} />
            </div>
          ) : null}
        </section>
        <section className="card">
          <h2>Evaluation history</h2>
          <div className="table-list">
            {evaluations.map((item) => (
              <div className="eval-row" key={item.id}>
                <strong>{item.query}</strong>
                <p className="muted">{item.answer}</p>
                <span className={item.risk === "low" ? "pill" : "pill warn"}>{item.risk} risk</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
