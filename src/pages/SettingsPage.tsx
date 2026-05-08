import { useOnboardingFlows, useSettings } from '../hooks/useReports';
import { Card } from '../components/Card';
import { useUserStore } from '../store/userStore';
import { formatDateTime } from '../utils/formatters';

export const SettingsPage = () => {
  const { profile } = useUserStore();
  const settings = useSettings();
  const flows = useOnboardingFlows();
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-2 text-lg font-semibold">Profile</h2>
        <p>Email: {profile?.email ?? '-'}</p>
        <p>Role: {profile?.role ?? 'user'}</p>
        <p>Onboarding status: {profile?.onboarding_status ?? '-'}</p>
      </Card>
      <Card>
        <h2 className="mb-2 text-lg font-semibold">Preferences</h2>
        <p>Default days without sales: {settings.data?.default_days_without_sales ?? 90}</p>
        <p>Timezone: {settings.data?.timezone ?? 'UTC'}</p>
      </Card>
      <Card>
        <h2 className="mb-2 text-lg font-semibold">Recent Onboarding Flows</h2>
        <div className="space-y-1 text-sm">
          {(flows.data ?? []).slice(0, 5).map((flow) => (
            <p key={flow.id}>
              {flow.status} | {flow.source} | {formatDateTime(flow.created_at)}
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
};
