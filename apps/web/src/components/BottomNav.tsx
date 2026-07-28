'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Início', icon: '🏠' },
  { href: '/calendar', label: 'Corridas', icon: '📅' },
  { href: '/ranking', label: 'Ranking', icon: '🏆' },
  { href: '/run/3', label: 'Correr', icon: '🏃' },
  { href: '/profile', label: 'Perfil', icon: '👤' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden"
      aria-label="Navegação principal"
    >
      <ul className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-brand-primary'
                    : 'text-gray-500 hover:text-brand-primary'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
