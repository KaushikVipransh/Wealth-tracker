WealthOS: Next-Generation Asset Intelligence Cockpit | LIVE WEBSITE:https://wealth-tracker-blush.vercel.app/
WealthApp is a real-time personal finance tracker designed for power users who value data density and operational precision. Moving away from generic SaaS templates, WealthOS features a custom Obsidian Terminal UI coupled with a unique Hybrid AI Webhook Pipeline that allows users to log transactions directly via WhatsApp using natural language processing.

🚀 Key Integrations & Architecture
1. Hybrid AI WhatsApp Automation (Meta Cloud API)
Instead of manually navigating through web forms, users can seamlessly manage their ledger by texting their dedicated WealthApp WhatsApp business entity in plain, conversational language.

The Webhook Engine: A unified secure route handler interfaces seamlessly with Meta’s real-time events pipeline to capture incoming transaction streams.

The Hybrid Parser Router: To minimize network latency and eliminate unnecessary API costs, the ingestion engine uses a multi-layered fallback pipeline:

-Layer 1 (Token Engine): Instantly scans strings for raw numbers and shorthand notations (~5ms execution cost).

-Layer 2 (Google Gen AI SDK): If the input is conversational, the payload cascades to Gemini 1.5 Flash. Enforced via strict JSON schemas, Gemini extracts type-safe structural parameters (Amount, Transaction Type, Category, and Account mapping) straight to the database layer.

2. Fiduciary Data Engine (Prisma & PostgreSQL)
Atomic Transactions: Powered by a cloud PostgreSQL instance mapped through Prisma ORM with absolute decimal scale handling to mitigate floating-point arithmetic rounding bugs.

Secure Session States: Integrated full user lifecycle protection, account gating, and automated routing via Clerk Authentication.

🛠️ Tech Stack
Frontend: Next.js (App Router), React, Tailwind CSS

Backend: Serverless Webhooks, Google Gen AI SDK (@google/genai)

Database & Auth: PostgreSQL, Prisma ORM, Clerk Auth

Deployment: Vercel Production Pipeline, Meta WhatsApp Cloud API

📂 System Flow Blueprint
[User texts WhatsApp] 
       │
       ▼
[Meta Cloud API Ingestion Webhook]
       │
       ▼
[Next.js Serverless Ingestion Engine]
       │
       ├───► (Matches Clean Shorthand) ──► [Layer 1: Fast Token Parser] ──┐
       │                                                                  ▼
       └───► (Conversational Sentences) ─► [Layer 2: Gemini 1.5 Flash] ───┼─► [Clean JSON Schema]
                                                                          │
       ┌──────────────────────────────────────────────────────────────────┘
       ▼
[Prisma Client: PostgreSQL Atomic Update]
       │
       ▼
[Real-Time Obsidian Dashboard Sync]
⚡ Environment Variables Configuration
To run this system locally, populate a .env file at your root directory with the following keys:

Plaintext
# Database Connection
DATABASE_URL="your_postgresql_connection_string"

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Intelligence Core Engine Keys
GEMINI_API_KEY=your_gemini_api_key
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token
🛠️ Getting Started
Clone the project and install dependencies:

Bash
npm install
Synchronize database states and compile Prisma client engines:

Bash
npx prisma generate
Run the development environment:

Bash
npm run dev