import Link from "next/link";
import { getDashboardAnalytics } from "../actions/dashboard";

export default async function DashboardPage() {
  const result = await getDashboardAnalytics();

  if (!result.success) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          ❌ Failed to load financial intelligence metrics: {result.error}
        </div>
      </div>
    );
  }

  // 🇮🇳 Inline Indian Rupee (INR) Formatter Engine for Server Components
  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const { totalAssetBalance, totalIncome, totalExpense, categoryBreakdown, recentTransactions } = result;

  // 🧮 Calculate absolute combined transaction volume across all category pools
  const totalTransactionVolume = categoryBreakdown.reduce((sum, cat) => sum + cat.value, 0);

  // 📈 Calculate high-level liquid savings health ratios
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      
      {/* 👋 HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Command Center</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time tracking of your liquidity, wealth pools, and budget allocations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/account" className="px-4 py-2 border bg-white hover:bg-slate-50 rounded-lg text-sm font-medium transition shadow-sm">
            Manage Accounts
          </Link>
          <Link href="/transaction" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-sm">
            + Log Transaction
          </Link>
        </div>
      </div>

      {/* 💰 HIGH LEVEL METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Net Liquidity Card */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-6 -mt-6" />
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Worth Allocation</span>
            <h3 className={`text-3xl font-black tracking-tight mt-2 ${totalAssetBalance >= 0 ? "text-slate-900" : "text-red-600"}`}>
              {formatINR(totalAssetBalance)}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-4 pt-3 border-t">Combined value of cash, checking, minus card liabilities.</p>
        </div>

        {/* Dynamic Inflows Card */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Total Inflow (Income)</span>
            <h3 className="text-3xl font-black text-emerald-600 tracking-tight mt-2">
              +{formatINR(totalIncome)}
            </h3>
          </div>
          <div className="text-xs text-slate-400 mt-4 pt-3 border-t flex justify-between">
            <span>Savings Rate:</span>
            <span className={`font-bold ${savingsRate >= 20 ? "text-emerald-600" : "text-amber-600"}`}>
              {savingsRate.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Dynamic Outflows Card */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider">Total Outflow (Expenses)</span>
            <h3 className="text-3xl font-black text-rose-600 tracking-tight mt-2">
              -{formatINR(totalExpense)}
            </h3>
          </div>
          <div className="text-xs text-slate-400 mt-4 pt-3 border-t flex justify-between">
            <span>Burn Velocity:</span>
            <span>{totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(0) : "0"}% of income</span>
          </div>
        </div>

      </div>

      {/* 📊 ANALYTICS & RECENT ENTRIES GRID CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 📉 VISUAL COMPREHENSIVE CASH FLOW BREAKDOWN */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm h-fit space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Cash Flow Allocation</h3>
            <p className="text-xs text-slate-400 mt-0.5">Full tracking of all incoming and outgoing money channels.</p>
          </div>

          <div className="space-y-4">
            {[
              { id: "FOOD", name: "Food & Dining", emoji: "🍔" },
              { id: "SHOPPING", name: "Shopping", emoji: "🛍️" },
              { id: "ENTERTAINMENT", name: "Entertainment", emoji: "🎬" },
              { id: "UTILITIES", name: "Bills & Utilities", emoji: "⚡" },
              { id: "INVESTMENT", name: "Investments", emoji: "📈" },
              { id: "OTHERS", name: "Others / Misc", emoji: "🏷️" },
            ].map((masterCategory) => {
              const matchedData = categoryBreakdown.find((c) => c.name === masterCategory.id);
              const categoryTotal = matchedData ? matchedData.value : 0;
              
              // 🛡️ Scales perfectly against the dynamic baseline volume sum instead of just expenses
              const allocationPercentage = totalTransactionVolume > 0 
                ? (categoryTotal / totalTransactionVolume) * 100 
                : 0;

              return (
                <div key={masterCategory.id} className="space-y-1.5 group">
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-slate-600 font-medium tracking-wide flex items-center gap-1.5">
                      <span>{masterCategory.emoji}</span>
                      <span>{masterCategory.name}</span>
                    </span>
                    <span className="text-slate-900 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-100 transition group-hover:bg-slate-100">
                      {formatINR(categoryTotal)}
                    </span>
                  </div>
                  
                  {/* Track line visualization gauge wrapper */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out" 
                      style={{ width: `${allocationPercentage}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <span className="text-[10px] text-slate-400 font-semibold tracking-tight">
                      {allocationPercentage.toFixed(1)}% of total volume
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 📋 RECENT TRANSACTIONS STREAM LEDGER */}
        <div className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Account Activity</h3>
              <p className="text-xs text-slate-400 mt-0.5">The latest 5 transactions processed through your workspace engine.</p>
            </div>
            <Link href="/transaction" className="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline">
              View All History →
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center py-16 text-sm text-slate-400 border border-dashed rounded-xl">
              No transactions logs found. Link a transaction item entry to fill this ledger view!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0 transition hover:bg-slate-50/50 px-2 rounded-lg">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">{tx.description || "Uncategorized Transaction"}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-semibold text-slate-500 uppercase bg-slate-100 px-1.5 py-0.5 rounded">{tx.category}</span>
                      <span>•</span>
                      <span>{new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    </div>
                  </div>
                  <span className={`text-base font-black tracking-tight ${tx.type === "INCOME" ? "text-emerald-600" : "text-rose-600"}`}>
                    {tx.type === "INCOME" ? "+" : "-"}{formatINR(tx.amount).replace("INR", "").trim()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}