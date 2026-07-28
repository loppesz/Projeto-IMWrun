'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/admin/dashboard',     label: 'Dashboard',  icon: '📊' },
  { href: '/admin/races',         label: 'Corridas',   icon: '🏁' },
  { href: '/admin/registrations', label: 'Inscritos',  icon: '👥' },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <aside className="flex w-full flex-row gap-1 border-b border-gray-200 bg-white px-4 py-2 md:h-screen md:w-56 md:flex-col md:border-b-0 md:border-r md:px-3 md:py-6">
      <div className="mb-2 hidden px-2 md:block">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">IMW Admin</p>
      </div>
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
            pathname.startsWith(item.href)
              ? 'bg-brand-primary text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
      <div className="mt-auto hidden md:block">
        <Link href="/" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-400 hover:text-gray-700">
          ← Voltar ao site
        </Link>
      </div>
    </aside>
  );
}
