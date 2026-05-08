import { format } from 'date-fns';

export const formatDateTime = (input?: string | null) => {
  if (!input) return '-';
  return format(new Date(input), 'PP p');
};

export const formatCurrency = (value: number, currency: 'USD' | 'INR' = 'USD') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
