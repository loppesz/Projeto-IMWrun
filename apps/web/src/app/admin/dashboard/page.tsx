import Link from 'next/link';

const STATS = [
  { label: 'Participantes', value: '47', icon: '👥', color: 'bg-blue-500' },
  { label: 'Corridas concluídas', value: '89', icon: '✅', color: 'bg-green-500' },
  { label: 'Km registrados', value: '445', icon: '📏', color: 'bg-purple-500' },
  { label: 'Pendentes de revisão', value: '3', icon: '⚠️', color: 'bg-amber-500' },
];

const PENDING = [
  { id: '1', name: 'João Pedro',     race: 'IMW Run #03', time: '32:14', km: '4.8', status: 'pending_review' },
  { id: '2', name: 'Sandra Moura',   race: 'IMW Run #02', time: '28:45', km: '4.6', status: 'pending_review' },
  { id: '3', name: 'Tiago Almeida',  race: 'IMW Run #03', time: '41:02', km: '3.9', status: 'pending_review' },
];

const RECENT_REGISTRATIONS = [
  { number: '0047', name: 'Fernanda Costa',  race: 'IMW Run #03', date: '10 Abr 2025' },
  { number: '0046', name: 'Bruno Martins',   race: 'IMW Run #03', date: '09 Abr 2025' },
  { number: '0045', name: 'Aline Souza',     race: 'IMW Run #03', date: '09 Abr 2025' },
  { number: '0044', name: 'Ricardo Lima',    race: 'IMW Run #03', date: '08 Abr 2025' },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="bg-gray-900 px-6 py-4 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔐</span>
            <div>
              <p className="font-bold">IMW Run Admin</p>
              <p className="text-xs text-gray-400">admin@imwrun.com</p>
            </div>
          </div>
          <nav className="hidden gap-4 text-sm md:flex">
            <Link href="/admin/dashboard" className="text-white font-semibold">Dashboard</Link>
            <Link href="/admin/races" className="text-gray-400 hover:text-white">Corridas</Link>
            <Link href="/admin/registrations/3" className="text-gray-400 hover:text-white">Inscritos</Link>
          </nav>
          <Link href="/" className="rounded-lg bg-gray-700 px-3 py-1.5 text-xs hover:bg-gray-600">
            Sair
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-extrabold text-gray-800">Dashboard</h1>

        {/* Stats grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map(stat => (
            <div key={stat.label} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className={`${stat.color} px-4 py-3`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="px-4 py-3">
                <p className="text-2xl font-extrabold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Pendentes de revisão */}
          <div className="rounded-2xl bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="font-bold text-gray-800">⚠️ Pendentes de revisão</h2>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                {PENDING.length}
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {PENDING.map(r => (
                <div key={r.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.race} • {r.km} km • {r.time}</p>
                  </div>
                  <button className="rounded-lg bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100">
                    Revisar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Inscrições recentes */}
          <div className="rounded-2xl bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="font-bold text-gray-800">📋 Inscrições recentes</h2>
              <Link href="/admin/registrations/3" className="text-xs text-brand-primary hover:underline">
                Ver todos →
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {RECENT_REGISTRATIONS.map(r => (
                <div key={r.number} className="flex items-center gap-3 px-5 py-3">
                  <span className="rounded-lg bg-brand-primary/10 px-2 py-1 text-xs font-bold text-brand-primary">
                    #{r.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.race} • {r.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sync status */}
        <div className="mt-6 rounded-2xl bg-white px-5 py-4 shadow-sm">
          <h2 className="mb-3 font-bold text-gray-800">🔄 Sync Google Sheets</h2>
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-sm text-gray-600">Todas as inscrições sincronizadas com sucesso.</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { href: '/admin/races', label: 'Gerenciar corridas', icon: '🏁' },
            { href: '/admin/registrations/3', label: 'Ver inscritos', icon: '📋' },
            { href: '/ranking', label: 'Ver ranking', icon: '🏆' },
            { href: '/', label: 'Ver site', icon: '🌐' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-[44px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-brand-primary hover:text-brand-primary"
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
