import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { n8nApi } from '../api/n8nApi';
import { reportService } from '../services/reportService';
import type { TriggerAuditPayload } from '../lib/types';

export const queryKeys = {
  me: ['me'],
  users: ['users'],
  reports: ['reports'],
  deadSkus: ['deadSkus'],
  logs: ['logs'],
  payments: ['payments'],
  flows: ['flows'],
  integrations: ['integrations'],
  settings: ['settings'],
};

export const useCurrentUser = () =>
  useQuery({
    queryKey: queryKeys.me,
    queryFn: reportService.getCurrentUser,
  });

export const useUsers = () =>
  useQuery({
    queryKey: queryKeys.users,
    queryFn: reportService.listUsers,
    refetchInterval: 30_000,
  });

export const useReports = (search = '') =>
  useQuery({
    queryKey: [...queryKeys.reports, search],
    queryFn: () => reportService.listReports(search),
    refetchInterval: 30_000,
  });

export const useDeadSkus = (reportId?: string) =>
  useQuery({
    queryKey: [...queryKeys.deadSkus, reportId],
    queryFn: () => reportService.listDeadSkus(reportId),
  });

export const useDeadSkusTable = (params: { reportId?: string; search?: string; page: number; pageSize: number }) =>
  useQuery({
    queryKey: [...queryKeys.deadSkus, 'table', params.reportId, params.search, params.page, params.pageSize],
    queryFn: () => reportService.listDeadSkusPaged(params),
    placeholderData: (previous) => previous,
  });

export const useWorkflowLogs = () =>
  useQuery({
    queryKey: queryKeys.logs,
    queryFn: reportService.listLogs,
    refetchInterval: 15_000,
  });

export const usePayments = () =>
  useQuery({
    queryKey: queryKeys.payments,
    queryFn: reportService.listPayments,
  });

export const useOnboardingFlows = () =>
  useQuery({
    queryKey: queryKeys.flows,
    queryFn: reportService.listOnboardingFlows,
  });

export const useIntegrations = () =>
  useQuery({ queryKey: queryKeys.integrations, queryFn: reportService.listIntegrations });

export const useSettings = () =>
  useQuery({ queryKey: queryKeys.settings, queryFn: reportService.getSettings });

export const useTriggerAudit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TriggerAuditPayload) => {
      const started = Date.now();
      await reportService.saveWorkflowLog({
        level: 'info',
        status: 'started',
        message: 'Manual audit triggered from dashboard',
        source: 'dashboard',
        execution_time_ms: null,
      });
      const response = await n8nApi.triggerAudit(payload);
      await reportService.saveWorkflowLog({
        level: 'info',
        status: 'queued',
        message: 'n8n webhook accepted audit request',
        source: 'dashboard',
        execution_time_ms: Date.now() - started,
      });
      return response;
    },
    onSuccess: () => {
      toast.success('Audit triggered successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.reports });
      queryClient.invalidateQueries({ queryKey: queryKeys.logs });
    },
    onError: async (error: Error) => {
      await reportService.saveWorkflowLog({
        level: 'error',
        status: 'error',
        message: error.message,
        source: 'dashboard',
        execution_time_ms: null,
      });
      toast.error('Failed to trigger audit');
    },
  });
};
