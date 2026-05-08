import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { OverviewPage } from '../pages/OverviewPage';
import { LoginPage } from '../pages/LoginPage';
import { PdfPage } from '../pages/PdfPage';
import { useAuth } from '../hooks/useAuth';

export const AppRouter = () => {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="p-6">
        <p className="mb-2">Loading session...</p>
        <p className="text-sm text-slate-500">If this takes too long, refresh once and open /login directly.</p>
      </div>
    );
  }
  if (!session) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/pdf" element={<PdfPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
