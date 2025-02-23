export const REPORT_CONFIG = {
  // Aspect orbs in degrees
  aspectOrbs: {
    conjunction: 8,
    sextile: 4,
    square: 6,
    trine: 6,
    opposition: 8
  },

  // House assignments for life areas
  houseAssignments: {
    love: [5, 7, 8],
    finance: [2, 8], 
    career: [10],
    health: [6, 12]
  },

  // Event type priorities for sorting
  eventPriorities: {
    direct: 1,
    retrograde: 2,
    eclipse: 3,
    fullMoon: 4,
    newMoon: 5,
    aspect: 6,
    transit: 7
  },

  // Zodiac sign order
  signOrder: [
    'Aries',
    'Taurus', 
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn',
    'Aquarius',
    'Pisces'
  ]
};
