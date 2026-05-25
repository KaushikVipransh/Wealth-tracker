<div align="center">

<h1>
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=28&pause=1000&color=3B82F6&center=true&vCenter=true&width=500&lines=WEALTHOS+%E2%80%94+Financial+Terminal" alt="WealthOS" />
</h1>

**Multi-bank portfolio intelligence. Atomic ledger engine. WhatsApp AI injection.**

<p>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
  <a href="https://prisma.io"><img src="https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" /></a>
  <a href="https://clerk.com"><img src="https://img.shields.io/badge/Clerk-v7-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk" /></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
  <a href="https://ai.google.dev"><img src="https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" /></a>
</p>

<p>
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-whatsapp-integration">WhatsApp</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-environment-variables">Environment</a>
</p>

</div>

---

## What is WealthOS?

WealthOS is a precision financial tracking platform built for full control over multi-bank portfolios. It pairs a dark-terminal web dashboard with a **WhatsApp AI pipeline** — send `"Spent 350 on lunch from SBI"` and it parses, categorizes, and atomically writes the transaction directly to your database.

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 🏦 | **Multi-Account Portfolio** | Track Checking, Savings, Credit, and Investment pools across any number of banks |
| 📒 | **Atomic Ledger Engine** | Every write uses `DB.$transaction()` — ledger entries and balance updates are always in sync |
| 📊 | **Financial Command Dashboard** | Net Worth, Income, Expense metrics with a live Cash Flow allocation chart |
| 💬 | **WhatsApp AI Injection** | Natural-language transaction logging via Twilio + Gemini 2.5 Flash |
| 🔐 | **Zero-trust Auth** | Clerk v7 JWT guards all protected routes at the middleware layer |
| 🇮🇳 | **INR-native** | All monetary values formatted in Indian Rupee with Intl.NumberFormat |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- [Supabase](https://supabase.com) project (PostgreSQL)
- [Clerk](https://clerk.com) application
- [Google AI Studio](https://aistudio.google.com) API key

### 1 — Clone & install

```bash
git clone https://github.com/your-username/wealthos.git
cd wealthos
npm install
```

### 2 — Configure environment

```bash
cp .env.example .env
```

Fill in your `.env` — see the [Environment Variables](#-environment-variables) section for all keys.

### 3 — Push database schema

```bash
npx prisma generate
npx prisma db push
```

### 4 — Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — sign up, and your database row is created automatically on first load.

---

## 🗺 Application Routes

| Route | Access | Render | Description |
|---|---|---|---|
| `/` | Public | Server | Landing page |
| `/sign-in` | Public | Server | Clerk sign-in |
| `/sign-up` | Public | Server | Clerk sign-up |
| `/dashboard` | 🔒 Protected | Server | Analytics command center |
| `/account` | 🔒 Protected | Server | Portfolio manager — create & view accounts |
| `/transaction` | 🔒 Protected | Client | Log transactions, view full history |

### API Endpoints

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/user/update-phone` | `POST` | Clerk JWT | Link a phone number for WhatsApp |
| `/api/webhook/whatsapp` | `POST` | Twilio | Receive message → AI parse → write to DB |

---

## 💬 WhatsApp Integration

Log transactions from your phone in plain English — no app, no form, just WhatsApp.

### How the pipeline works

```
WhatsApp Message  →  Twilio  →  /api/webhook/whatsapp
                                          │
                               Phone lookup (whatsappPhone)
                                          │
                              lib/transactionParser.js
                                 ┌────────┴────────┐
                            Local regex          Gemini 2.5 Flash
                            (0ms, 0 tokens)     (structured JSON schema)
                                 └────────┬────────┘
                               Account name match (fuzzy)
                                          │
                               DB.$transaction()
                              ┌───────────┴───────────┐
                       transaction.create()    account.update()
                              └───────────┬───────────┘
                               WhatsApp confirmation
```

### Setup (3 steps)

1. **Link your phone** on the dashboard → *SYSTEM_INTEGRATION_PIPELINES* panel
2. **Open WhatsApp** → message `+14155238886`
3. **Send** `join none-screen` to activate the sandbox

### Example messages

```
"Spent 120 on coffee from SBI"        →  ₹120  · EXPENSE · FOOD       · SBI account
"Received salary 50000 in HDFC"       →  ₹50,000 · INCOME · SALARY    · HDFC account  
"Paid electricity bill 800 axis"      →  ₹800  · EXPENSE · UTILITIES  · Axis account
"Amazon 1500 pnb"                     →  ₹1,500 · EXPENSE · SHOPPING  · PNB account
```

> [!NOTE]
> If the mentioned account name doesn't match any of your registered accounts, the transaction is logged against your first (oldest) account as a fallback.

---

## 🏗 Architecture

<details>
<summary><strong>Project structure</strong></summary>

```
wealth/
├── app/
│   ├── (auth)/                          # Route group — no Navbar, isolated layout
│   │   ├── layout.js
│   │   ├── sign-in/[[...sign-in]]/page.jsx
│   │   └── sign-up/[[...sign-up]]/page.jsx
│   │
│   ├── account/page.jsx                 # Server Component + CreateAccountForm (Client)
│   ├── dashboard/page.jsx               # Server Component — analytics
│   ├── transaction/page.jsx             # Client Component — live form + history
│   │
│   ├── actions/
│   │   ├── account.js                   # createBankAccount, getUserAccounts
│   │   ├── dashboard.js                 # getDashboardAnalytics
│   │   ├── transaction.js               # createTransaction, getUserTransactions
│   │   └── user.js                      # syncUserToDatabase — upsert on first login
│   │
│   ├── api/
│   │   ├── user/update-phone/route.js   # Save WhatsApp phone to DB
│   │   └── webhook/whatsapp/route.js    # Twilio → AI parse → atomic DB write
│   │
│   ├── components/
│   │   ├── CreateAccountForm.jsx        # Client Component with error/success state
│   │   ├── Navbar.jsx                   # Sticky auth-aware navigation
│   │   └── WhatsAppSettings.jsx         # Integration panel
│   │
│   ├── globals.css                      # Design tokens + component CSS classes
│   ├── layout.js                        # Root layout — ClerkProvider, fonts, footer
│   └── page.js                          # Landing page
│
├── lib/
│   ├── prisma.js                        # Prisma singleton (PrismaPg driver adapter)
│   └── transactionParser.js             # Hybrid AI parser (local → Gemini fallback)
│
├── prisma/
│   └── schema.prisma
└── middleware.js                        # Clerk route protection
```

</details>

<details>
<summary><strong>Database schema</strong></summary>

```prisma
model User {
  id            String        @id @default(uuid())
  clerkUserId   String        @unique
  email         String        @unique
  name          String?
  imageUrl      String?
  whatsappPhone String?       @unique   // Twilio WhatsApp binding
  accounts      Account[]
  transactions  Transaction[]
}

model Account {
  id        String      @id @default(uuid())
  name      String                          // "SBI Savings", "HDFC Salary"
  type      AccountType                     // CHECKING | SAVINGS | CREDIT | INVESTMENT
  balance   Decimal     @db.Decimal(12,2)   // Updated atomically on every transaction
  userId    String                          // FK → User.id
}

model Transaction {
  id          String          @id @default(uuid())
  type        TransactionType                 // INCOME | EXPENSE
  amount      Decimal         @db.Decimal(12,2)
  description String?
  category    String                          // FOOD | SHOPPING | ENTERTAINMENT |
                                             // UTILITIES | INVESTMENT | SALARY | OTHERS
  date        DateTime
  userId      String                          // FK → User.id
  accountId   String                          // FK → Account.id
}

model Budget {
  id            String    @id @default(uuid())
  amount        Decimal   @db.Decimal(12,2)
  lastAlertSent DateTime?
  userId        String    @unique             // FK → User.id
}
```

</details>

### Key design decisions

**User sync on first login**  
Clerk manages auth sessions but not the app database. `syncUserToDatabase()` is called at the top of every `/dashboard` render — it's a single `findUnique` no-op for returning users, and creates the `User` row for new sign-ups *before* any data fetching begins. This eliminates the race condition between Clerk session creation and DB row availability.

**Atomic balance updates**  
Every write that mutates both a `Transaction` row and `Account.balance` is wrapped in `DB.$transaction()`. If either operation fails, both are rolled back — the ledger and balance are always consistent.

**Hybrid AI parser**  
`lib/transactionParser.js` runs two levels: a local regex fast-path for simple numeric inputs (`"250"` → instantly resolved, 0 Gemini tokens) and a Gemini structured-output call with a strict JSON schema for natural language. The webhook always uses this shared library — no duplicated logic.

**Prisma Decimal serialization**  
All Prisma query results crossing the Server → Client Component boundary go through `JSON.parse(JSON.stringify(...))` to strip `Prisma.Decimal` and `Date` objects into plain primitives, preventing Turbopack RSC serialization errors.

---

## 🎨 Design System

WealthOS uses a **dark cyber terminal** aesthetic with a consistent token system applied entirely via vanilla CSS inline styles.

```
Background   #090D16       Surface      #0D1420 / #0F1825
Border       #1E293B       Text         #E2E8F0 / #64748B / #334155

Blue   #3B82F6  →  accounts, primary actions
Green  #10B981  →  income, success states
Red    #F43F5E  →  expenses, error states
Amber  #F59E0B  →  shopping, warnings
Purple #A78BFA  →  WhatsApp integration panel
Sky    #38BDF8  →  utilities category

Fonts: Inter (body UI) · JetBrains Mono (labels, values, monospace)
```

Global CSS classes (`btn-cyber`, `btn-ghost`, `input-terminal`, `select-terminal`, `status-live`, `status-live-dot`) are defined in `app/globals.css` and used across every component.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Supabase connection string — use `?pgbouncer=true` for pooled mode |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk frontend publishable key |
| `CLERK_SECRET_KEY` | ✅ | Clerk server secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | ✅ | Set to `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | ✅ | Set to `/sign-up` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | ✅ | Post sign-in redirect *(Clerk v7)* |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | ✅ | Post sign-up redirect *(Clerk v7)* |
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key |

> [!WARNING]
> Clerk v7 renamed the post-auth redirect variables. Using the old `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` keys will silently fail and cause 404s after login.

---

## 📜 Scripts

```bash
npm run dev      # Turbopack dev server → http://localhost:3000
npm run build    # prisma generate + next build
npm run start    # Production server
npm run lint     # ESLint
```

---

## 📄 License

MIT — build freely, track precisely.

---

<div align="center">

Made with Next.js · Clerk · Prisma · Supabase · Gemini · Twilio

</div>