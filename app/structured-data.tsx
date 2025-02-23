export const getStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AstroGenie',
    applicationCategory: 'LifestyleApplication',
    description: 'AI-powered astrology application providing personalized birth chart readings, daily horoscopes, and astrological predictions.',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      category: 'Astrology Services',
      description: 'Professional astrological readings and predictions powered by AI',
    },
    featureList: [
      'Birth Chart Analysis',
      'Daily Horoscopes',
      'Transit Predictions',
      'Zodiac Compatibility',
      'Life Path Guidance',
      'AI-Powered Insights'
    ],
    author: {
      '@type': 'Organization',
      name: 'AstroGenie',
      url: 'https://astrogenie.ai'
    },
    provider: {
      '@type': 'Organization',
      name: 'AstroGenie',
      url: 'https://astrogenie.ai'
    }
  };
};
