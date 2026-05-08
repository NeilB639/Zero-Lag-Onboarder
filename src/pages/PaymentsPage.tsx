import { usePayments } from '../hooks/useReports';
import { formatCurrency, formatDateTime } from '../utils/formatters';

export const PaymentsPage = () => {
  const payments = usePayments();

  if (payments.isLoading) return <p>Loading payment history...</p>;

  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-slate-900">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className="p-3 text-left">Date</th>
            <th className="text-left">Amount</th>
            <th className="text-left">Currency</th>
            <th className="text-left">Plan</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {(payments.data ?? []).map((payment) => (
            <tr key={payment.id} className="border-t border-slate-100 dark:border-slate-800">
              <td className="p-3">{formatDateTime(payment.paid_at ?? payment.created_at)}</td>
              <td>{formatCurrency(payment.amount_cents / 100, payment.currency === 'INR' ? 'INR' : 'USD')}</td>
              <td>{payment.currency}</td>
              <td>{payment.plan_code ?? '-'}</td>
              <td>{payment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
