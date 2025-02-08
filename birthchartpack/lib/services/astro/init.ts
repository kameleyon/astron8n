import path from 'path';
import swisseph from 'swisseph-v2';

export async function initSwissEphemeris() {
  try {
    // Use Moshier algorithm instead of ephemeris files
    // Pass empty string to use built-in algorithms
    swisseph.swe_set_ephe_path('');
    
    // Verify we can calculate a basic date
    const date = new Date();
    const julianDay = swisseph.swe_julday(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      1 // Gregorian calendar flag
    );
    
    if (!julianDay) {
      throw new Error('Failed to initialize Swiss Ephemeris');
    }

    console.log('Swiss Ephemeris initialized using Moshier algorithm');
    
  } catch (err) {
    const typedErr = err as Error;
    throw new Error(`Failed to load Swiss Ephemeris modules: ${typedErr.message}`);
  }
}
