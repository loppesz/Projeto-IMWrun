import { AdminNav } from '@/components/AdminNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      <AdminNav />
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
