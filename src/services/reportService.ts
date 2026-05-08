import { supabase } from '../lib/supabase';
import type {
  AppUser,
  AuditReport,
  DeadSku,
  Integration,
  OnboardingFlow,
  Payment,
  Setting,
  WorkflowLog
} from '../lib/types';
 
const isMissingRelationError = (
  error: { code?: string; message?: string } | null
) => {
  if (!error) return false;
 
  if (error.code === '42P01' || error.code === 'PGRST205') return true;
 
  return (error.message ?? '').toLowerCase().includes('does not exist');
};
 
console.log("in==========>");
 
export const reportService = {
 
  async getCurrentUser(): Promise<AppUser | null> {
 
    const usersResult = await supabase
      .from('users')
      .select('*')
      .limit(1)
      .maybeSingle();
 
    if (!usersResult.error) {
      return usersResult.data as AppUser | null;
    }
 
    if (!isMissingRelationError(usersResult.error)) {
      throw usersResult.error;
    }
 
    const userResult = await supabase
      .from('user')
      .select('*')
      .limit(1)
      .maybeSingle();
 
    if (userResult.error) throw userResult.error;
 
    return userResult.data as AppUser | null;
  },
 
  async listUsers(): Promise<AppUser[]> {
    const usersResult = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (!usersResult.error) {
      return (usersResult.data ?? []) as AppUser[];
    }

    if (!isMissingRelationError(usersResult.error)) {
      throw usersResult.error;
    }

    const userResult = await supabase
      .from('user')
      .select('*')
      .order('created_at', { ascending: false });

    if (userResult.error) {
      throw userResult.error;
    }

    return (userResult.data ?? []) as AppUser[];
  },
  async listReports(search = ''): Promise<AuditReport[]> {
    let query = supabase.from('audit_reports').select('*').order('created_at', { ascending: false });
    if (search) query = query.ilike('report_name', `%${search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return data as AuditReport[];
  },
  async listDeadSkus(reportId?: string): Promise<DeadSku[]> {
    let query = supabase.from('dead_skus').select('*').order('trapped_capital', { ascending: false });
    if (reportId) query = query.eq('report_id', reportId);
    const { data, error } = await query;
    if (error) throw error;
    return data as DeadSku[];
  },
  async listDeadSkusPaged({
    reportId,
    search,
    page,
    pageSize,
  }: {
    reportId?: string;
    search?: string;
    page: number;
    pageSize: number;
  }): Promise<{ rows: DeadSku[]; count: number }> {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('dead_skus')
      .select('*', { count: 'exact' })
      .order('trapped_capital', { ascending: false })
      .range(from, to);

    if (reportId) query = query.eq('report_id', reportId);
    if (search) query = query.or(`sku.ilike.%${search}%,product_name.ilike.%${search}%`);

    const { data, error, count } = await query;
    if (error) throw error;

    return { rows: (data ?? []) as DeadSku[], count: count ?? 0 };
  },
  async listPayments(): Promise<Payment[]> {
    const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(100);
    if (error) throw error;
    return data as Payment[];
  },
  async listOnboardingFlows(): Promise<OnboardingFlow[]> {
    const { data, error } = await supabase.from('onboarding_flows').select('*').order('created_at', { ascending: false }).limit(50);
    if (error) throw error;
    return data as OnboardingFlow[];
  },
  async listLogs(): Promise<WorkflowLog[]> {
    const { data, error } = await supabase
      .from('workflow_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return data as WorkflowLog[];
  },
  async listIntegrations(): Promise<Integration[]> {
    const { data, error } = await supabase.from('integrations').select('*');
    if (error) throw error;
    return data as Integration[];
  },
  async getSettings(): Promise<Setting | null> {
    const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle();
    if (error) throw error;
    return data as Setting | null;
  },
  async saveWorkflowLog(log: Pick<WorkflowLog, 'status' | 'message' | 'execution_time_ms' | 'source' | 'level'>) {
    const { error } = await supabase.from('workflow_logs').insert(log);
    if (error) throw error;
  },
};
