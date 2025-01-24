const swisseph = require('swisseph');
const path = require('path');

// Set path to ephemeris files
swisseph.swe_set_ephe_path(path.join(__dirname, 'ephe'));

// Get current Julian Day Number
const now = new Date();
const jd = now.getTime() / 1000 / 86400 + 2440587.5;

// Calculate Sun's position
swisseph.swe_calc_ut(jd, swisseph.SE_SUN, 0, (result) => {
    console.log('Swiss Ephemeris Test Results:');
    console.log('Date:', now.toISOString());
    console.log('Sun Position:', result);
    console.log('Longitude:', result.longitude);
    console.log('Latitude:', result.latitude);
    console.log('Distance:', result.distance);
});
