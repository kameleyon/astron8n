import path from 'path';
import swisseph from 'swisseph-v2';
import fs from 'fs';

const REQUIRED_FILES = [
  'seas_18.se1',  // Main ephemeris file
  'semo_18.se1',  // Moon
  'sepl_18.se1',  // Planets
  'seleapsec.txt' // Leap seconds
];

export async function initSwissEphemeris() {
  try {
    // Verify ephemeris directory exists
    const ephePath = path.join(process.cwd(), 'birthchartpack', 'ephe');
    if (!fs.existsSync(ephePath)) {
      throw new Error(`Ephemeris directory not found at ${ephePath}`);
    }
    
    // Get list of available files
    const files = fs.readdirSync(ephePath);
    if (files.length === 0) {
      throw new Error('No ephemeris files found');
    }

    // Check for required files
    const missingFiles = REQUIRED_FILES.filter(file => !files.includes(file));
    if (missingFiles.length > 0) {
      console.warn('Missing some ephemeris files:', missingFiles);
      // Continue anyway - Swiss Ephemeris has some built-in calculations
    }
    
    console.log(`Using ephemeris files from ${ephePath}`);
    console.log('Available files:', files);

    // Set the ephemeris path
    swisseph.swe_set_ephe_path(ephePath);
    
    // Verify we can calculate a basic date
    const testDate = new Date();
    const julianDay = swisseph.swe_julday(
      testDate.getFullYear(),
      testDate.getMonth() + 1,
      testDate.getDate(),
      testDate.getHours() + (testDate.getMinutes() / 60),
      swisseph.SE_GREG_CAL
    );
    
    if (isNaN(julianDay)) {
      throw new Error('Failed to calculate Julian Day - Swiss Ephemeris initialization failed');
    }

    // Test a basic planet calculation
    const flags = swisseph.SEFLG_SPEED;
    const result = swisseph.swe_calc_ut(julianDay, swisseph.SE_SUN, flags);
    
    if (!result || !Array.isArray(result)) {
      throw new Error('Failed to calculate planetary position - Swiss Ephemeris initialization failed');
    }

    console.log('Swiss Ephemeris initialized successfully');
    return true;

  } catch (err) {
    const typedErr = err as Error;
    console.error('Swiss Ephemeris initialization error:', typedErr);
    throw new Error(`Failed to initialize Swiss Ephemeris: ${typedErr.message}`);
  }
}
