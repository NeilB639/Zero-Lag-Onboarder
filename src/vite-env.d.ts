/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_URL?: string;
  readonly VITE_DASHBOARD_PDF_URL?: string;
  readonly VITE_N8N_BASE_URL?: string;
  readonly VITE_N8N_WEBHOOK_URL?: string;
  readonly VITE_N8N_TRIGGER_AUDIT_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
