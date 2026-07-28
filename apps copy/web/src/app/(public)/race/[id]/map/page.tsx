import dynamic from 'next/dynamic';
import Link from 'next/link';

import { BottomNav } from '@/components/BottomNav';
import { MOCK_CHECKPOINTS, MOCK_ROUTE } from '@/components/RouteMap';

// Carrega o mapa apenas no cliente (Leaflet não funciona no servidor)
const RouteMap = dynamic(
  () => import('@/components/RouteMap').then(m => m.RouteMap),
  { ssr: false, loading: () => (
    <div className="flex h-80 items-center justify-center rounded-2xl bg-gray-100">
      <p className="text-gray-400">Carregando mapa...</p>
    </div>
  )}
);

export default function RaceMapPage() {
  return (
    <>
      <main className="min-h-screen bg-brand-light pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-brand-primary px-6 py-8 text-white">
          <div className="mx-auto max-w-2xl">
            <Link href="/calendar" className="mb-3 inline-flex items-center gap-1 text-sm text-blue-200 hover:text-white">
              ← Voltar
            </Link>
            <h1 className="text-2xl font-extrabold">Percurso — IMW Run #03</h1>
            <p className="mt-1 text-blue-200 text-sm">Asa Sul, Brasília/DF · 5 km</p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl space-y-5 px-4 py-6">
          {/* Mapa */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-md">
            <div className="p-4 pb-0">
              <RouteMap points={MOCK_ROUTE} checkpoints={MOCK_CHECKPOINTS} height={380} />
            </div>

            {/* Legenda */}
            <div className="flex flex-wrap gap-4 px-5 py-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-green-500" />
                <span className="text-gray-600">Largada</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-red-500" />
                <span className="text-gray-600">Chegada</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">📍</span>
                <span className="text-gray-600">Fiscalização / Hidratação</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-1 w-6 rounded-full bg-brand-primary" />
                <span className="text-gray-600">Percurso oficial</span>
              </div>
            </div>
          </div>

          {/* Pontos de controle */}
          <div className="rounded-2xl bg-white p-5 shadow-md">
            <h2 className="mb-4 font-bold text-brand-dark">📍 Pontos de controle</h2>
            <div className="space-y-3">
              {MOCK_CHECKPOINTS.map((cp, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-secondary/20 text-lg">
                    {cp.label.split(' ')[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{cp.label.slice(2)}</p>
                    <p className="text-xs text-gray-400">{cp.lat.toFixed(4)}, {cp.lng.toFixed(4)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dicas */}
          <div className="rounded-2xl bg-brand-primary/5 p-5">
            <h2 className="mb-3 font-bold text-brand-dark">💡 Dicas do percurso</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2"><span>•</span><span>O percurso é totalmente plano, ideal para todos os níveis.</span></li>
              <li className="flex items-start gap-2"><span>•</span><span>Ponto de hidratação no km 3,5 — traga sua garrafa também.</span></li>
              <li className="flex items-start gap-2"><span>•</span><span>A fiscalização no km 2,5 valida sua passagem — não desvie do percurso.</span></li>
              <li className="flex items-start gap-2"><span>•</span><span>Chegue com 20 min de antecedência para a concentração dos grupos.</span></li>
            </ul>
          </div>

          <Link
            href="/race/3"
            className="flex min-h-[44px] items-center justify-center rounded-2xl bg-brand-primary font-bold text-white shadow transition hover:bg-blue-700"
          >
            ✍️ Inscreva-se nesta corrida
          </Link>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
