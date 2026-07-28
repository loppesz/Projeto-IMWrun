import Image from 'next/image';
import Link from 'next/link';

import { BottomNav } from '@/components/BottomNav';
import { JourneyTrack } from '@/components/JourneyTrack';

const MOCK_NEXT_RACE = {
  id: '3',
  name: 'IMW Run #03',
  date: '12 de Abril de 2025',
  time: '07:00',
  location: 'Asa Sul, Brasília/DF',
  distance: '5 km',
  hasRoute: true,
  available: true,
};

// Fotos da última corrida (mock — serão URLs reais)
const LAST_RACE_PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400&q=80', alt: 'Largada IMW Run #02' },
  { src: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80', alt: 'Participantes correndo' },
  { src: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&q=80', alt: 'Chegada na linha de meta' },
  { src: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&q=80', alt: 'Celebração pós-corrida' },
];

export default function HomePage() {
  const race = MOCK_NEXT_RACE;

  return (
    <>
      <main className="min-h-screen bg-brand-light pb-20 md:pb-0">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-brand-primary px-6 py-16 text-white md:py-24">
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-secondary" />
            <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-brand-accent" />
            <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" />
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
              12 corridas de 5 km — uma jornada de fé, saúde e comunidade.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-blue-200">
              <span>🏅 Conquistas</span>
              <span>•</span>
              <span>🏆 Ranking</span>
              <span>•</span>
              <span>👥 Grupos</span>
              <span>•</span>
              <span>📍 Percurso oficial</span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 md:px-6">

          {/* ── PRÓXIMA CORRIDA ── */}
          {race.available ? (
            <section className="overflow-hidden rounded-2xl bg-white shadow-md">
              <div className="flex items-center gap-2 border-b border-gray-100 bg-brand-secondary/10 px-5 py-3">
                <span className="h-2 w-2 rounded-full bg-brand-secondary animate-pulse" />
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-secondary">
                  Próxima corrida — inscrições abertas
                </p>
              </div>
              <div className="px-5 py-5">
                <h2 className="text-xl font-bold text-brand-dark">{race.name}</h2>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { icon: '📅', label: race.date },
                    { icon: '🕐', label: `às ${race.time}` },
                    { icon: '📍', label: race.location },
                    { icon: '📏', label: race.distance },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
                      <span>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={`/race/${race.id}`}
                    className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white shadow transition hover:bg-blue-700 active:scale-95"
                  >
                    ✍️ Inscreva-se agora
                  </Link>
                  {race.hasRoute && (
                    <Link
                      href={`/race/${race.id}/map`}
                      className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border-2 border-brand-primary px-4 py-2.5 text-sm font-bold text-brand-primary transition hover:bg-brand-primary hover:text-white active:scale-95"
                    >
                      🗺️ Ver percurso
                    </Link>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-gray-200 bg-white px-5 py-8 text-center shadow-sm">
              <span className="text-4xl">⏳</span>
              <p className="mt-3 text-gray-500">Nenhuma corrida disponível no momento.</p>
              <p className="mt-1 text-sm text-gray-400">Fique de olho — em breve novas datas!</p>
            </section>
          )}

          {/* ── JORNADA ── */}
          <section className="rounded-2xl bg-white p-5 shadow-md">
            <JourneyTrack completedCount={0} isAuthenticated={false} />
            <div className="mt-4 border-t border-gray-100 pt-4 text-center">
              <Link href="/login" className="text-sm font-semibold text-brand-primary hover:underline">
                Faça login para ver seu progresso →
              </Link>
            </div>
          </section>

          {/* ── FOTOS DA ÚLTIMA CORRIDA ── */}
          <section className="rounded-2xl bg-white p-5 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-brand-dark">📸 Última corrida — IMW Run #02</h2>
              <span className="text-xs text-gray-400">15 Mar 2025</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LAST_RACE_PHOTOS.map((photo, i) => (
                <div key={i} className={`relative overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 h-48' : 'h-32'}`}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-gray-400">
              22 participantes • Lago Norte, Brasília/DF
            </p>
          </section>

          {/* ── DOAÇÃO DE ALIMENTOS ── */}
          <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 shadow-md">
            <div className="px-5 py-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-secondary text-2xl shadow">
                  🥫
                </div>
                <div>
                  <h2 className="font-bold text-brand-dark">Doe um alimento</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    No dia da corrida, traga 1 kg de alimento não perecível. Toda a arrecadação é doada para famílias em situação de vulnerabilidade atendidas pela nossa igreja.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                {[
                  { icon: '🍚', label: 'Arroz' },
                  { icon: '🫘', label: 'Feijão' },
                  { icon: '🛢️', label: 'Óleo' },
                ].map(item => (
                  <div key={item.label} className="rounded-xl bg-white/70 py-2">
                    <p className="text-xl">{item.icon}</p>
                    <p className="text-xs text-gray-500">{item.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-gray-500">
                📍 Entrega no ponto de concentração antes da largada
              </p>
            </div>
          </section>

          {/* ── STATS RÁPIDAS ── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: '47', label: 'Participantes', icon: '👥' },
              { value: '2',  label: 'Corridas feitas', icon: '✅' },
              { value: '10', label: 'Grupos ativos', icon: '👟' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl bg-white p-3 text-center shadow-sm">
                <div className="text-2xl">{s.icon}</div>
                <p className="text-xl font-extrabold text-brand-primary">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

        </div>
      </main>
      <BottomNav />
    </>
  );
}
