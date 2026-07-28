'use client';

import { useState } from 'react';

import Link from 'next/link';

type RaceStatus = 'available' | 'locked' | 'ongoing' | 'finished';

interface Race {
  id: string;
  number: number;
  name: string;
  date: string;
  location: string;
  status: RaceStatus;
  registrations: number;
  hasRoute: boolean;
}

const INITIAL_RACES: Race[] = [
  { id: '1', number: 1,  name: 'IMW Run #01', date: '15 Fev 2025', location: 'Parque da Cidade', status: 'finished',  registrations: 18, hasRoute: true  },
  { id: '2', number: 2,  name: 'IMW Run #02', date: '15 Mar 2025', location: 'Lago Norte',       status: 'finished',  registrations: 22, hasRoute: true  },
  { id: '3', number: 3,  name: 'IMW Run #03', date: '12 Abr 2025', location: 'Asa Sul',          status: 'available', registrations: 7,  hasRoute: false },
  { id: '4', number: 4,  name: 'IMW Run #04', date: '10 Mai 2025', location: 'A definir',        status: 'locked',    registrations: 0,  hasRoute: false },
  { id: '5', number: 5,  name: 'IMW Run #05', date: '14 Jun 2025', location: 'A definir',        status: 'locked',    registrations: 0,  hasRoute: false },
];

const STATUS_LABEL: Record<RaceStatus, { label: string; cls: string }> = {
  available: { label: 'Disponível',   cls: 'bg-green-100 text-green-700' },
  ongoing:   { label: 'Em andamento', cls: 'bg-yellow-100 text-yellow-700' },
  finished:  { label: 'Concluída',    cls: 'bg-blue-100 text-blue-700' },
  locked:    { label: 'Bloqueada',    cls: 'bg-gray-100 text-gray-500' },
};

export default function AdminRacesPage() {
  const [races, setRaces] = useState<Race[]>(INITIAL_RACES);

  function toggleStatus(id: string) {
    setRaces(prev => prev.map(r => {
      if (r.id !== id) return r;
      return { ...r, status: r.status === 'locked' ? 'available' : 'locked' };
    }));
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="bg-gray-900 px-6 py-4 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
            <span className="text-gray-600">/</span>
            <p className="font-bold text-white">Corridas</p>
          </div>
          <Link href="/" className="rounded-lg bg-gray-700 px-3 py-1.5 text-xs hover:bg-gray-600">Sair</Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-gray-800">Gerenciar Corridas</h1>
          <button className="flex min-h-[44px] items-center gap-2 rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700">
            + Nova corrida
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">#</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Corrida</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500 hidden md:table-cell">Data / Local</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {races.map(race => {
                const s = STATUS_LABEL[race.status];
                return (
                  <tr key={race.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-400">{race.number}</td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">{race.name}</p>
                      <p className="text-xs text-gray-500">{race.registrations} inscritos • {race.hasRoute ? '🗺️ Percurso' : '⚠️ Sem percurso'}</p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="text-gray-700">{race.date}</p>
                      <p className="text-xs text-gray-500">{race.location}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle status */}
                        {(race.status === 'locked' || race.status === 'available') && (
                          <button
                            onClick={() => toggleStatus(race.id)}
                            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                          >
                            {race.status === 'locked' ? '🔓 Liberar' : '🔒 Bloquear'}
                          </button>
                        )}
                        <Link
                          href={`/admin/races/${race.id}/edit`}
                          className="rounded-lg bg-brand-primary/10 px-3 py-1.5 text-xs font-medium text-brand-primary hover:bg-brand-primary/20"
                        >
                          Editar
                        </Link>
                        {race.registrations === 0 && (
                          <button className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">
                            Excluir
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
