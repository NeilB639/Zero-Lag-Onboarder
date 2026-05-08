import { create } from 'zustand';
import type { AppUser } from '../lib/types';

interface UserState {
  profile: AppUser | null;
  isAdmin: boolean;
  setProfile: (profile: AppUser | null) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isAdmin: false,
  setProfile: (profile) => set({ profile, isAdmin: profile?.role === 'admin' }),
  clear: () => set({ profile: null, isAdmin: false }),
}));
