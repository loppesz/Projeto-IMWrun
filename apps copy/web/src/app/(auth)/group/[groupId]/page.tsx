'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { BottomNav } from '@/components/BottomNav';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
interface GroupMember {
  participantNumber: string;
  name: string;
  status: 'waiting' | 'running' | 'finished' | 'incomplete';
  validKm?: number;
  time?: string;
}

interface GroupData {
  id: string;
  name: string;
  raceName: string;
  maxSize: number;
  startedAt: string | null; // ISO string ou null
  members: GroupMember[];
}

// ---------------------------------------------------------------------------
// Mock — será substituído por GET /api/groups/:id
// ---------------------------------------------------------------------------
const MOCK_GROUP: GroupData = {
  id: 'grp-1',
  name: 'Grupo A',
  raceName: 'IMW Run #03',
  maxSize: 6,
  startedAt: null, // null = aguardando admin
  members: [
    { participantNumber: '0001', name: 'Carlos Eduardo', status: 'waiting' },
    { participantNumber: '0002', name: 'Ana Lima',        status: 'waiting' },
    { participantNumber: '0003', name: 'João Pedro',      status: 'waiting' },
    { participantNumber: '0042', name: 'Você',            status: 'waiting' },
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const STATUS_ICON: Record<GroupMember['status'], string> = {
  waiting:    '⏳',
  running:    '🏃',
  finished:   '✅',
  incomplete: '⚠️',
};

const STATUS_LABEL: Record<GroupMember['status'], string> = {
  waiting:    'Aguardando',
  running:    'Correndo',
  finished:   'Concluído',
  incomplete: 'Incompleto',
};

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
export default function GroupWaitPage() {
  const [group, setGroup] = useState<GroupData>(MOCK_GROUP);
  const [elapsed, setElapsed] = useState(0);
  const [validDistance, setValidDistance] = useState(0); // metros
  const [runState, setRunState] = useState<'waiting' | 'running' | 'done'>('waiting');

  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const mockRunRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const TARGET = 5000;

  // Simula polling a cada 3s para saber se admin liberou
  useEffect(() => {
    if (runState !== 'waiting') return;

    pollRef.current = setInterval(() => {
      // Em produção: fetch('/api/groups/grp-1/status')
      // Por ora o botão "Simular admin" faz isso
    }, 3000);

    return () => clearInterval(pollRef.current!);
  }, [runState]);

  // Inicia corrida ao receber sinal
  function handleStart() {
    const now = new Date().toISOString();
    setGroup(g => ({ ...g, startedAt: now }));
    setRunState('running');

    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);

    // Simula acúmulo de distância para demo (acelerado)
    mockRunRef.current = setInterval(() => {
      setValidDistance(d => {
        const next = d + 50;
        if (next >= TARGET) {
          clearInterval(mockRunRef.current!);
          clearInterval(timerRef.current!);
          setRunState('done');
          return TARGET;
        }
        return next;
      });
    }, 300);
  }

  function handleManualStop() {
    clearInterval(timerRef.current!);
    clearInterval(mockRunRef.current!);
    setRunState('done');
  }

  useEffect(() => () => {
    clearInterval(timerRef.current!);
    clearInterval(mockRunRef.current!);
    clearInterval(pollRef.current!);
  }, []);

  const progressPct = Math.min((validDistance / TARGET) * 100, 100);

  return (
    <>
      <main className={`min-h-screen pb-20 md:pb-0 transition-colors ${
        runState === 'running' ? 'bg-gray-900 text-white' : 'bg-brand-light'
      }`}>

        {/* Header */}
        <div className={`px-5 py-4 ${runState === 'running' ? 'bg-gray-800' : 'bg-brand-primary text-white'}`}>
          <div className="mx-auto max-w-lg flex items-center justify-between">
            <Link href="/calendar" className="text-sm opacity-70 hover:opacity-100">← Sair</Link>
            <div className="text-center">
              <p className="font-bold">{group.name}</p>
              <p className="text-xs opacity-70">{group.raceName}</p>
            </div>
            <div className={`h-2.5 w-2.5 rounded-full ${
              runState === 'running' ? 'bg-green-400 animate-pulse' :
              runState === 'done' ? 'bg-blue-400' : 'bg-yellow-400 animate-pulse'
            }`} />
          </div>
        </div>

        <div className="mx-auto max-w-lg px-4 py-6 space-y-5">

          {/* ── AGUARDANDO ── */}
          {runState === 'waiting' && (
            <>
              <div className="rounded-2xl bg-white p-6 text-center shadow-md">
                <div className="text-5xl mb-3 animate-bounce">⏳</div>
                <h2 className="text-xl font-bold text-brand-dark">Aguardando largada</h2>
                <p className="mt-2 text-sm text-gray-500">
                  O administrador vai liberar a corrida para todos ao mesmo tempo.
                  Fique nesta tela!
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-400 animate-ping" />
                  <span className="text-sm text-yellow-600 font-medium">Verificando a cada 3 segundos...</span>
                </div>
              </div>

              {/* Botão de simulação para demo */}
              <button
                onClick={handleStart}
                className="flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-brand-accent font-bold text-white shadow transition hover:bg-green-500"
              >
                🧪 Simular: Admin liberou o grupo
              </button>
            </>
          )}

          {/* ── CORRENDO ── */}
          {runState === 'running' && (
            <>
              {/* Métricas */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Distância', value: `${(validDistance / 1000).toFixed(2)} km`, sub: `de 5 km` },
                  { label: 'Tempo',     value: formatTime(elapsed),                        sub: 'mm:ss' },
                  { label: 'Faltam',    value: `${((TARGET - validDistance) / 1000).toFixed(2)} km`, sub: '' },
                ].map(m => (
                  <div key={m.label} className="rounded-2xl bg-gray-800 p-3 text-center">
                    <p className="text-2xl font-extrabold">{m.value}</p>
                    <p className="text-xs text-gray-400">{m.label}</p>
                    {m.sub && <p className="text-[10px] text-gray-600">{m.sub}</p>}
                  </div>
                ))}
              </div>

              {/* Barra de progresso */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progresso</span>
                  <span>{progressPct.toFixed(0)}%</span>
                </div>
                <div className="h-4 rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-accent transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Membros do grupo em tempo real */}
              <div className="rounded-2xl bg-gray-800 p-4">
                <p className="text-sm font-bold text-gray-300 mb-3">👥 Seu grupo</p>
                <div className="space-y-2">
                  {group.members.map(m => (
                    <div key={m.participantNumber} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{STATUS_ICON[m.name === 'Você' ? (runState === 'running' ? 'running' : 'waiting') : 'running']}</span>
                        <span className={`text-sm ${m.name === 'Você' ? 'font-bold text-brand-accent' : 'text-gray-300'}`}>
                          {m.name} {m.name === 'Você' ? '(você)' : ''}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">#{m.participantNumber}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleManualStop}
                className="flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-red-500 font-bold text-white transition hover:bg-red-600"
              >
                ⏹ Encerrar minha corrida
              </button>
            </>
          )}

          {/* ── CONCLUÍDO ── */}
          {runState === 'done' && (
            <div className="rounded-2xl bg-white p-6 text-center shadow-md">
              {validDistance >= TARGET ? (
                <>
                  <div className="text-5xl mb-3">🏅</div>
                  <h2 className="text-2xl font-extrabold text-brand-accent">Grupo concluído!</h2>
                  <p className="mt-1 text-sm text-gray-500">Você completou os 5 km com seu grupo.</p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-3">⏸️</div>
                  <h2 className="text-xl font-bold text-brand-dark">Corrida encerrada</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {(validDistance / 1000).toFixed(2)} km de 5 km percorridos.
                  </p>
                </>
              )}

              <div className="my-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xl font-bold text-brand-dark">{(validDistance / 1000).toFixed(2)} km</p>
                  <p className="text-xs text-gray-500">distância válida</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xl font-bold text-brand-dark">{formatTime(elapsed)}</p>
                  <p className="text-xs text-gray-500">tempo total</p>
                </div>
              </div>

              {/* Resultado do grupo */}
              <div className="mb-5 rounded-xl bg-brand-primary/5 p-4 text-left">
                <p className="text-xs font-bold text-brand-dark mb-2">👥 Resultado do {group.name}</p>
                {group.members.map((m, i) => (
                  <div key={m.participantNumber} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-700">{m.name === 'Você' ? <strong>{m.name}</strong> : m.name}</span>
                    <span className="text-xs text-gray-500">
                      {i === 0 ? '5.0 km • 32:14' : i === 1 ? '5.0 km • 35:02' : i === 2 ? '5.0 km • 38:44' : `${(validDistance / 1000).toFixed(2)} km • ${formatTime(elapsed)}`}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/profile"
                className="flex min-h-[44px] items-center justify-center rounded-xl bg-brand-primary font-bold text-white transition hover:bg-blue-700"
              >
                Ver meu perfil →
              </Link>
            </div>
          )}

          {/* Membros aguardando (estado waiting) */}
          {runState === 'waiting' && (
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="font-bold text-brand-dark mb-3">
                👥 {group.name} — {group.members.length}/{group.maxSize} membros
              </h3>
              <div className="space-y-2">
                {group.members.map(m => (
                  <div key={m.participantNumber} className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-bold text-brand-primary">
                      #{m.participantNumber}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${m.name === 'Você' ? 'text-brand-primary' : 'text-gray-800'}`}>
                        {m.name} {m.name === 'Você' ? '(você)' : ''}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">{STATUS_LABEL[m.status]}</span>
                  </div>
                ))}
              </div>
              {group.members.length < group.maxSize && (
                <p className="mt-3 text-center text-xs text-gray-400">
                  Aguardando mais {group.maxSize - group.members.length} participante(s)...
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
