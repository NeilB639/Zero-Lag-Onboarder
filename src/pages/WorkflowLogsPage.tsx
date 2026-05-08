import { useWorkflowLogs } from '../hooks/useReports';
import { formatDateTime } from '../utils/formatters';

export const WorkflowLogsPage = () => {
  const logs = useWorkflowLogs();
  if (logs.isLoading) return <p>Loading workflow logs...</p>;
  return (
    <div className="space-y-2">
      {(logs.data ?? []).map((log) => (
        <div key={log.id} className="rounded-lg bg-white p-3 text-sm shadow-card dark:bg-slate-900">
          <div className="mb-1 flex justify-between">
            <strong>{log.status}</strong>
            <span>{formatDateTime(log.created_at)}</span>
          </div>
          <p>{log.message}</p>
        </div>
      ))}
    </div>
  );
};
