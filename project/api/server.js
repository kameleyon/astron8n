const express = require('express');
const swisseph = require('swisseph');
const path = require('path');

const app = express();
app.use(express.json());

// Set ephemeris path
const ephePath = path.join(__dirname, 'ephemeris');
swisseph.swe_set_ephe_path(ephePath);

// Helper function to convert date to Julian Day
function dateToJulianDay(date, time = '12:00') {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  return swisseph.swe_julday(year, month, day, hour + minute/60, swisseph.SE_GREG_CAL);
}

// Endpoint to calculate planetary data
app.post('/api/calculate', (req, res) => {
  const { jd, planet, flags } = req.body;
  swisseph.swe_calc_ut(jd, planet, flags, (result) => {
      if (result.rc < 0) return res.status(400).send(result);
      res.send(result);
  });
});

// Calculate planetary positions
app.post('/api/planets', (req, res) => {
  try {
    const { date, time } = req.body;
    if (!date) {
      return res.status(400).json({ error: 'Date is required (YYYY-MM-DD format)' });
    }

    const julianDay = dateToJulianDay(date, time);
    const planets = {};
    const flags = swisseph.SEFLG_SPEED | swisseph.SEFLG_SWIEPH;

    // Calculate positions for major planets
    const planetList = [
      { id: swisseph.SE_SUN, name: 'Sun' },
      { id: swisseph.SE_MOON, name: 'Moon' },
      { id: swisseph.SE_MERCURY, name: 'Mercury' },
      { id: swisseph.SE_VENUS, name: 'Venus' },
      { id: swisseph.SE_MARS, name: 'Mars' },
      { id: swisseph.SE_JUPITER, name: 'Jupiter' },
      { id: swisseph.SE_SATURN, name: 'Saturn' },
      { id: swisseph.SE_URANUS, name: 'Uranus' },
      { id: swisseph.SE_NEPTUNE, name: 'Neptune' },
      { id: swisseph.SE_PLUTO, name: 'Pluto' }
    ];

    planetList.forEach(planet => {
      const result = swisseph.swe_calc_ut(julianDay, planet.id, flags);
      if (result.error) {
        throw new Error(`Error calculating ${planet.name} position: ${result.error}`);
      }

      planets[planet.name] = {
        longitude: result.longitude,
        latitude: result.latitude,
        distance: result.distance,
        longitudeSpeed: result.longitudeSpeed,
        latitudeSpeed: result.latitudeSpeed,
        distanceSpeed: result.distanceSpeed
      };
    });

    // Calculate houses
    const geopos = [0, 0]; // Default to Greenwich
    const houses = swisseph.swe_houses(julianDay, geopos[0], geopos[1], 'P');

    res.json({
      date,
      time: time || '12:00',
      julianDay,
      planets,
      houses: {
        cusps: houses.cusps,
        ascendant: houses.ascendant,
        mc: houses.mc
      }
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Calculate aspects between planets
app.post('/api/aspects', (req, res) => {
  try {
    const { date, time, orb = 8 } = req.body;
    if (!date) {
      return res.status(400).json({ error: 'Date is required (YYYY-MM-DD format)' });
    }

    const julianDay = dateToJulianDay(date, time);
    const flags = swisseph.SEFLG_SPEED | swisseph.SEFLG_SWIEPH;
    const aspects = [];

    // Define major aspects
    const aspectTypes = {
      Conjunction: 0,
      Sextile: 60,
      Square: 90,
      Trine: 120,
      Opposition: 180
    };

    // Calculate aspects between planets
    const planets = [
      { id: swisseph.SE_SUN, name: 'Sun' },
      { id: swisseph.SE_MOON, name: 'Moon' },
      { id: swisseph.SE_MERCURY, name: 'Mercury' },
      { id: swisseph.SE_VENUS, name: 'Venus' },
      { id: swisseph.SE_MARS, name: 'Mars' },
      { id: swisseph.SE_JUPITER, name: 'Jupiter' },
      { id: swisseph.SE_SATURN, name: 'Saturn' }
    ];

    for (let i = 0; i < planets.length; i++) {
      const planet1 = planets[i];
      const pos1 = swisseph.swe_calc_ut(julianDay, planet1.id, flags);

      for (let j = i + 1; j < planets.length; j++) {
        const planet2 = planets[j];
        const pos2 = swisseph.swe_calc_ut(julianDay, planet2.id, flags);

        let diff = Math.abs(pos1.longitude - pos2.longitude);
        if (diff > 180) diff = 360 - diff;

        // Check for aspects
        Object.entries(aspectTypes).forEach(([aspect, angle]) => {
          const aspectOrb = Math.abs(diff - angle);
          if (aspectOrb <= orb) {
            aspects.push({
              planet1: planet1.name,
              planet2: planet2.name,
              aspect,
              angle: diff,
              orb: aspectOrb,
              exact: aspectOrb < 1
            });
          }
        });
      }
    }

    res.json({
      date,
      time: time || '12:00',
      aspects
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Swiss Ephemeris API running on port ${PORT}`);
});