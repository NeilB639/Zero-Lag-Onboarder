import { Copy, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useReports } from '../hooks/useReports';
import { useUiStore } from '../store/uiStore';
import { formatCurrency, formatDateTime } from '../utils/formatters';

export const ReportsPage = () => {
  const { search } = useUiStore();
  const { data = [], isLoading } = useReports(search);
  if (isLoading) return <p>Loading reports...</p>;
  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-slate-900">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className="p-3 text-left">Report</th>
            <th>Products</th>
            <th>Dead SKUs</th>
            <th>Trapped Capital</th>
            <th>Google Sheet</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {data.map((report) => (
            <tr key={report.id} className="border-t border-slate-100 dark:border-slate-800">
              <td className="p-3">{report.report_name}</td>
              <td>{report.total_products}</td>
              <td>{report.dead_sku_count}</td>
              <td>{formatCurrency(report.total_trapped_capital, report.currency === 'INR' ? 'INR' : 'USD')}</td>
              <td>
                {report.google_sheet_url && (
                  <div className="flex gap-2">
                    <a href={report.google_sheet_url} target="_blank" rel="noreferrer"><ExternalLink size={16} /></a>
                    <button onClick={() => { if (report.google_sheet_url) { navigator.clipboard.writeText(report.google_sheet_url); toast.success('Link copied'); } }}><Copy size={16} /></button>
                  </div>
                )}
              </td>
              <td>{formatDateTime(report.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
