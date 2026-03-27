export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

export const formatPriceDecimal = (amount) => {
  if (amount === undefined || amount === null) return '₹0.00';
  return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};