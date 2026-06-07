"use client";

import AppShell from "@/components/AppShell";
import MetricCard from "@/components/MetricCard";
import ProgressMetric from "@/components/ProgressMetric";
import { useEffect, useState } from "react";

type Metrics = {
  activeUsers: number;
  totalDocuments: number;
  indexedDocuments: number;
  totalTokens: number;
  monthlyQueries: number;
  blockedPrompts: number;
  averageLatencyMs: number;
  averageFaithfulness: number;
  retrievalQuality: { label: string; value: number }[];
  queryTrend: number[];
  riskBreakdown: { label: string; value: number }[];
};

type Health = {
  database: {
    configured: boolean;
    connected: boolean;
    database: string;
    message: string;
  };
  ai: {
    configured: boolean;
    model: string;
    message: string;
  };
  deployment: {
    runtime: string;
    vectorProvider: string;
  };
};

export default function AdminPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    fetch("/api/admin/metrics").then(async (res) => {
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      setMetrics(await res.json());
    });
    fetch("/api/health").then(async (res) => {
      if (res.ok) setHealth(await res.json());
    });
  }, []);

  return (
    <AppShell title="Admin Dashboard" subtitle="Governance, analytics, security, and retrieval quality controls.">
      {forbidden ? (
        <section className="card">
          <h2>Admin access required</h2>
          <p className="muted">Sign in with the admin demo account to view this page.</p>
        </section>
      ) : (
        <div className="grid">
          <div className="grid cols-3">
            <MetricCard label="Active users" value={metrics?.activeUsers || "..."} detail="Current workspace members" />
            <MetricCard label="Total tokens" value={metrics?.totalTokens || "..."} detail="Indexed corpus size" />
            <MetricCard label="Avg latency" value={`${metrics?.averageLatencyMs || "..."} ms`} detail="Serverless response time" />
          </div>
          <div className="grid cols-2">
            <section className="card">
              <h2>Query volume</h2>
              <div className="trend" aria-label="Query trend">
                {(metrics?.queryTrend || [240, 300, 410, 520, 610, 750, 840]).map((value, index, items) => (
                  <span key={index} style={{ height: `${(value / Math.max(...items)) * 100}%` }} />
                ))}
              </div>
            </section>
            <section className="card">
              <h2>Quality controls</h2>
              <div className="grid">
                {(metrics?.retrievalQuality || []).map((item) => (
                  <ProgressMetric key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
            </section>
          </div>
          <section className="card">
            <h2>Security posture</h2>
            <div className="grid cols-3">
              {(metrics?.riskBreakdown || []).map((item) => (
                <div className="source-item" key={item.label}>
                  <strong>{item.label}</strong>
                  <p className="muted">{item.value}% of evaluated traffic</p>
                </div>
              ))}
            </div>
          </section>
          <section className="card">
            <h2>Integration health</h2>
            <div className="grid cols-3">
              <div className="source-item">
                <strong>MongoDB</strong>
                <p className="muted">{health?.database.message || "Checking database status..."}</p>
                <span className={health?.database.connected ? "pill" : "pill warn"}>
                  {health?.database.connected ? "connected" : "not connected"}
                </span>
              </div>
              <div className="source-item">
                <strong>OpenAI</strong>
                <p className="muted">{health?.ai.message || "Checking AI configuration..."}</p>
                <span className={health?.ai.configured ? "pill" : "pill warn"}>
                  {health?.ai.configured ? health.ai.model : "not configured"}
                </span>
              </div>
              <div className="source-item">
                <strong>Deployment</strong>
                <p className="muted">{health?.deployment.runtime || "Vercel-compatible Next.js API routes"}</p>
                <span className="pill">{health?.deployment.vectorProvider || "local"}</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}
