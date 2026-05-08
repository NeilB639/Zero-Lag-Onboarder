import { useEffect, useState } from 'react';
import type { AppUser } from '../lib/types';
import { reportService } from '../services/reportService';
import { formatDateTime } from '../utils/formatters';

export const OverviewPage = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
   
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
   
        console.log("API CALLING");
   
        const data = await reportService.listUsers();
   
        console.log(data, "===>data");
   
        if (!isMounted) return;
   
        setUsers(data);
      } catch (err) {
        if (!isMounted) return;
   
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to load users list.';
   
        setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
   
    void loadUsers();
   
    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  if (loading) return <p>Loading users...</p>;
  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => setReloadKey((prev) => prev + 1)}
          className="rounded bg-brand-600 px-3 py-2 text-sm text-white"
        >
          Retry loading users
        </button>
      </div>
    );
  }
  if (users.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 dark:text-slate-300">No users found for current session scope.</p>
        <button
          onClick={() => setReloadKey((prev) => prev + 1)}
          className="rounded bg-brand-600 px-3 py-2 text-sm text-white"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className="p-3 text-left">Email</th>
            <th className="text-left">Full Name</th>
            <th className="text-left">Role</th>
            <th className="text-left">Onboarding</th>
            <th className="text-left">Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-slate-100 dark:border-slate-800">
              <td className="p-3">{user.email}</td>
              <td>{user.full_name ?? '-'}</td>
              <td className="uppercase">{user.role}</td>
              <td>{user.onboarding_status}</td>
              <td>{formatDateTime(user.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
