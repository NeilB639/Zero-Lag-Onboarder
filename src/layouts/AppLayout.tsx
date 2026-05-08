import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { useUiStore } from '../store/uiStore';

export const AppLayout = () => {
  const { darkMode } = useUiStore();
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Sidebar />
        <main className="flex-1 p-6">
          <TopBar />
          <Outlet />
        </main>
      </div>
    </div>
  );
};
