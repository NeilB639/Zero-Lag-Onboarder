import { useState } from 'react';
import type { FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const { signInWithPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithPassword(email, password);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid email or password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-xl bg-white p-6 shadow-card dark:bg-slate-900">
        <h2 className="mb-2 text-xl font-semibold">Sign in</h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Sign in with your registered email and password.
        </p>
        <input
          className="mb-3 w-full rounded border p-2"
          placeholder="you@company.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="mb-4 w-full rounded border p-2"
          placeholder="Enter password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button disabled={loading} className="w-full rounded bg-brand-600 px-4 py-2 text-white disabled:opacity-50">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
};
