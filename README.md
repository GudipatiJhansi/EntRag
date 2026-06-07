# EntRAG Guard: Enterprise-Grade RAG Platform

EntRAG Guard is a Vercel-ready full-stack capstone project that presents Retrieval Augmented Generation as a real enterprise SaaS product. It includes authentication, role based access control, document ingestion, governed retrieval, cited answers, admin analytics, prompt security, and RAGAS-inspired evaluation.

## Generated Project Prompt

Build an enterprise-grade RAG SaaS platform named EntRAG Guard. It must include secure authentication, role based access control, document ingestion, vector retrieval, cited AI answers, an admin dashboard, usage analytics, prompt-injection defenses, RAGAS-inspired evaluation metrics, and Vercel deployment. The product should feel like a real internal AI knowledge platform for companies, not a classroom demo.

## Features

- Authentication with signed HTTP-only session cookies
- Demo roles: admin and analyst
- Role-aware document access
- RAG chat with retrieved source citations
- Local vector search abstraction for demo retrieval
- Optional OpenAI answer generation through environment variables
- Admin dashboard with platform, security, and retrieval analytics
- Document submission and approval-style workflow
- Prompt injection and policy-bypass detection
- RAGAS-inspired metrics: context precision, faithfulness, answer relevancy
- Vercel deployment configuration for frontend and backend together

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Vercel Serverless API routes
- MongoDB Atlas or local MongoDB
- Lucide React icons
- Local demo vector retrieval with optional production provider placeholders

## Demo Accounts

Admin:

```txt
admin@acme.ai
Admin@12345
```

Analyst:

```txt
analyst@acme.ai
User@12345
```

## Local Setup

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Production Build

```bash
npm run build
```

## Vercel Deployment

This project deploys both frontend and backend on Vercel because all backend endpoints are implemented as Next.js API routes under `app/api`.

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Keep the framework preset as Next.js.
4. Add the environment variables from `.env.example`.
5. Deploy.

Important variables:

```txt
SESSION_SECRET=replace-with-a-long-random-secret
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/entrag_guard
MONGODB_DB=entrag_guard
DEMO_ADMIN_EMAIL=admin@acme.ai
DEMO_ADMIN_PASSWORD=Admin@12345
DEMO_USER_EMAIL=analyst@acme.ai
DEMO_USER_PASSWORD=User@12345
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
VECTOR_DB_PROVIDER=local
```

MongoDB does not require an API key for normal app database access. Use a MongoDB URI from MongoDB Atlas or a local MongoDB server. You only need an AI API key when enabling real model generation through `OPENAI_API_KEY`; otherwise the app uses the deterministic demo answer generator.

## API Routes

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/chat`
- `GET /api/documents`
- `POST /api/documents`
- `GET /api/evaluations`
- `POST /api/evaluations`
- `GET /api/admin/metrics`

## Production Upgrade Ideas

- Replace local retrieval with Pinecone, Qdrant, Weaviate, or Supabase Vector.
- Store users, documents, and audit logs in Postgres.
- Add PDF parsing and chunking workers.
- Add real RAGAS evaluation jobs.
- Add tenant isolation for multi-company SaaS.
- Add SSO with Auth.js, Clerk, or WorkOS.
