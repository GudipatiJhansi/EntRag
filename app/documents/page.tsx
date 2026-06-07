"use client";

import AppShell from "@/components/AppShell";
import { FileUp } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { DocumentRecord } from "@/lib/types";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/documents")
      .then((res) => res.json())
      .then((data) => setDocuments(data.documents || []));
  }, []);

  async function submitDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const response = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form))
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Document submission failed.");
      return;
    }
    setMessage(data.message);
    setDocuments((items) => [data.document, ...items]);
    formElement.reset();
  }

  return (
    <AppShell title="Documents" subtitle="Ingest, approve, and monitor enterprise knowledge sources.">
      <div className="grid cols-2">
        <section className="card">
          <h2>Upload knowledge</h2>
          <form className="form" onSubmit={submitDocument}>
            <label className="field">
              <span>Title</span>
              <input className="input" name="title" placeholder="Procurement FAQ" required />
            </label>
            <label className="field">
              <span>Department</span>
              <input className="input" name="department" placeholder="Operations" />
            </label>
            <label className="field">
              <span>Sensitivity</span>
              <select className="select" name="sensitivity">
                <option value="internal">Internal</option>
                <option value="public">Public</option>
                <option value="confidential">Confidential</option>
              </select>
            </label>
            <label className="field">
              <span>Content</span>
              <textarea className="textarea" name="content" placeholder="Paste document text for the demo index..." required />
            </label>
            {message ? <p className="muted">{message}</p> : null}
            <button className="button">
              <FileUp size={18} />
              Submit document
            </button>
          </form>
        </section>
        <section className="card">
          <h2>Indexed library</h2>
          <div className="table-list">
            {documents.map((doc) => (
              <div className="document-row" key={doc.id}>
                <div>
                  <strong>{doc.title}</strong>
                  <p className="muted">
                    {doc.department} · {doc.tokens} tokens · {doc.source}
                  </p>
                </div>
                <span className={doc.status === "review" ? "pill warn" : "pill"}>{doc.status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
