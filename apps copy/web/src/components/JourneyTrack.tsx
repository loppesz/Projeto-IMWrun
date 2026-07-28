'use client';

type RaceState = 'completed' | 'unlocked' | 'locked';

interface JourneyRace {
  number: number;
  state: RaceState;
}

interface JourneyTrackProps {
  /** Quantas corridas o participante já concluiu (0 se não autenticado) */
  completedCount: number;
  isAuthenticated: boolean;
}

function RaceIcon({ state, number }: { state: RaceState; number: number }) {
  const base =
    'flex flex-col items-center gap-1 transition-all duration-300';

  if (state === 'completed') {
    return (
      <div className={base}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent text-white shadow-md">
          <span className="text-xl">✅</span>
        </div>
        <span className="text-[10px] font-medium text-brand-accent">#{number}</span>
        <span className="text-[9px] text-brand-accent">Concluída</span>
      </div>
    );
  }

  if (state === 'unlocked') {
    return (
      <div className={base}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-secondary text-white shadow-md ring-2 ring-brand-secondary ring-offset-2">
          <span className="text-xl">🔓</span>
        </div>
        <span className="text-[10px] font-medium text-brand-secondary">#{number}</span>
        <span className="text-[9px] text-brand-secondary">Disponível</span>
      </div>
    );
  }

  return (
    <div className={base}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-400 shadow-sm">
        <span className="text-xl">🔒</span>
      </div>
      <span className="text-[10px] font-medium text-gray-400">#{number}</span>
      <span className="text-[9px] text-gray-400">Bloqueada</span>
    </div>
  );
}

export function JourneyTrack({ completedCount, isAuthenticated }: JourneyTrackProps) {
  const races: JourneyRace[] = Array.from({ length: 12 }, (_, i) => {
    const number = i + 1;
    let state: RaceState = 'locked';

    if (!isAuthenticated) {
      state = 'locked';
    } else if (number <= completedCount) {
      state = 'completed';
    } else if (number === completedCount + 1) {
      state = 'unlocked';
    } else {
      state = 'locked';
    }

    return { number, state };
  });

  return (
    <section className="w-full">
      <h2 className="mb-6 text-center text-xl font-bold text-brand-dark">
        🏅 Sua Jornada
      </h2>
      {!isAuthenticated && (
        <p className="mb-4 text-center text-sm text-gray-500">
          Faça login para ver seu progresso
        </p>
      )}
      {/* Grid de 6x2 no mobile, 12x1 em telas maiores */}
      <div className="grid grid-cols-6 gap-3 md:grid-cols-12">
        {races.map((race) => (
          <RaceIcon key={race.number} state={race.state} number={race.number} />
        ))}
      </div>
      {/* Linha de progresso */}
      {isAuthenticated && (
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{completedCount}/12 corridas</span>
            <span>{Math.round((completedCount / 12) * 100)}%</span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-brand-accent transition-all duration-700"
              style={{ width: `${Math.round((completedCount / 12) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
