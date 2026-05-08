import { useMemo } from 'react';
import { Card } from '../components/Card';
import { DashboardCharts } from '../components/Charts';
import { useDeadSkus, useReports, useTriggerAudit } from '../hooks/useReports';
import { useUiStore } from '../store/uiStore';
import { useUserStore } from '../store/userStore';

export const DashboardPage = () => {
  const { search } = useUiStore();
  const { profile } = useUserStore();
  const reportsQuery = useReports(search);
  const deadSkuQuery = useDeadSkus(reportsQuery.data?.[0]?.id);
  const trigger = useTriggerAudit();

  const summary = useMemo(() => {
    const reports = reportsQuery.data ?? [];
    return {
      totalReports: reports.length,
      trappedCapital: reports.reduce((sum, r) => sum + r.total_trapped_capital, 0),
      deadSkus: reports.reduce((sum, r) => sum + r.dead_sku_count, 0),
    };
  }, [reportsQuery.data]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card><p className="text-sm opacity-70">Total Reports</p><p className="text-2xl font-bold">{summary.totalReports}</p></Card>
        <Card><p className="text-sm opacity-70">Total Trapped Capital</p><p className="text-2xl font-bold">${summary.trappedCapital.toFixed(2)}</p></Card>
        <Card><p className="text-sm opacity-70">Dead SKU Count</p><p className="text-2xl font-bold">{summary.deadSkus}</p></Card>
        <Card>
          <button
            onClick={() => {
              if (!profile?.id) return;
              trigger.mutate({ source: 'manual', user_id: profile.id, days_without_sales: 90 });
            }}
            className="w-full rounded bg-brand-600 px-4 py-2 text-white"
          >
            {trigger.isPending ? 'Triggering...' : 'Trigger SKU Audit'}
          </button>
        </Card>
      </div>
      <DashboardCharts reports={reportsQuery.data ?? []} deadSkus={deadSkuQuery.data ?? []} />
    </div>
  );
};
