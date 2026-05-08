export type UserRole = 'admin' | 'user';
export type OnboardingStatus = 'queued' | 'in_progress' | 'completed' | 'failed' | 'retrying';

export interface AppUser {
  id: string;
  auth_user_id: string | null;
  email: string;
  full_name: string | null;
  role: UserRole;
  onboarding_status: OnboardingStatus;
  stripe_customer_id: string | null;
  created_at: string;
}

export interface AuditReport {
  id: string;
  user_id: string;
  report_name: string;
  total_products: number;
  dead_sku_count: number;
  total_trapped_capital: number;
  currency: string;
  days_without_sales: number;
  context: Record<string, unknown>;
  metadata: Record<string, unknown>;
  google_sheet_url: string | null;
  google_sheet_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeadSku {
  id: string;
  report_id: string;
  user_id: string;
  sku: string;
  product_name: string;
  inventory: number;
  sales_price: number;
  trapped_capital: number;
  days_without_sales: number;
  last_sale_date: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface WorkflowLog {
  id: string;
  user_id: string | null;
  flow_id: string | null;
  report_id: string | null;
  level: 'info' | 'warn' | 'error';
  status: string;
  message: string;
  source: string;
  execution_time_ms: number | null;
  context: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string | null;
  email: string;
  currency: string;
  amount_cents: number;
  status: string;
  plan_code: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface OnboardingFlow {
  id: string;
  user_id: string;
  payment_id: string | null;
  source: string;
  workflow_version: string;
  status: OnboardingStatus;
  started_at: string | null;
  finished_at: string | null;
  last_error: string | null;
  context: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Integration {
  id: string;
  name: string;
  status: string;
  webhook_url: string | null;
  last_synced_at: string | null;
  metadata: Record<string, unknown>;
}

export interface Setting {
  id: string;
  user_id: string;
  default_days_without_sales: number;
  dark_mode: boolean;
  timezone: string;
}

export interface TriggerAuditPayload {
  source: 'manual';
  user_id: string;
  days_without_sales: number;
}
