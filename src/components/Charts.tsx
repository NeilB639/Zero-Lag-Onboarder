import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AuditReport, DeadSku } from '../lib/types';
import { Card } from './Card';

export const DashboardCharts = ({ reports, deadSkus }: { reports: AuditReport[]; deadSkus: DeadSku[] }) => {
  const top10 = deadSkus.slice(0, 10).map((x) => ({ sku: x.sku, trapped: x.trapped_capital }));
  const trends = reports.slice(0, 12).reverse().map((x) => ({ name: x.report_name, value: x.total_trapped_capital }));
  const distribution = [
    { name: 'Dead SKUs', value: deadSkus.length },
    { name: 'Healthy SKUs', value: Math.max(reports[0]?.total_products ?? 0 - deadSkus.length, 0) },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <h3 className="mb-2 font-semibold">Top 10 Dead SKUs</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={top10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
              <XAxis dataKey="sku" hide />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="trapped" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="mb-2 font-semibold">Historical Audit Trends</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
              <XAxis dataKey="name" hide />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="mb-2 font-semibold">Inventory Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={distribution} dataKey="value" nameKey="name" fill="#0284c7" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
