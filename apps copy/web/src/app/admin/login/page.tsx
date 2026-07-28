'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    // Mock: admin@imwrun.com / admin123
    setTimeout(() => {
      setLoading(false);
      if (email === 'admin@imwrun.com' && password === 'admin123') {
        router.push('/admin/dashboard');
      } else {
        setError('Credenciais inválidas.');
      }
    }, 900);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-2xl shadow-lg">
            🔐
          </div>
          <h1 className="text-2xl font-extrabold text-white">Área Admin</h1>
          <p className="mt-1 text-sm text-gray-400">IMW Run — Painel de controle</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-xl">
          <div className="mb-4">
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@imwrun.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-brand-primary focus:outline-none"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-brand-primary focus:outline-none"
            />
          </div>

          {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-brand-primary font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <p className="mt-3 text-center text-xs text-gray-400">
            Use: admin@imwrun.com / admin123
          </p>
        </form>
      </div>
    </main>
  );
}
