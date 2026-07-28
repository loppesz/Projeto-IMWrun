import { BottomNav } from '@/components/BottomNav';

type RaceStatus = 'available' | 'locked' | 'ongoing' | 'finished';

interface Race {
  id: string;
  number: number;
  name: string;
  date: string;
  time: string;
  location: string;
  distance: string;
  status: RaceStatus;
}

const MOCK_RACES: Race[] = [
  { id: '1',  number: 1,  name: 'IMW Run #01', date: '15 Fev 2025', time: '07:00', location: 'Parque da Cidade', distance: '5 km', status: 'finished' },
  { id: '2',  number: 2,  name: 'IMW Run #02', date: '15 Mar 2025', time: '07:00', location: 'Lago Norte',       distance: '5 km', status: 'finished' },
  { id: '3',  number: 3,  name: 'IMW Run #03', date: '12 Abr 2025', time: '07:00', location: 'Asa Sul',          distance: '5 km', status: 'available' },
  { id: '4',  number: 4,  name: 'IMW Run #04', date: '10 Mai 2025', time: '07:00', location: 'A definir',        distance: '5 km', status: 'locked' },
  { id: '5',  number: 5,  name: 'IMW Run #05', date: '14 Jun 2025', time: '07:00', location: 'A definir',        distance: '5 km', status: 'locked' },
  { id: '6',  number: 6,  name: 'IMW Run #06', date: '12 Jul 2025', time: '07:00', location: 'A definir',        distance: '5 km', status: 'locked' },
  { id: '7',  number: 7,  name: 'IMW Run #07', date: '09 Ago 2025', time: '07:00', location: 'A definir',        distance: '5 km', status: 'locked' },
  { id: '8',  number: 8,  name: 'IMW Run #08', date: '13 Set 2025', time: '07:00', location: 'A definir',        distance: '5 km', status: 'locked' },
  { id: '9',  number: 9,  name: 'IMW Run #09', date: '11 Out 2025', time: '07:00', location: 'A definir',        distance: '5 km', status: 'locked' },
  { id: '10', number: 10, name: 'IMW Run #10', date: '08 Nov 2025', time: '07:00', location: 'A definir',        distance: '5 km', status: 'locked' },
  { id: '11', number: 11, name: 'IMW Run #11', date: '06 Dez 2025', time: '07:00', location: 'A definir',        distance: '5 km', status: 'locked' },
  { id: '12', number: 12, name: 'IMW Run #12', date: '20 Dez 2025', time: '08:00', location: 'A definir',        distance: '5 km', status: 'locked' },
];

const STATUS_CONFIG: Record<RaceStatus, { label: string; bg: string; text: string; dot: string }> = {
  available: { label: 'Disponível',   bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500' },
  ongoing:   { label: 'Em andamento', bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  finished:  { label: 'Concluída',    bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  locked:    { label: 'Bloqueada',    bg: 'bg-gray-100',   text: 'text-gray-500',   dot: 'bg-gray-400' },
};

function StatusBadge({ status }: { status: RaceStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function CalendarPage() {
  return (
    <>
      <main className="min-h-screen bg-brand-light pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-brand-primary px-6 py-10 text-white">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-secondary">📅 Temporada 2025</p>
            <h1 className="mt-1 text-3xl font-extrabold">Calendário IMW Run</h1>
            <p className="mt-2 text-blue-200 text-sm">12 corridas • 5 km cada • Janeiro a Dezembro</p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-6">
          {/* Resumo */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            {[
              { label: 'Concluídas', value: MOCK_RACES.filter(r => r.status === 'finished').length, color: 'text-blue-600' },
              { label: 'Disponíveis', value: MOCK_RACES.filter(r => r.status === 'available').length, color: 'text-green-600' },
              { label: 'Bloqueadas', value: MOCK_RACES.filter(r => r.status === 'locked').length, color: 'text-gray-500' },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl bg-white p-3 text-center shadow-sm">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Lista de corridas */}
          <div className="space-y-3">
            {MOCK_RACES.map(race => (
              <div
                key={race.id}
                className={`overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md ${race.status === 'locked' ? 'opacity-70' : ''}`}
              >
                <div className="flex items-start gap-4 p-4">
                  {/* Número */}
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold shadow-sm ${
                    race.status === 'finished' ? 'bg-brand-primary text-white' :
                    race.status === 'available' ? 'bg-brand-secondary text-white' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {race.status === 'finished' ? '✅' : race.status === 'available' ? '🔓' : `${race.number}`}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-bold text-brand-dark">{race.name}</h2>
                      <StatusBadge status={race.status} />
                    </div>
                    <div className="mt-1.5 space-y-0.5 text-sm text-gray-500">
                      <p>📅 {race.date} às {race.time}</p>
                      <p>📍 {race.location}</p>
                      <p>📏 {race.distance}</p>
                    </div>
                  </div>
                </div>

                {/* Ação */}
                {race.status === 'available' && (
                  <div className="border-t border-gray-100 px-4 py-3">
                    <a
                      href={`/race/${race.id}`}
                      className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Inscreva-se nesta corrida →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
