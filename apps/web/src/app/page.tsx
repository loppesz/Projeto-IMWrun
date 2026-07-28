import Link from 'next/link';

import { BottomNav } from '@/components/BottomNav';
import { JourneyTrack } from '@/components/JourneyTrack';

// Dados mockados — serão substituídos pela API nas tarefas seguintes
const MOCK_NEXT_RACE = {
  id: '1',
  name: 'IMW Run #01',
  date: '15 de Fevereiro de 2025',
  time: '07:00',
  location: 'Parque da Cidade, Brasília/DF',
  distance: '5 km',
  hasRoute: true,
  available: true,
};

export default function HomePage() {
  const race = MOCK_NEXT_RACE;

  return (
    <>
      <main className="min-h-screen bg-brand-light pb-20 md:pb-0">
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-primary px-6 py-16 text-white md:py-24">
          {/* Decoração de fundo */}
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-secondary" />
            <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-brand-accent" />
          </div>

          <div className="relative mx-auto max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-secondary">
              🏃 IMW Run 2025
            </p>
            <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
              Corra. Supere seus limites.
              <br />
              <span className="text-brand-secondary">Faça parte da missão.</span>
            </h1>
            <p className="mt-4 text-base text-blue-200 md:text-lg">
              12 corridas de 5 km. Uma jornada de fé, saúde e comunidade.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
          {/* Próxima corrida */}
          {race.available ? (
            <section className="mb-8 overflow-hidden rounded-2xl bg-white shadow-md">
              <div className="border-b border-gray-100 bg-brand-secondary/10 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-secondary">
                  Próxima corrida
                </p>
              </div>
              <div className="px-5 py-4">
                <h2 className="text-xl font-bold text-brand-dark">{race.name}</h2>
                <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{race.date}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🕐</span>
                    <span>{race.time}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{race.location}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>📏</span>
                    <span>{race.distance}</span>
                  </li>
                </ul>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/race/${race.id}`}
                    className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 active:scale-95"
                  >
                    ✍️ Inscreva-se
                  </Link>
                  {race.hasRoute && (
                    <Link
                      href={`/race/${race.id}/map`}
                      className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border-2 border-brand-primary px-4 py-2.5 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary hover:text-white active:scale-95"
                    >
                      🗺️ Ver percurso
                    </Link>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <section className="mb-8 rounded-2xl border border-gray-200 bg-white px-5 py-6 text-center shadow-sm">
              <span className="text-4xl">😴</span>
              <p className="mt-3 text-gray-500">
                Nenhuma corrida disponível no momento. Fique de olho!
              </p>
            </section>
          )}

          {/* Jornada das 12 corridas */}
          <section className="rounded-2xl bg-white p-5 shadow-md">
            <JourneyTrack
              completedCount={0}
              isAuthenticated={false}
            />
          </section>

          {/* CTA Login */}
          <div className="mt-6 rounded-xl bg-brand-primary/5 px-5 py-4 text-center">
            <p className="text-sm text-gray-600">
              Já se inscreveu?{' '}
              <Link href="/login" className="font-semibold text-brand-primary hover:underline">
                Faça login com seu telefone
              </Link>{' '}
              para ver seu progresso.
            </p>
          </div>
        </div>
      </main>

      {/* Barra de navegação inferior (mobile) */}
      <BottomNav />
    </>
  );
}
