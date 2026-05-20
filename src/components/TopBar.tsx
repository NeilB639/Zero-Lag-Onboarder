import { Search } from 'lucide-react';
import { LogoutButton } from './LogoutButton';
import { useUiStore } from '../store/uiStore';
import { useUserStore } from '../store/userStore';

export const TopBar = () => {
  const { search, setSearch } = useUiStore();
  const { profile } = useUserStore();
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <label className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        <Search size={16} />
        <input
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reports..."
        />
      </label>
      <div className="flex items-center gap-3">
        <p className="text-sm text-slate-600 dark:text-slate-300">{profile?.email}</p>
        <LogoutButton />
      </div>
    </div>
  );
};
