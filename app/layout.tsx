import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AstroGenie - Your Personal Astrological AI Guide',
  description: 'Get personalized astrological insights and guidance with AstroGenie, your AI-powered astrological companion.',
  metadataBase: new URL('https://astrogenie.ai'),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico'
  }
};
export const viewport = {
  themeColor: '#4F46E5',
  width: 'device-width',
  initialScale: 1.0
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}