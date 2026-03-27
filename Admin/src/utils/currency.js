export const CURRENCY_SYMBOL = '₹';

export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};