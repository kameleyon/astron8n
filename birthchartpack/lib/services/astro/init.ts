import path from 'path';
import swisseph from 'swisseph-v2';
import fs from 'fs';

export async function initSwissEphemeris() {
  try {
    // Verify ephemeris directory exists
    const ephePath = path.join(process.cwd(), 'ephe');
    if (!fs.existsSync(ephePath)) {
      throw new Error('Ephemeris directory not found');
    }
    
    // Verify we have at least one valid ephemeris file
    const files = fs.readdirSync(ephePath);
    if (files.length === 0) {
      throw new Error('No ephemeris files found');
    }
    
    console.log(`Using ephemeris files from ${ephePath}`);

    // Set the ephemeris path
    swisseph.swe_set_ephe_path(path.join(process.cwd(), 'ephe'));
    
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
  } catch (err) {
    throw new Error(`Failed to load Swiss Ephemeris modules: ${err.message}`);
  }
}
