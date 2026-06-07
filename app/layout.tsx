import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EntRAG Guard",
  description: "Enterprise RAG platform with admin dashboard, analytics, security, and evaluation."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
