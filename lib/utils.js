/**
 * Formats a numeric value or Decimal string into clean Indian Rupees (INR)
 * @param {number | string | Object} amount 
 * @returns {string} - Formatted currency string (e.g., ₹45,200.50)
 */
export function formatINR(amount) {
  if (amount == null) return "₹0.00";
  
  // Convert Prisma Decimal objects or strings safely to standard numbers
  const numericAmount = typeof amount === "object" && amount.toNumber 
    ? amount.toNumber() 
    : Number(amount);

  if (isNaN(numericAmount)) return "₹0.00";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(numericAmount);
}