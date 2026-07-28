'use client';

import { useState } from 'react';

import Link from 'next/link';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
interface Member {
  number: string;
  name: string;
  status: 'waiting' | 'running' | 'finished' | 'incomplete';
  validKm?: number;
  time?: string;
}

interface Group {
  id: string;
  name: string;
  status: 'waiting' | 'running' | 'finished';
  startedAt: string | null;
  members: Member[];
}

// ---------------------------------------------------------------------------
// Mock
// ---------------------------------------------------------------------------
const INITIAL_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Grupo A',
    status: 'waiting',
    startedAt: null,
    members: [
      { number: '0001', name: 'Carlos Eduardo', status: 'waiting' },
      { number: '0002', name: 'Ana Lima',        status: 'waiting' },
      { number: '0003', name: 'João Pedro',      status: 'waiting' },
      { number: '0042', name: 'Fernanda Costa',  status: 'waiting' },
    ],
  },
  {
    id: 'g2',
    name: 'Grupo B',
    status: 'waiting',
    startedAt: null,
    members: [
      { number: '0004', name: 'Roberto Silva',  status: 'waiting' },
      { number: '0005', name: 'Maria Fernanda', status: 'waiting' },
      { number: '0006', name: 'Patrícia Gomes', status: 'waiting' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const MEMBER_STATUS_ICON: Record<Member['status'], string> = {
  waiting:    '⏳',
  running:    '🏃',
  finished:   '✅',
  incomplete: '⚠️',
};

const GROUP_STATUS_BADGE: Record<Group['status'], string> = {
  waiting:  'bg-yellow-100 text-yellow-700',
  running:  'bg-green-100 text-green-700',
  finished: 'bg-blue-100 text-blue-700',
};

const GROUP_STATUS_LABEL: Record<Group['status'], string> = {
  waiting:  'Aguardando',
  running:  'Correndo',
  finished: 'Concluído',
};

function now() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);

  function startGroup(id: string) {
    setGroups(prev => prev.map(g => {
      if (g.id !== id) return g;
      // Simula participantes começando a correr
      const members: Member[] = g.members.map(m => ({ ...m, status: 'running' as const }));
      return { ...g, status: 'running', startedAt: now(), members };
    }));

    // Simula conclusão após 8s (demo)
    setTimeout(() => {
      setGroups(prev => prev.map(g => {
        if (g.id !== id || g.status !== 'running') return g;
        const members: Member[] = g.members.map((m, i) => ({
          ...m,
          status: i < g.members.length - 1 ? 'finished' : 'incomplete',
          validKm: i < g.members.length - 1 ? 5.0 : 4.3,
          time: i === 0 ? '32:14' : i === 1 ? '35:02' : i === 2 ? '38:44' : '28:31',
        }));
        return { ...g, status: 'finished', members };
      }));
    }, 8000);
  }

  const allDone = groups.every(g => g.status === 'finished');

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="bg-gray-900 px-6 py-4 text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/races" className="text-gray-400 hover:text-white text-sm">← Corridas</Link>
            <span className="text-gray-600">/</span>
            <p className="font-bold">Grupos — IMW Run #03</p>
          </div>
          <Link href="/" className="rounded-lg bg-gray-700 px-3 py-1.5 text-xs hover:bg-gray-600">Sair</Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">Grupos — IMW Run #03</h1>
            <p className="text-sm text-gray-500">
              {groups.length} grupos • {groups.reduce((a, g) => a + g.members.length, 0)} participantes
            </p>
          </div>
          {allDone && (
            <div className="flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              ✅ Todos os grupos concluíram
            </div>
          )}
        </div>

        {/* Cards de grupos */}
        <div className="space-y-5">
          {groups.map(group => (
            <div key={group.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {/* Cabeçalho do grupo */}
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <h2 className="font-bold text-gray-800 text-lg">{group.name}</h2>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${GROUP_STATUS_BADGE[group.status]}`}>
                    {GROUP_STATUS_LABEL[group.status]}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {group.startedAt && (
                    <span className="text-xs text-gray-400">Iniciado às {group.startedAt}</span>
                  )}
                  {group.status === 'waiting' && (
                    <button
                      onClick={() => startGroup(group.id)}
                      className="flex min-h-[40px] items-center gap-2 rounded-xl bg-brand-accent px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-green-600 active:scale-95"
                    >
                      🚀 Iniciar grupo
                    </button>
                  )}
                  {group.status === 'running' && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      Em andamento...
                    </div>
                  )}
                  {group.status === 'finished' && (
                    <button className="flex min-h-[40px] items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">
                      📊 Exportar resultado
                    </button>
                  )}
                </div>
              </div>

              {/* Membros */}
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-2 text-left text-xs font-semibold uppercase text-gray-400">Participante</th>
                    <th className="px-5 py-2 text-left text-xs font-semibold uppercase text-gray-400 hidden sm:table-cell">Status</th>
                    <th className="px-5 py-2 text-right text-xs font-semibold uppercase text-gray-400">Km</th>
                    <th className="px-5 py-2 text-right text-xs font-semibold uppercase text-gray-400">Tempo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {group.members.map(m => (
                    <tr key={m.number} className={`transition-colors ${m.status === 'finished' ? 'bg-green-50/40' : m.status === 'incomplete' ? 'bg-amber-50/40' : ''}`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{MEMBER_STATUS_ICON[m.status]}</span>
                          <div>
                            <p className="font-medium text-gray-800">{m.name}</p>
                            <p className="text-xs text-gray-400">#{m.number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span className={`text-xs font-medium ${
                          m.status === 'finished'   ? 'text-green-600' :
                          m.status === 'running'    ? 'text-blue-600' :
                          m.status === 'incomplete' ? 'text-amber-600' :
                          'text-gray-400'
                        }`}>
                          {m.status === 'waiting' ? 'Aguardando' : m.status === 'running' ? 'Correndo' : m.status === 'finished' ? 'Concluído' : 'Incompleto'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-gray-700">
                        {m.validKm != null ? `${m.validKm} km` : '—'}
                      </td>
                      <td className="px-5 py-3 text-right text-gray-600">
                        {m.time ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Resumo quando concluído */}
              {group.status === 'finished' && (
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>✅ {group.members.filter(m => m.status === 'finished').length} completaram</span>
                    <span>⚠️ {group.members.filter(m => m.status === 'incomplete').length} incompletos</span>
                    <span>⏱️ Melhor tempo: {group.members.filter(m => m.time).map(m => m.time).sort()[0]}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botão criar novo grupo */}
        <button className="mt-6 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 bg-white py-3 text-sm font-semibold text-gray-500 transition hover:border-brand-primary hover:text-brand-primary">
          + Criar novo grupo
        </button>
      </div>
    </main>
  );
}
