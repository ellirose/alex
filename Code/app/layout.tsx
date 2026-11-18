import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import { I18nProvider } from '@/lib/i18n';
import { RevealObserver } from '@/components/motion/RevealObserver';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz', 'SOFT'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Alex Lynn Buntrock — Creative Developer',
  description:
    'Creative developer in Santiago de Chile: brand systems, commercial video, React/Next.js websites and growth campaigns.',
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#f7f2e8',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <I18nProvider>
          <RevealObserver />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
