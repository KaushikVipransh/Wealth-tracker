"use client";

import { useState, useEffect, startTransition } from "react";
import { createTransaction, getUserTransactions } from "../actions/transaction";
import { getUserAccounts } from "../actions/account";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🇮🇳 Inline Indian Rupee (INR) Formatter Engine
  const formatINR = (amount) => {
    const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numericAmount) || numericAmount == null) return "₹0.00";
    
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  };

  async function loadData() {
    try {
      const [txData, accData] = await Promise.all([
        getUserTransactions(),
        getUserAccounts(),
      ]);

      setTransactions(txData);
      setAccounts(accData);
    } catch (error) {
      console.error("❌ UI Load error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const result = await createTransaction(formData);
    if (result.success) {
      form.reset();
      startTransition(() => {
        loadData();
      });
    } else {
      alert(`Transaction Error: ${result.error}`);
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* 📝 LEFT COLUMN: LOG TRANSACTION FORM */}
      <div className="bg-white border rounded-xl p-6 shadow-sm h-fit">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Log Transaction</h2>
        
        {accounts.length === 0 ? (
          <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
            ⚠️ You must create a bank account under the Accounts tab before you can log transactions!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input 
                type="text" 
                name="description" 
                placeholder="e.g., Kirana Store, Salary Bonus" 
                required
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select 
                  name="type" 
                  required
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="EXPENSE">Expense (-)</option>
                  <option value="INCOME">Income (+)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  name="amount" 
                  step="0.01" 
                  placeholder="0.00" 
                  required
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* 🏷️ NEW: CATEGORY TAG SELECTION DROP-DOWN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Tag</label>
              <select 
                name="category" 
                required
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:border-blue-500 transition"
              >
                <option value="FOOD">Food & Dining 🍔</option>
                <option value="SHOPPING">Shopping 🛍️</option>
                <option value="ENTERTAINMENT">Entertainment 🎬</option>
                <option value="UTILITIES">Bills & Utilities ⚡</option>
                <option value="INVESTMENT">Investments 📈</option>
                <option value="SALARY">Salary / Income 💰</option>
                <option value="OTHERS">Others / Misc 🏷️</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Account</label>
              <select 
                name="accountId" 
                required
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:border-blue-500 transition"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({formatINR(acc.balance)})
                  </option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition shadow-sm"
            >
              Log Entry
            </button>
          </form>
        )}
      </div>

      {/* 📋 RIGHT COLUMN: LIVE TRANSACTION LEDGER */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Transaction History Ledger</h2>
        
        {loading ? (
          <div className="text-center text-sm text-gray-500 p-12">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="bg-gray-50 border border-dashed rounded-xl p-12 text-center text-gray-500">
            No entries logged yet. Add your first income or expense item on the left!
          </div>
        ) : (
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                  <div>
                    <h4 className="font-bold text-gray-900">{tx.description}</h4>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                      <span className="px-2 py-0.5 rounded bg-gray-100 font-medium uppercase">{tx.category}</span>
                      <span>•</span>
                      <span>{new Date(tx.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`text-lg font-black ${tx.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                    {tx.type === "INCOME" ? "+" : "-"}{formatINR(tx.amount).replace("INR", "").trim()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}