import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white text-gray-950 min-h-screen font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 🚀 SECTION 1: HERO CONTAINER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white pt-24 pb-20 lg:pt-32 lg:pb-28">
        {/* Ambient Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 blur-3xl rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-700 bg-blue-50 border border-blue-200 rounded-full shadow-sm animate-fade-in">
            ✨ Next-Generation Asset Intelligence
          </span>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Take Absolute Control of Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Wealth</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Track multi-bank budgets, monitor accurate cash balances, and manage transactional ledger records cleanly within a secure workspace.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto text-center font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] px-8 py-4 rounded-xl transition shadow-md hover:shadow-lg shadow-blue-600/20"
            >
              Go to Dashboard →
            </Link>
            <a 
              href="#features" 
              className="w-full sm:w-auto text-center font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-8 py-4 rounded-xl transition"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* 📊 SECTION 2: LIVE METRICS STRIP */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">$0.00ms</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Transaction Delay</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">100%</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Type Safety Enforced</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">256-bit</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Supabase Encryption</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">Pure JSON</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Network Boundary Serialization</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🧩 SECTION 3: MODERN BENTO FEATURES GRID */}
      <section id="features" className="py-24 bg-white scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Engineered for Complete Precision
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Everything you need to map out your liquid net worth without dealing with messy spreadsheets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1: Accounts */}
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl flex flex-col justify-between hover:border-blue-200 transition group">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition">
                  💳
                </div>
                <h3 className="text-xl font-bold text-slate-900">Multi-Account Portfolios</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Isolate and track your Checking, Savings, and Credit card pools. All mapped to custom database structures via Prisma objects.
                </p>
              </div>
              <div className="pt-6">
                <Link href="/account" className="text-xs font-bold text-blue-600 group-hover:underline">Manage Accounts →</Link>
              </div>
            </div>

            {/* Bento Card 2: Ledger Updates */}
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl flex flex-col justify-between hover:border-blue-200 transition group">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition">
                  📝
                </div>
                <h3 className="text-xl font-bold text-slate-900">Concurrent Transactions</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Log your expenses and incoming salary streams securely. Our backend auto-adjusts account balances inside centralized database transactions.
                </p>
              </div>
              <div className="pt-6">
                <Link href="/transaction" className="text-xs font-bold text-indigo-600 group-hover:underline">View History Ledger →</Link>
              </div>
            </div>

            {/* Bento Card 3: Boundary Guarding */}
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl flex flex-col justify-between hover:border-blue-200 transition group">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition">
                  🛡️
                </div>
                <h3 className="text-xl font-bold text-slate-900">Zero-Leak Serialization</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Built on strict, isolated Next.js network primitive serialization boundaries ensuring zero browser client pipeline memory leakage.
                </p>
              </div>
              <div className="pt-6">
                <span className="text-xs font-bold text-emerald-600">Active Node Security</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 📣 SECTION 4: CALL TO ACTION */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 blur-3xl rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to track flawlessly?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Log in with your secured account credentials and launch your personal financial infrastructure workspace right now.
          </p>
          <div className="pt-4">
            <Link 
              href="/dashboard" 
              className="inline-block bg-white text-slate-950 font-bold px-8 py-3.5 rounded-xl hover:bg-slate-100 transition shadow-lg"
            >
              Enter Dashboard
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}