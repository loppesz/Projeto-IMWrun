'use client';

import { useState } from 'react';

import { BottomNav } from '@/components/BottomNav';

interface RankingEntry {
  position: number;
  name: string;
  racesCompleted: number;
  totalKm: number;
  gender: 'M' | 'F';
  ageGroup: string;
}

const MOCK_RANKING: RankingEntry[] = [
  { position: 1, name: 'Carlos Eduardo',   racesCompleted: 3, totalKm: 15.2, gender: 'M', ageGroup: '30-39' },
  { position: 2, name: 'Ana Lima',         racesCompleted: 3, totalKm: 14.8, gender: 'F', ageGroup: '18-29' },
  { position: 3, name: 'Roberto Silva',    racesCompleted: 2, totalKm: 10.4, gender: 'M', ageGroup: '40-49' },
  { position: 4, name: 'Maria Fernanda',   racesCompleted: 2, totalKm: 10.1, gender: 'F', ageGroup: '30-39' },
  { position: 5, name: 'João Pedro',       racesCompleted: 2, totalKm: 9.9,  gender: 'M', ageGroup: '18-29' },
  { position: 6, name: 'Patrícia Gomes',   racesCompleted: 1, totalKm: 5.1,  gender: 'F', ageGroup: '50-59' },
  { position: 7, name: 'Marcos Antonio',   racesCompleted: 1, totalKm: 5.0,  gender: 'M', ageGroup: '40-49' },
  { position: 8, name: 'Luciana Torres',   racesCompleted: 1, totalKm: 4.9,  gender: 'F', ageGroup: '18-29' },
  { position: 9, name: 'André Nascimento', racesCompleted: 1, totalKm: 4.8,  gender: 'M', ageGroup: '60+' },
  { position: 10, name: 'Sandra Moura',   racesCompleted: 1, totalKm: 4.7,  gender: 'F', ageGroup: '30-39' },
];

type Filter = 'geral' | 'M' | 'F' | '18-29' | '30-39' | '40-49' | '50-59' | '60+';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'geral', label: '🌐 Geral' },
  { key: 'M',     label: '♂ Masculino' },
  { key: 'F',     label: '♀ Feminino' },
  { key: '18-29', label: '18–29' },
  { key: '30-39', label: '30–39' },
  { key: '40-49', label: '40–49' },
  { key: '50-59', label: '50–59' },
  { key: '60+',   label: '60+' },
];

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function RankingPage() {
  const [filter, setFilter] = useState<Filter>('geral');

  const filtered = MOCK_RANKING.filter(entry => {
    if (filter === 'geral') return true;
    if (filter === 'M' || filter === 'F') return entry.gender === filter;
    return entry.ageGroup === filter;
  }).map((entry, i) => ({ ...entry, position: i + 1 }));

  return (
    <>
      <main className="min-h-screen bg-brand-light pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-brand-primary px-6 py-10 text-white">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-secondary">🏆 IMW Run 2025</p>
            <h1 className="mt-1 text-3xl font-extrabold">Ranking</h1>
            <p className="mt-2 text-blue-200 text-sm">{MOCK_RANKING.length} participantes classificados</p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-6">
          {/* Top 3 destaque */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            {MOCK_RANKING.slice(0, 3).map(entry => (
              <div key={entry.position} className={`rounded-2xl p-3 text-center shadow-sm ${
                entry.position === 1 ? 'bg-yellow-50 ring-2 ring-yellow-400' :
                entry.position === 2 ? 'bg-gray-50 ring-2 ring-gray-300' :
                'bg-orange-50 ring-2 ring-orange-300'
              }`}>
                <div className="text-3xl">{MEDAL[entry.position]}</div>
                <p className="mt-1 text-xs font-bold text-brand-dark leading-tight">{entry.name.split(' ')[0]}</p>
                <p className="text-xs text-gray-500">{entry.racesCompleted} corridas</p>
                <p className="text-xs font-semibold text-brand-primary">{entry.totalKm} km</p>
              </div>
            ))}
          </div>

          {/* Filtros */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  filter === f.key
                    ? 'bg-brand-primary text-white shadow'
                    : 'bg-white text-gray-600 shadow-sm hover:bg-gray-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Tabela */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {filtered.length === 0 ? (
              <p className="p-8 text-center text-sm text-gray-500">Nenhum resultado para este filtro.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Nome</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Corridas</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Km</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(entry => (
                    <tr key={entry.name} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-400">
                        {MEDAL[entry.position] ?? entry.position}
                      </td>
                      <td className="px-4 py-3 font-medium text-brand-dark">{entry.name}</td>
                      <td className="px-4 py-3 text-right text-brand-primary font-semibold">{entry.racesCompleted}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{entry.totalKm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            Atualizado em tempo real após cada corrida concluída
          </p>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
