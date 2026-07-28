'use client';

import { useEffect, useState } from 'react';

interface Achievement {
  code: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  isNew?: boolean; // true = mostra animação de desbloqueio
}

export function AchievementBadge({ achievement, isNew = false }: AchievementBadgeProps) {
  const [animating, setAnimating] = useState(isNew);

  useEffect(() => {
    if (!isNew) return;
    const t = setTimeout(() => setAnimating(false), 2500);
    return () => clearTimeout(t);
  }, [isNew]);

  return (
    <div className={`relative flex items-center gap-3 rounded-2xl p-4 transition-all duration-500 ${
      animating
        ? 'bg-brand-secondary/20 ring-2 ring-brand-secondary shadow-lg scale-105'
        : 'bg-brand-primary/5'
    }`}>
      {/* Animação de brilho */}
      {animating && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]" />
        </div>
      )}

      <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-md transition-transform ${
        animating ? 'animate-bounce' : ''
      } ${achievement.unlockedAt ? 'bg-brand-primary/10' : 'bg-gray-100 grayscale opacity-50'}`}>
        {achievement.icon}
        {animating && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-secondary text-xs font-bold text-white shadow">
            ✨
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-bold text-brand-dark text-sm">{achievement.name}</p>
          {animating && (
            <span className="rounded-full bg-brand-secondary px-2 py-0.5 text-xs font-bold text-white">
              Novo!
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{achievement.description}</p>
        {achievement.unlockedAt && (
          <p className="text-xs text-gray-400 mt-1">🗓 {achievement.unlockedAt}</p>
        )}
      </div>
    </div>
  );
}

// Versão locked (bloqueada)
export function LockedBadge({ name, description, icon }: { name: string; description: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 opacity-60">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-200 text-3xl grayscale">
        {icon}
      </div>
      <div>
        <p className="font-bold text-gray-400 text-sm">🔒 {name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
