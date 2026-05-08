export const env = {
  supabaseUrl: 'https://fjyziawfclatqyriniae.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqeXppYXdmY2xhdHF5cmluaWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMzg4MjYsImV4cCI6MjA5MzcxNDgyNn0.EbvKIA8tnchmxt6MWoZaulr3wfrfBnS9GROq9LOjhQc',
  appUrl: import.meta.env.VITE_APP_URL || window.location.origin,
  dashboardPdfUrl: import.meta.env.VITE_DASHBOARD_PDF_URL || '',
  dashboardDocUrl: import.meta.env.VITE_DASHBOARD_DOC_URL || '',
  n8nBaseUrl: import.meta.env.VITE_N8N_BASE_URL || '',
  n8nWebhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL || '',
  n8nTriggerAuditPath: import.meta.env.VITE_N8N_TRIGGER_AUDIT_PATH || '/trigger-audit',
};
