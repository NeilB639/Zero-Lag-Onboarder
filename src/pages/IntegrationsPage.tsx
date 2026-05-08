import { useIntegrations } from '../hooks/useReports';
import { Card } from '../components/Card';
import { formatDate } from '../utils/date';

export const IntegrationsPage = () => {
  const { data = [], isLoading } = useIntegrations();
  if (isLoading) return <p>Loading integrations...</p>;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {data.map((item) => (
        <Card key={item.id}>
          <h3 className="font-semibold">{item.name}</h3>
          <p>Status: {item.status}</p>
          <p>Webhook: {item.webhook_url ?? '-'}</p>
          <p>Last sync: {item.last_synced_at ? formatDate(item.last_synced_at) : '-'}</p>
        </Card>
      ))}
    </div>
  );
};
