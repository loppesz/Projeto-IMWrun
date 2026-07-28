/**
 * Cronômetro individual — participante entra no site no dia da corrida.
 * Admin libera a largada do seu grupo, cronômetro inicia automaticamente.
 * Ao cruzar a linha, participante aperta "Cheguei" e o tempo é registrado.
 */
'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { BottomNav } from '@/components/BottomNav';

type RunState = 'waiting' | 'running' | 'done';

// Mock do grupo do participante — em produção vem de GET /api/groups/:id/status
const MOCK_GROUP = {
  name: 'Grupo A',
  scheduledStart: '07:00',
  startedAt: null as number | null, // null = não iniciado ainda
};

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return h > 0 ? `${h}:${m}:${sec}` : `${m}:${sec}`;
}

export default function IndividualRunPage() {
  const [state, setState] = useState<RunState>('waiting');
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  // Polling a cada 3s — em produção: fetch('/api/groups/:id/status')
  // Quando admin iniciar o grupo, startedAt vira não-null
  useEffect(() => {
    if (state !== 'waiting') return;
    pollRef.current = setInterval(() => {
      // Simulação: substituir por fetch real
      // if (data.startedAt) handleStart(data.startedAt)
    }, 3000);
    return () => clearInterval(pollRef.current!);
  }, [state]);

  function handleStart(ts?: number) {
    const now = ts ?? Date.now();
    setStartedAt(now);
    setState('running');
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - now) / 1000));
    }, 500);
  }

  function handleFinish() {
    clearInterval(timerRef.current!);
    setState('done');
    // Em produção: POST /api/results { raceId, elapsedSeconds: elapsed }
  }

  useEffect(() => () => {
    clearInterval(timerRef.current!);
    clearInterval(pollRef.current!);
  }, []);

  return (
    <>
      <main className={`min-h-screen pb-20 transition-colors ${
        state === 'running' ? 'bg-gray-900 text-white' : 'bg-brand-light'
      }`}>
        {/* Header */}
        <div className={`px-5 py-4 ${state === 'running' ? 'bg-gray-800' : 'bg-brand-primary text-white'}`}>
          <div className="mx-auto max-w-lg flex items-center justify-between">
            <Link href="/calendar" className="text-sm opacity-70">← Sair</Link>
            <div className="text-center">
              <p className="font-bold">IMW Run #03</p>
              <p className="text-xs opacity-70">{MOCK_GROUP.name} · largada {MOCK_GROUP.scheduledStart}</p>
            </div>
            <div className={`h-2.5 w-2.5 rounded-full ${
              state === 'running' ? 'bg-green-400 animate-pulse' :
              state === 'done'    ? 'bg-blue-400' :
                                    'bg-yellow-400 animate-pulse'
            }`} />
          </div>
        </div>

        <div className="mx-auto max-w-lg px-4 py-8 space-y-5">

          {/* ── AGUARDANDO ── */}
          {state === 'waiting' && (
            <div className="rounded-2xl bg-white p-8 text-center shadow-md">
              <div className="text-5xl mb-4 animate-bounce">⏳</div>
              <h2 className="text-xl font-bold text-brand-dark">Aguardando largada</h2>
              <p className="mt-2 text-sm text-gray-500">
                Seu grupo ({MOCK_GROUP.name}) larga às{' '}
                <span className="font-bold text-brand-primary">{MOCK_GROUP.scheduledStart}</span>.
                <br />Fique nesta tela!
              </p>
              <div className="mt-4 mb-6 flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-yellow-400 animate-ping" />
                <span className="text-sm text-yellow-600">Verificando a cada 3s...</span>
              </div>
              <button
                onClick={() => handleStart()}
                className="w-full rounded-xl bg-brand-accent px-4 py-3 font-bold text-white transition hover:bg-green-500"
              >
                🧪 Simular: Admin liberou o grupo
              </button>
            </div>
          )}

          {/* ── CORRENDO ── */}
          {state === 'running' && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-gray-800 p-8 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
                  {MOCK_GROUP.name} · tempo decorrido
                </p>
                <p className="text-7xl font-extrabold tabular-nums tracking-tight">
                  {formatTime(elapsed)}
                </p>
              </div>
              <p className="text-center text-sm text-gray-400">
                Corra! Quando cruzar a linha, aperte o botão abaixo.
              </p>
              <button
                onClick={handleFinish}
                className="flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-brand-secondary text-xl font-extrabold text-white shadow-lg active:scale-95 hover:bg-amber-500"
              >
                🏁 Cruzei a linha!
              </button>
            </div>
          )}

          {/* ── CONCLUÍDO ── */}
          {state === 'done' && (
            <div className="rounded-2xl bg-white p-6 text-center shadow-md">
              <div className="text-5xl mb-3">🏅</div>
              <h2 className="text-2xl font-extrabold text-brand-dark">Parabéns!</h2>
              <p className="mt-1 text-sm text-gray-500">Seu tempo foi registrado.</p>

              <div className="my-5 rounded-2xl bg-brand-primary/5 p-5">
                <p className="text-xs text-gray-400 mb-1">{MOCK_GROUP.name} · IMW Run #03</p>
                <p className="text-5xl font-extrabold text-brand-primary tabular-nums">{formatTime(elapsed)}</p>
              </div>

              <p className="text-xs text-gray-400 mb-5">
                Passe na bancada para confirmar. Seu resultado já aparece no ranking.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/ranking"
                  className="flex min-h-[44px] items-center justify-center rounded-xl bg-brand-primary font-bold text-white transition hover:bg-blue-700"
                >
                  Ver ranking →
                </Link>
                <Link href="/profile" className="text-sm text-gray-500 hover:text-brand-primary">
                  Ver meu perfil
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
