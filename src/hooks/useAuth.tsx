import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { reportService } from '../services/reportService';
import { useUserStore } from '../store/userStore';

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const setProfile = useUserStore((state) => state.setProfile);
  const clear = useUserStore((state) => state.clear);

  useEffect(() => {
    let isMounted = true;
    const loadingGuard = window.setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 8000);

    const hydrate = async () => {
      try {
        const sessionResponse = await supabase.auth.getSession();
        if (!isMounted) return;
        const { data } = sessionResponse;
        setSession(data.session);

        if (data.session) {
          try {
            const profile = await reportService.getCurrentUser();
            setProfile(profile);
          } catch {
            // Allow app navigation even when profile row is not ready yet.
            setProfile(null);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
        window.clearTimeout(loadingGuard);
      }
    };
    void hydrate();

    const { data } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      if (nextSession) {
        try {
          const profile = await reportService.getCurrentUser();
          setProfile(profile);
        } catch {
          setProfile(null);
        }
      } else {
        clear();
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      window.clearTimeout(loadingGuard);
      data.subscription.unsubscribe();
    };
  }, [clear, setProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      loading,
      signInWithPassword: async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      },
      signOut: async () => {
        await supabase.auth.signOut();
        clear();
      },
    }),
    [clear, loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
