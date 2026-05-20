import { useState } from 'react';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

type LogoutButtonProps = {
  variant?: 'topbar' | 'sidebar';
};

export const LogoutButton = ({ variant = 'topbar' }: LogoutButtonProps) => {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign out';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'sidebar') {
    return (
      <button
        type="button"
        onClick={() => void handleLogout()}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100 disabled:opacity-50 dark:border-red-900 dark:bg-red-950 dark:text-red-200 dark:hover:bg-red-900"
      >
        <LogOut size={16} />
        {loading ? 'Signing out...' : 'Log out'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={loading}
      className="flex items-center gap-2 rounded border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <LogOut size={14} />
      {loading ? 'Signing out...' : 'Log out'}
    </button>
  );
};
