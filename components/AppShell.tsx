"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Bot, FileText, Gauge, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";

const links = [
  { href: "/dashboard", label: "Overview", icon: Gauge },
  { href: "/chat", label: "RAG Chat", icon: Bot },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/evaluations", label: "Evaluation", icon: ShieldCheck },
  { href: "/admin", label: "Admin", icon: BarChart3, admin: true }
];

export default function AppShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("unauthorized");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => router.replace("/"));
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
  }

  if (!user) return null;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          EntRAG Guard
        </div>
        <nav className="nav" aria-label="Main navigation">
          {links
            .filter((link) => !link.admin || user.role === "admin")
            .map((link) => {
              const Icon = link.icon;
              return (
                <Link className={pathname === link.href ? "active" : ""} href={link.href} key={link.href}>
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
        </nav>
        <button className="logout-button" onClick={logout}>
          <LogOut size={18} />
          Sign out
        </button>
      </aside>
      <main className="main">
        <div className="topbar">
          <div className="page-title">
            <h1>{title}</h1>
            <p className="muted">{subtitle}</p>
          </div>
          <div>
            <span className="pill">{user.role === "admin" ? "Admin" : "Analyst"}</span>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
