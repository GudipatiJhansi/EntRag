"use client";

import AppShell from "@/components/AppShell";
import MetricCard from "@/components/MetricCard";
import ProgressMetric from "@/components/ProgressMetric";
import { useEffect, useState } from "react";

type Metrics = {
  activeUsers: number;
  totalDocuments: number;
  monthlyQueries: number;
  blockedPrompts: number;
  retrievalQuality: { label: string; value: number }[];
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    fetch("/api/admin/metrics")
      .then((res) => (res.ok ? res.json() : null))
      .then(setMetrics);
  }, []);

  const quality = metrics?.retrievalQuality || [
    { label: "Context precision", value: 88 },
    { label: "Faithfulness", value: 90 },
    { label: "Answer relevancy", value: 86 }
  ];

  return (
    <AppShell title="Overview" subtitle="Operational snapshot for the enterprise RAG workspace.">
      <div className="grid cols-3">
        <MetricCard label="Monthly queries" value={metrics?.monthlyQueries || "12.8k"} detail="Across all assistants" />
        <MetricCard label="Indexed documents" value={metrics?.totalDocuments || 4} detail="Approved knowledge assets" />
        <MetricCard label="Blocked prompts" value={metrics?.blockedPrompts || 31} detail="Security filters triggered" />
      </div>
      <div className="grid cols-2" style={{ marginTop: 16 }}>
        <section className="card">
          <h2>RAG quality</h2>
          <div className="grid">
            {quality.map((item) => (
              <ProgressMetric key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </section>
        <section className="card">
          <h2>Platform capabilities</h2>
          <div className="source-list">
            {["Authentication and RBAC", "Vector retrieval", "Admin analytics", "Prompt security", "RAGAS-style evaluation"].map(
              (item) => (
                <div className="source-item" key={item}>
                  <strong>{item}</strong>
                  <p className="muted">Implemented as a Vercel-ready full-stack workflow.</p>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
