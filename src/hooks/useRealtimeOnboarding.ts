import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import type { OnboardingFlow } from '../lib/types';

interface UseRealtimeOnboardingOptions {
  userId?: string;
  onCompleted?: () => void;
}

export const useRealtimeOnboarding = ({ userId, onCompleted }: UseRealtimeOnboardingOptions) => {
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`onboarding-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'onboarding_flows', filter: `user_id=eq.${userId}` },
        (payload) => {
          const flow = payload.new as OnboardingFlow;
          if (flow?.status === 'completed') {
            toast.success('Onboarding completed. Your latest reports are ready.');
            onCompleted?.();
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [onCompleted, userId]);
};
