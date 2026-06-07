"use client";

import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@acme.ai");
  const [password, setPassword] = useState("Admin@12345");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    setLoading(false);
    if (!response.ok) {
      setError("Invalid demo credentials.");
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div>
          <p className="eyebrow">Enterprise RAG SaaS</p>
          <h1>EntRAG Guard</h1>
          <p>
            A production-style knowledge platform with secure retrieval, cited answers, admin analytics, and
            RAGAS-inspired evaluation for enterprise AI teams.
          </p>
        </div>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <p className="eyebrow">Secure workspace</p>
          <h2>Sign in</h2>
          <p className="muted">Use the demo accounts to explore admin and analyst permissions.</p>
          <form className="form" onSubmit={login}>
            <label className="field">
              <span>Email</span>
              <input className="input" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {error ? <p className="error">{error}</p> : null}
            <button className="button" disabled={loading}>
              <LockKeyhole size={18} />
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <div className="demo-credentials">
            <span>
              <ShieldCheck size={14} /> Admin: admin@acme.ai / Admin@12345
            </span>
            <span>Analyst: analyst@acme.ai / User@12345</span>
          </div>
        </div>
      </section>
    </div>
  );
}
