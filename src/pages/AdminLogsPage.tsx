import { useWorkflowLogs } from '../hooks/useReports';
import { useUserStore } from '../store/userStore';
import { formatDateTime } from '../utils/formatters';

export const AdminLogsPage = () => {
  const { isAdmin } = useUserStore();
  const logs = useWorkflowLogs();

  if (!isAdmin) {
    return <p className="text-sm text-slate-500">Admin role is required to view workflow logs.</p>;
  }

  if (logs.isLoading) return <p>Loading workflow logs...</p>;

  return (
    <div className="space-y-2">
      {(logs.data ?? []).map((log) => (
        <div key={log.id} className="rounded-lg bg-white p-3 text-sm shadow-card dark:bg-slate-900">
          <div className="mb-1 flex justify-between gap-3">
            <strong>{log.status}</strong>
            <span>{formatDateTime(log.created_at)}</span>
          </div>
          <p className="mb-1 text-slate-600 dark:text-slate-300">{log.message}</p>
          <p className="text-xs opacity-70">
            source: {log.source} | level: {log.level} | execution: {log.execution_time_ms ?? '-'} ms
          </p>
        </div>
      ))}
    </div>
  );
};
