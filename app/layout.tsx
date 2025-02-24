import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { getStructuredData } from './structured-data';

const inter = Inter({ subsets: ['latin'] });
const structuredData = getStructuredData();

export const metadata: Metadata = {
  metadataBase: new URL('https://astrogenie.ai'),
  title: {
    default: 'AstroGenie - Your Personal AI Astrology Guide | Birth Charts & Daily Horoscopes',
    template: '%s | AstroGenie'
  },
  description: 'Get accurate and personalized birth chart readings, daily horoscopes, predictions and astrological insights powered by AstroGenie. Discover your zodiac compatibility, transit forecasts, and life path guidance with AstroGenie.',
  keywords: [
    'astrology', 'horoscope', 'birth chart', 'natal chart', 'zodiac', 'astrological forecast',
    'transit report', 'AI astrology', 'personalized horoscope', 'daily horoscope',
    'zodiac compatibility', 'astrological guidance', 'life path', 'astrological AI',
    'birth chart calculator', 'astrology software', 'planetary transits', 'astrology predictions',
    'accurate horoscope', 'professional astrology', 'vedic astrology', 'western astrology',
    'sun sign', 'moon sign', 'rising sign', 'house placements', 'planetary aspects',
    'retrograde planets', 'astrological houses', 'zodiac signs', 'natal astrology',
    'transit predictions', 'astrological consultations', 'online astrology'
  ],
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/manifesto.png',
    other: {
      rel: 'manifest-icon',
      url: '/manifesto.png'
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://astrogenie.ai',
    title: 'AstroGenie - AI-Powered Astrology Readings & Birth Charts',
    description: 'Experience the future of astrology with AI-powered birth chart readings, accurate daily predictions, and personalized transit forecasts. Unlock deep insights about your life path, relationships, and destiny with AstroGenie\'s advanced astrological guidance.',
    siteName: 'AstroGenie',
    images: [{
      url: '/manifesto.png',
      width: 512,
      height: 512,
      alt: 'AstroGenie Logo'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AstroGenie - AI Astrology Guide',
    description: 'AI-powered birth charts, horoscopes, and astrological insights personalized for you.',
    images: ['/manifesto.png'],
    creator: '@astrogenie'
  },
  alternates: {
    canonical: 'https://astrogenie.ai'
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google verification code
  }
};
export const viewport = {
  themeColor: '#FE8E0C',
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
