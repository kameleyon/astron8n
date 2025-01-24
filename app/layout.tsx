import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AstroGenie - Your Personal Astrological AI Guide',
  description: 'Get personalized astrological insights and guidance with AstroGenie, your AI-powered astrological companion.',
  metadataBase: new URL('https://astrogenie.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}