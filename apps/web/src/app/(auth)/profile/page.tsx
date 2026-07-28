import Link from 'next/link';

import { BottomNav } from '@/components/BottomNav';
import { JourneyTrack } from '@/components/JourneyTrack';

// Mock — será substituído por dados reais da API
const MOCK_PROFILE = {
  name: 'Carlos Eduardo',
  racesCompleted: 2,
  totalKm: 10.4,
  streak: 2,
  achievements: [
    { code: 'FIRST_RUN', name: 'Primeira Corrida', description: 'Completou a primeira corrida da jornada', icon: '🏃', unlockedAt: '15 Fev 2025' },
    { code: 'STREAK_2', name: 'Sequência de 2',   description: 'Completou 2 corridas consecutivas',      icon: '🔥', unlockedAt: '15 Mar 2025' },
  ],
};

export default function ProfilePage() {
  const p = MOCK_PROFILE;
  const progress = Math.round((p.racesCompleted / 12) * 100);

  return (
    <>
      <main className="min-h-screen bg-brand-light pb-20 md:pb-0">
        {/* Header do perfil */}
        <div className="bg-brand-primary px-6 py-10 text-white">
          <div className="mx-auto max w-2xl">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl">
                👤
              </div>
              <div>
                <h1 className="text-2xl font-extrabold">{p.name}</h1>
                <p className="text-blue-200 text-sm">{p.racesCompleted}/12 corridas • {p.totalKm} km</p>
              </div>
            </div>

            {/* Barra de progresso */}
            <div className="mt-5">
              <div className="flex justify-between text-xs text-blue-200 mb-1">
                <span>Progresso da jornada</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-brand-secondary transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Corridas', value: `${p.racesCompleted}/12`, icon: '🏁' },
              { label: 'Km totais', value: `${p.totalKm}`, icon: '📏' },
              { label: 'Sequência', value: `${p.streak}🔥`, icon: '⚡' },
            ].map(stat => (
              <div key={stat.label} className="rounded-2xl bg-white p-4 text-center shadow-sm">
                <div className="text-2xl">{stat.icon}</div>
                <p className="mt-1 text-lg font-bold text-brand-dark">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Jornada */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <JourneyTrack completedCount={p.racesCompleted} isAuthenticated={true} />
          </div>

          {/* Conquistas */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-bold text-brand-dark">🏅 Conquistas</h2>
            {p.achievements.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma conquista ainda. Complete sua primeira corrida!</p>
            ) : (
              <div className="space-y-3">
                {p.achievements.map(a => (
                  <div key={a.code} className="flex items-center gap-3 rounded-xl bg-brand-primary/5 p-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-2xl">
                      {a.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-dark text-sm">{a.name}</p>
                      <p className="text-xs text-gray-500">{a.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Desbloqueada em {a.unlockedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Próxima corrida CTA */}
          <div className="rounded-2xl bg-brand-secondary/10 p-5 text-center">
            <p className="font-semibold text-brand-dark">Próxima corrida disponível!</p>
            <p className="mt-1 text-sm text-gray-600">IMW Run #03 — 12 Abr 2025</p>
            <Link
              href="/race/3"
              className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-secondary px-6 font-semibold text-white transition hover:bg-amber-500"
            >
              Ver detalhes →
            </Link>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
