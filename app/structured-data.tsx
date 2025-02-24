export const getStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AstroGenie',
    applicationCategory: 'LifestyleApplication',
    description: 'A women-owned venture revolutionizing astrology with AI technology, providing accurate predictions and culturally-informed guidance. Empowering diverse communities with fast, accessible astrological insights.',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      category: 'Astrology Services',
      description: 'Professional astrological readings with lightning-fast predictions powered by AI, supporting diverse communities and traditions',
    },
    featureList: [
      'Inclusive Birth Chart Analysis',
      'Lightning-Fast AI Predictions',
      'Multi-Cultural Astrological Traditions',
      'Instant Transit Calculations',
      'Personalized Life Path Guidance',
      'Culturally-Informed Insights',
      'Support for Diverse Communities',
      'Women & Black-Owned Business Focus'
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
