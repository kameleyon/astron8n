const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createBirthChart } = require('astrogenie-birthchart');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.API_PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Birth chart calculation endpoint
app.post('/birth-chart', async (req, res) => {
  try {
    const { name, date, time, location, latitude, longitude } = req.body;
    console.log('Received birth chart request:', {
      name,
      date,
      time,
      location,
      latitude,
      longitude
    });

    if (!process.env.NEXT_ASTROGENIE_API_KEY) {
      console.error('API key not found in environment');
      throw new Error('API key not configured');
    }

    console.log('Using API key:', process.env.NEXT_ASTROGENIE_API_KEY);

    try {
      const calculator = createBirthChart({
        apiKey: process.env.NEXT_ASTROGENIE_API_KEY,
        zodiacType: 'tropical',
        houseSystem: 'P',
        aspectOrbs: {
          conjunction: 8,
          opposition: 8,
          trine: 6,
          square: 6,
          sextile: 4
        }
      });

      console.log('Calculator created successfully');

      const rawBirthChart = await calculator.calculate({
        name,
        date,
        time: time || '12:00',
        location,
        latitude,
        longitude
      });

      if (!rawBirthChart) {
        throw new Error('Birth chart calculation returned no data');
      }

      // Transform the data into the expected format
      const birthChart = {
        name: rawBirthChart.name,
        location: rawBirthChart.location,
        date: rawBirthChart.date,
        time: rawBirthChart.time,
        planets: rawBirthChart.planets.map(planet => ({
          name: planet.name,
          longitude: planet.longitude,
          latitude: planet.latitude || 0,
          distance: planet.distance || 0,
          longitudeSpeed: planet.speed,
          sign: planet.sign,
          house: planet.house,
          retrograde: planet.retrograde,
          formatted: planet.formatted || `${planet.longitude.toFixed(2)}° ${planet.sign}`
        })),
        houses: rawBirthChart.houses.reduce((acc, house) => {
          acc[`house_${house.number}`] = {
            cusp: house.cusp,
            sign: house.sign,
            formatted: house.formatted || `${house.cusp.toFixed(2)}° ${house.sign}`
          };
          return acc;
        }, {}),
        aspects: rawBirthChart.aspects.map(aspect => ({
          planet1: aspect.planet1,
          planet2: aspect.planet2,
          aspect: aspect.type.toUpperCase(),
          angle: aspect.angle,
          orb: parseFloat(aspect.orb.toFixed(2)),
          nature: aspect.nature || 'neutral',
          motion: aspect.exact ? 'exact' : 'applying'
        })),
        patterns: [],
        features: [],
        ascendant: {
          longitude: rawBirthChart.ascendant.longitude,
          latitude: 0,
          distance: 0,
          longitudeSpeed: 0,
          sign: rawBirthChart.ascendant.sign,
          retrograde: false,
          formatted: rawBirthChart.ascendant.formatted || `${rawBirthChart.ascendant.longitude.toFixed(2)}° ${rawBirthChart.ascendant.sign}`
        },
        midheaven: {
          longitude: rawBirthChart.midheaven.longitude,
          latitude: 0,
          distance: 0,
          longitudeSpeed: 0,
          sign: rawBirthChart.midheaven.sign,
          retrograde: false,
          formatted: rawBirthChart.midheaven.formatted || `${rawBirthChart.midheaven.longitude.toFixed(2)}° ${rawBirthChart.midheaven.sign}`
        }
      };

      console.log('Transformed birth chart data:', birthChart);
      console.log('Birth chart calculated successfully');
      res.json(birthChart);
    } catch (calculationError) {
      console.error('Birth chart calculation error:', calculationError);
      throw calculationError;
    }
  } catch (error) {
    console.error('API error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to calculate birth chart',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  const status = {
    status: 'ok',
    apiKey: !!process.env.NEXT_ASTROGENIE_API_KEY,
    env: process.env.NODE_ENV
  };
  console.log('Health check:', status);
  res.json(status);
});

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
  console.log(`API key configured: ${!!process.env.NEXT_ASTROGENIE_API_KEY}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
