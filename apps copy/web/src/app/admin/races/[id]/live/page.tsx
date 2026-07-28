'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
interface Member {
  id: string;
  number: string;
  name: string;
  present: boolean;
  finishTime?: number; // segundos desde a largada do grupo
}

interface Group {
  id: string;
  name: string;
  scheduledStart: string; // "HH:MM"
  startedAt: number | null; // timestamp JS (Date.now())
  members: Member[];
}

// ---------------------------------------------------------------------------
// Mock inicial — 4 grupos de 3, largadas de 12 em 12 min
// ---------------------------------------------------------------------------
const INITIAL_GROUPS: Group[] = [
  {
    id: 'g1', name: 'Grupo A', scheduledStart: '07:00', startedAt: null,
    members: [
      { id: 'm1', number: '0001', name: 'Carlos Eduardo', present: false },
      { id: 'm2', number: '0002', name: 'Ana Lima',        present: false },
      { id: 'm3', number: '0003', name: 'João Pedro',      present: false },
    ],
  },
  {
    id: 'g2', name: 'Grupo B', scheduledStart: '07:12', startedAt: null,
    members: [
      { id: 'm4', number: '0004', name: 'Roberto Silva',  present: false },
      { id: 'm5', number: '0005', name: 'Maria Fernanda', present: false },
      { id: 'm6', number: '0006', name: 'Patrícia Gomes', present: false },
    ],
  },
  {
    id: 'g3', name: 'Grupo C', scheduledStart: '07:24', startedAt: null,
    members: [
      { id: 'm7', number: '0007', name: 'Marcos Antonio',  present: false },
      { id: 'm8', number: '0008', name: 'Luciana Torres',  present: false },
      { id: 'm9', number: '0009', name: 'André Nascimento',present: false },
    ],
  },
  {
    id: 'g4', name: 'Grupo D', scheduledStart: '07:36', startedAt: null,
    members: [
      { id: 'm10', number: '0010', name: 'Sandra Moura',    present: false },
      { id: 'm11', number: '0011', name: 'Tiago Almeida',   present: false },
      { id: 'm12', number: '0012', name: 'Fernanda Costa',  present: false },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

function elapsed(startedAt: number) {
  return Math.floor((Date.now() - startedAt) / 1000);
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
export default function AdminLivePage() {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [tick, setTick] = useState(0); // força re-render a cada segundo
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Ticker para atualizar cronômetros
  useEffect(() => {
    intervalRef.current = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  // ── Largada geral (todos os grupos ao mesmo tempo) ──
  function startAll() {
    const now = Date.now();
    setGroups(prev => prev.map(g => ({
      ...g,
      startedAt: g.startedAt ?? now,
    })));
  }

  // ── Largada de um grupo específico ──
  function startGroup(groupId: string) {
    const now = Date.now();
    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, startedAt: g.startedAt ?? now } : g
    ));
  }

  // ── Marcar presença ──
  function togglePresent(groupId: string, memberId: string) {
    setGroups(prev => prev.map(g =>
      g.id !== groupId ? g : {
        ...g,
        members: g.members.map(m =>
          m.id === memberId ? { ...m, present: !m.present } : m
        ),
      }
    ));
  }

  // ── Registrar chegada (tempo líquido) ──
  function registerFinish(groupId: string, memberId: string) {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId || !g.startedAt) return g;
      const secs = elapsed(g.startedAt);
      return {
        ...g,
        members: g.members.map(m =>
          m.id === memberId && !m.finishTime
            ? { ...m, finishTime: secs }
            : m
        ),
      };
    }));
  }

  // ── Atualizar horário agendado ──
  function updateSchedule(groupId: string, value: string) {
    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, scheduledStart: value } : g
    ));
    setEditingSchedule(null);
  }

  const allStarted = groups.every(g => g.startedAt !== null);
  const anyStarted = groups.some(g => g.startedAt !== null);

  // Ranking em tempo real (tempo líquido)
  const allFinished = groups
    .flatMap(g => g.members
      .filter(m => m.finishTime != null)
      .map(m => ({ name: m.name, number: m.number, group: g.name, time: m.finishTime! }))
    )
    .sort((a, b) => a.time - b.time);

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="bg-gray-900 px-6 py-4 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
            <span className="text-gray-600">/</span>
            <p className="font-bold">IMW Run #03 — Painel do Dia</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${anyStarted ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
            <span className="text-sm text-gray-300">{anyStarted ? 'Corrida em andamento' : 'Aguardando largada'}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">

        {/* ── LARGADA GERAL ── */}
        {!anyStarted && (
          <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-3">🚀 Controle de Largada</h2>
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={startAll}
                className="flex min-h-[44px] items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 font-bold text-white shadow transition hover:bg-green-700 active:scale-95"
              >
                🏁 Largada Geral — Todos os Grupos
              </button>
              <span className="text-sm text-gray-400">ou inicie cada grupo individualmente abaixo</span>
            </div>
          </div>
        )}

        {/* ── GRUPOS ── */}
        <div className="grid gap-5 md:grid-cols-2">
          {groups.map(group => {
            const running = group.startedAt !== null;
            const elapsedSecs = running ? elapsed(group.startedAt!) : 0;
            const presentCount = group.members.filter(m => m.present).length;
            const finishedCount = group.members.filter(m => m.finishTime != null).length;

            return (
              <div key={group.id} className={`overflow-hidden rounded-2xl bg-white shadow-sm ${running ? 'ring-2 ring-green-400' : ''}`}>
                {/* Header do grupo */}
                <div className={`px-5 py-4 flex items-center justify-between ${running ? 'bg-green-50' : 'bg-gray-50'} border-b border-gray-100`}>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{group.name}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      {/* Horário agendado — clicável */}
                      {editingSchedule === group.id ? (
                        <input
                          type="time"
                          defaultValue={group.scheduledStart}
                          autoFocus
                          onBlur={e => updateSchedule(group.id, e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && updateSchedule(group.id, (e.target as HTMLInputElement).value)}
                          className="rounded border border-brand-primary px-2 py-0.5 text-sm font-mono focus:outline-none"
                        />
                      ) : (
                        <button
                          onClick={() => !running && setEditingSchedule(group.id)}
                          className={`text-sm font-mono ${running ? 'text-gray-500' : 'text-brand-primary hover:underline'}`}
                          title={running ? '' : 'Clique para editar horário'}
                        >
                          ⏰ {group.scheduledStart}
                          {!running && <span className="ml-1 text-gray-400 text-xs">✎</span>}
                        </button>
                      )}
                      <span className="text-xs text-gray-400">
                        {presentCount}/{group.members.length} presentes
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {running ? (
                      <div>
                        <p className="text-2xl font-extrabold font-mono text-green-600">{formatTime(elapsedSecs)}</p>
                        <p className="text-xs text-gray-400">{finishedCount}/{group.members.length} chegaram</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => startGroup(group.id)}
                        className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-brand-accent px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-green-600 active:scale-95"
                      >
                        🚀 Iniciar
                      </button>
                    )}
                  </div>
                </div>

                {/* Membros */}
                <div className="divide-y divide-gray-50">
                  {group.members.map(member => (
                    <div key={member.id} className={`flex items-center gap-3 px-5 py-3 ${member.finishTime != null ? 'bg-green-50/50' : ''}`}>
                      {/* Presença */}
                      <button
                        onClick={() => !running && togglePresent(group.id, member.id)}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm transition ${
                          member.present
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        } ${running ? 'cursor-default' : 'cursor-pointer'}`}
                        title={running ? '' : 'Marcar presença'}
                      >
                        {member.present ? '✓' : '?'}
                      </button>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{member.name}</p>
                        <p className="text-xs text-gray-400">#{member.number}</p>
                      </div>

                      {/* Chegada */}
                      {running && (
                        member.finishTime != null ? (
                          <div className="text-right">
                            <p className="font-bold font-mono text-green-600">{formatTime(member.finishTime)}</p>
                            <p className="text-xs text-gray-400">chegou</p>
                          </div>
                        ) : member.present ? (
                          <button
                            onClick={() => registerFinish(group.id, member.id)}
                            className="rounded-xl bg-brand-secondary px-3 py-1.5 text-xs font-bold text-white shadow transition hover:bg-amber-500 active:scale-95"
                          >
                            🏁 Chegou
                          </button>
                        ) : (
                          <span className="text-xs text-gray-300">Ausente</span>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── RANKING EM TEMPO REAL ── */}
        {allFinished.length > 0 && (
          <div className="mt-6 rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">🏆 Ranking em tempo real (tempo líquido)</h2>
              <span className="text-xs text-gray-400">{allFinished.length} chegadas registradas</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-2 text-left text-xs font-semibold uppercase text-gray-400">#</th>
                  <th className="px-5 py-2 text-left text-xs font-semibold uppercase text-gray-400">Nome</th>
                  <th className="px-5 py-2 text-left text-xs font-semibold uppercase text-gray-400 hidden sm:table-cell">Grupo</th>
                  <th className="px-5 py-2 text-right text-xs font-semibold uppercase text-gray-400">Tempo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allFinished.map((r, i) => (
                  <tr key={r.number} className={i === 0 ? 'bg-yellow-50' : ''}>
                    <td className="px-5 py-3 font-bold text-gray-400">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-800">{r.name}</td>
                    <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{r.group}</td>
                    <td className="px-5 py-3 text-right font-bold font-mono text-brand-primary">{formatTime(r.time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── AÇÕES FINAIS ── */}
        {allStarted && (
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow transition hover:bg-blue-700">
              📊 Exportar resultados
            </button>
            <button className="flex min-h-[44px] items-center gap-2 rounded-xl bg-white border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
              📋 Publicar ranking
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
