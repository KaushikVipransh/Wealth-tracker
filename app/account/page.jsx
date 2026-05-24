import { createBankAccount, getUserAccounts } from "../actions/account";

export default async function AccountPage() {
  // ⚡ Fetch active accounts straight from the database during server-side rendering
  const accounts = await getUserAccounts();

  // 🇮🇳 Native Indian Rupee (INR) Formatter Engine
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

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* 💳 LEFT COLUMN: CREATE ACCOUNT FORM */}
      <div className="bg-white border rounded-xl p-6 shadow-sm h-fit">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Add Bank Account</h2>
        
        {/* Native Server Actions form mapping */}
        <form action={createBankAccount} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
            <input 
              type="text" 
              name="name" 
              placeholder="e.g., SBI Savings, HDFC Salary" 
              required
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select 
              name="type" 
              required
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:border-blue-500 transition"
            >
              <option value="CHECKING">Checking</option>
              <option value="SAVINGS">Savings</option>
              <option value="CREDIT">Credit Card</option>
              <option value="INVESTMENT">Investment</option>
            </select>
          </div>

          <div>
            {/* Updated initial balance label indicator to Rupees */}
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Balance (₹)</label>
            <input 
              type="number" 
              name="balance" 
              step="0.01" 
              placeholder="0.00" 
              required
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition shadow-sm"
          >
            Create Account
          </button>
        </form>
      </div>

      {/* 📊 RIGHT COLUMN: ACTIVE ACCOUNTS GRID LIST */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Your Accounts</h2>
        
        {accounts.length === 0 ? (
          <div className="bg-gray-50 border border-dashed rounded-xl p-12 text-center text-gray-500">
            No bank accounts found. Create one on the left to start tracking your balances!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account) => (
              <div key={account.id} className="bg-white border rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 tracking-wide uppercase">
                    {account.type}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-2">{account.name}</h3>
                </div>
                <div className="mt-4 border-t pt-3 flex justify-between items-baseline">
                  <span className="text-sm text-gray-500">Current Balance</span>
                  {/* Swapped out dollar formatting for the localized INR formatting engine */}
                  <span className="text-2xl font-black text-gray-900">
                    {formatINR(account.balance)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}