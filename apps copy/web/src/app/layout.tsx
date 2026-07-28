import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import 'leaflet/dist/leaflet.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'IMW Run – Corra. Supere seus limites. Faça parte da missão.',
    template: '%s | IMW Run',
  },
  description:
    'Plataforma oficial das corridas IMW Run. 12 corridas anuais de 5km. Inscreva-se, rastreie seu percurso e acompanhe seu progresso.',
  keywords: ['corrida', 'caminhada', 'IMW', 'chiesa', 'corrida cristã', '5km'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-brand-light text-brand-dark antialiased">{children}</body>
    </html>
  );
}
