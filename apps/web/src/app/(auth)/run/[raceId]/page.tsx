'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { BottomNav } from '@/components/BottomNav';

type RunState = 'idle' | 'running' | 'finished' | 'no_gps';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function formatPace(seconds: number, meters: number) {
  if (meters < 100) return '--:--';
  const paceSecPerKm = (seconds / meters) * 1000;
  const m = Math.floor(paceSecPerKm / 60).toString().padStart(2, '0');
  const s = Math.floor(paceSecPerKm % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function RunPage() {
  const [state, setState] = useState<RunState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [validDistance, setValidDistance] = useState(0); // metros
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mockRunRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const TARGET = 5000;
  const progressPct = Math.min((validDistance / TARGET) * 100, 100);

  function startRun() {
    setState('running');

    // Timer real
    timerRef.current = setInterval(() => {
      setElapsed(e => e + 1);
    }, 1000);

    // Simula acúmulo de distância (~4,2 m/s = 15 km/h caminhada rápida) a cada 5s
    mockRunRef.current = setInterval(() => {
      setValidDistance(d => {
        const next = d + 21; // ~21m a cada 5s
        if (next >= TARGET) {
          clearInterval(mockRunRef.current!);
          clearInterval(timerRef.current!);
          setState('finished');
          return TARGET;
        }
        return next;
      });
    }, 500); // acelerado para demo
  }

  function stopRun() {
    clearInterval(timerRef.current!);
    clearInterval(mockRunRef.current!);
    setState('finished');
  }

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current!);
      clearInterval(mockRunRef.current!);
    };
  }, []);

  return (
    <>
      <main className="min-h-screen bg-gray-900 text-white pb-20 md:pb-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <Link href="/calendar" className="text-gray-400 hover:text-white text-sm">← Sair</Link>
          <p className="font-bold">IMW Run #03</p>
          <div className={`h-2.5 w-2.5 rounded-full ${state === 'running' ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
        </div>

        {/* Mapa simulado */}
        <div className="relative mx-4 mb-4 overflow-hidden rounded-2xl bg-gray-800" style={{ height: 220 }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-2">🗺️</p>
              <p className="text-sm text-gray-400">
                {state === 'idle' ? 'Mapa aparece ao iniciar' : 'Rastreamento GPS ativo'}
              </p>
            </div>
          </div>
          {/* Rota simulada */}
          {state === 'running' && (
            <div className="absolute bottom-3 left-3 right-3">
              <div className="h-1.5 rounded-full bg-gray-700">
                <div
                  className="h-full rounded-full bg-brand-accent transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Métricas */}
        <div className="mx-4 grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Distância', value: `${(validDistance / 1000).toFixed(2)} km`, sub: `de ${TARGET / 1000} km` },
            { label: 'Tempo',     value: formatTime(elapsed),                        sub: 'mm:ss' },
            { label: 'Ritmo',     value: formatPace(elapsed, validDistance),         sub: 'min/km' },
          ].map(m => (
            <div key={m.label} className="rounded-2xl bg-gray-800 p-3 text-center">
              <p className="text-2xl font-extrabold text-white">{m.value}</p>
              <p className="text-xs text-gray-400">{m.label}</p>
              <p className="text-[10px] text-gray-600">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* Progresso */}
        {state === 'running' && (
          <div className="mx-4 mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progresso</span>
              <span>{progressPct.toFixed(0)}%</span>
            </div>
            <div className="h-3 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-accent transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Tela idle */}
        {state === 'idle' && (
          <div className="mx-4 rounded-2xl bg-gray-800 p-6 text-center">
            <p className="text-4xl mb-3">🏃</p>
            <h2 className="text-xl font-bold mb-1">Pronto para correr?</h2>
            <p className="text-sm text-gray-400 mb-5">
              Você precisa percorrer 5 km dentro do percurso oficial para concluir a corrida.
            </p>
            <button
              onClick={startRun}
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-accent text-lg font-extrabold text-white shadow-lg transition active:scale-95 hover:bg-green-500"
            >
              🚀 Iniciar Corrida
            </button>
            <p className="mt-3 text-xs text-gray-500">
              O GPS será solicitado ao iniciar
            </p>
          </div>
        )}

        {/* Rodando */}
        {state === 'running' && (
          <div className="mx-4">
            <button
              onClick={stopRun}
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-red-500 text-lg font-extrabold text-white shadow-lg transition active:scale-95 hover:bg-red-600"
            >
              ⏹ Encerrar Corrida
            </button>
          </div>
        )}

        {/* Concluído */}
        {state === 'finished' && (
          <div className="mx-4 rounded-2xl bg-gray-800 p-6 text-center">
            {validDistance >= TARGET ? (
              <>
                <div className="text-5xl mb-3">🏅</div>
                <h2 className="text-2xl font-extrabold text-brand-accent mb-1">Corrida concluída!</h2>
                <p className="text-sm text-gray-400 mb-5">Parabéns! Você completou os 5 km.</p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-3">⏸️</div>
                <h2 className="text-xl font-bold mb-1">Corrida encerrada</h2>
                <p className="text-sm text-gray-400 mb-5">
                  Você percorreu {(validDistance / 1000).toFixed(2)} km de 5 km necessários.
                </p>
              </>
            )}

            <div className="grid grid-cols-3 gap-3 mb-5 text-center">
              <div className="rounded-xl bg-gray-700 p-3">
                <p className="text-lg font-bold">{(validDistance / 1000).toFixed(2)}</p>
                <p className="text-xs text-gray-400">km válidos</p>
              </div>
              <div className="rounded-xl bg-gray-700 p-3">
                <p className="text-lg font-bold">{formatTime(elapsed)}</p>
                <p className="text-xs text-gray-400">tempo total</p>
              </div>
              <div className="rounded-xl bg-gray-700 p-3">
                <p className="text-lg font-bold">{formatPace(elapsed, validDistance)}</p>
                <p className="text-xs text-gray-400">ritmo/km</p>
              </div>
            </div>

            <Link
              href="/profile"
              className="flex min-h-[44px] items-center justify-center rounded-2xl bg-brand-primary font-bold text-white transition hover:bg-blue-700"
            >
              Ver meu perfil →
            </Link>
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );
}
