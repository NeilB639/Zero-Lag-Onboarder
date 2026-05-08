import { http } from './http';
import { env } from '../lib/env';
import type { TriggerAuditPayload } from '../lib/types';

const getTriggerAuditUrl = () => {
  if (env.n8nWebhookUrl) return env.n8nWebhookUrl;
  if (!env.n8nBaseUrl) {
    throw new Error('Missing n8n URL. Set VITE_N8N_BASE_URL (or legacy VITE_N8N_WEBHOOK_URL).');
  }
  return `${env.n8nBaseUrl}${env.n8nTriggerAuditPath}`;
};

export const n8nApi = {
  triggerAudit: (payload: TriggerAuditPayload) => http.post(getTriggerAuditUrl(), payload).then((res) => res.data),
};
