import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDocumentsForRole, insertDocument } from "@/lib/repository";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ documents: await getDocumentsForRole(user.role) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const document = await insertDocument({
      id: `doc_${Date.now()}`,
      title: body.title || "Uploaded document",
      source: body.source || "manual-upload.txt",
      department: body.department || user.department,
      sensitivity: body.sensitivity || "internal",
      owner: user.name,
      status: user.role === "admin" ? "indexed" : "review",
      uploadedAt: new Date().toISOString().slice(0, 10),
      tokens: String(body.content || "").split(/\s+/).length,
      content: body.content || ""
  });

  return NextResponse.json({
    document,
    message:
      user.role === "admin"
        ? "Document accepted and indexed in the demo vector store."
        : "Document submitted for admin approval before indexing."
  });
}
