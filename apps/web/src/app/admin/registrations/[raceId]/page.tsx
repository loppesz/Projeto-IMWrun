import Link from 'next/link';

const MOCK_REGISTRATIONS = [
  { number: '0001', name: 'Carlos Eduardo',  phone: '61 99999-1111', age: 34, date: '10 Jan 2025' },
  { number: '0002', name: 'Ana Lima',        phone: '61 99999-2222', age: 27, date: '11 Jan 2025' },
  { number: '0003', name: 'Roberto Silva',   phone: '61 99999-3333', age: 45, date: '12 Jan 2025' },
  { number: '0004', name: 'Maria Fernanda',  phone: '61 99999-4444', age: 31, date: '13 Jan 2025' },
  { number: '0005', name: 'João Pedro',      phone: '61 99999-5555', age: 22, date: '14 Jan 2025' },
  { number: '0006', name: 'Patrícia Gomes',  phone: '61 99999-6666', age: 53, date: '15 Jan 2025' },
  { number: '0007', name: 'Marcos Antonio',  phone: '61 99999-7777', age: 41, date: '16 Jan 2025' },
];

export default function AdminRegistrationsPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="bg-gray-900 px-6 py-4 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
            <span className="text-gray-600">/</span>
            <p className="font-bold text-white">Inscritos — IMW Run #03</p>
          </div>
          <Link href="/" className="rounded-lg bg-gray-700 px-3 py-1.5 text-xs hover:bg-gray-600">Sair</Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">Inscritos — IMW Run #03</h1>
            <p className="text-sm text-gray-500">{MOCK_REGISTRATIONS.length} participantes</p>
          </div>
          <button className="flex min-h-[44px] items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-green-700">
            ⬇️ Exportar CSV
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Nº</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Nome</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500 hidden md:table-cell">Telefone</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500 hidden sm:table-cell">Idade</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500 hidden md:table-cell">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_REGISTRATIONS.map(r => (
                <tr key={r.number} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <span className="rounded-lg bg-brand-primary/10 px-2 py-1 text-xs font-bold text-brand-primary">
                      #{r.number}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-800">{r.name}</td>
                  <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{r.phone}</td>
                  <td className="px-5 py-3 text-gray-600 hidden sm:table-cell">{r.age} anos</td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
