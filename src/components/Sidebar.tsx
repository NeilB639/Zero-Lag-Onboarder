import { LayoutDashboard, FileText, Moon, Sun } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useUiStore } from '../store/uiStore';

const navItems = [
  { to: '/', label: 'Users List', icon: LayoutDashboard },
  { to: '/pdf', label: 'PDF', icon: FileText },
];

export const Sidebar = () => {
  const { darkMode, toggleDarkMode } = useUiStore();
  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-4 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <h1 className="mb-8 text-lg font-semibold">Zero-Lag Onboarder</h1>
      <nav className="space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={toggleDarkMode}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        {darkMode ? 'Light' : 'Dark'} mode
      </button>
    </aside>
  );
};
