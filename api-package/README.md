# Astrogenie Birth Chart API

A comprehensive birth chart calculation API for astrology applications. This package provides accurate planetary positions, house calculations, and aspect interpretations using the Swiss Ephemeris.

## Features

- Accurate planetary positions using Swiss Ephemeris
- House system calculations (Placidus, Koch, Equal House, etc.)
- Aspect calculations with configurable orbs
- Support for both Tropical and Sidereal zodiacs
- TypeScript support with full type definitions
- Easy-to-use API with detailed documentation

## Installation

```bash
npm install astrogenie-birthchart
```

Make sure to have the ephemeris files in your project's `ephe` directory. These files are required for accurate astronomical calculations.

## Quick Start

```typescript
import { createBirthChart } from 'astrogenie-birthchart';

// Initialize with your API key
const calculator = createBirthChart({
  apiKey: process.env.ASTROGENIE_API_KEY
});

// Calculate a birth chart
const birthChart = await calculator.calculate({
  name: 'John Doe',
  date: '1990-01-01',
  time: '12:00',
  location: 'New York, NY',
  latitude: 40.7128,
  longitude: -74.0060
});

console.log(birthChart.planets);  // Array of planetary positions
console.log(birthChart.houses);   // Array of house cusps
console.log(birthChart.aspects);  // Array of planetary aspects
```

## Configuration Options

```typescript
const calculator = createBirthChart({
  apiKey: process.env.ASTROGENIE_API_KEY,
  zodiacType: 'tropical',  // 'tropical' or 'sidereal'
  houseSystem: 'P',       // 'P' (Placidus), 'K' (Koch), 'E' (Equal), etc.
  aspectOrbs: {
    conjunction: 10,
    opposition: 10,
    trine: 8,
    square: 8,
    sextile: 6
  }
});
```

## API Reference

### BirthChartInput

The input data required for birth chart calculation:

```typescript
interface BirthChartInput {
  name: string;
  date: string;        // YYYY-MM-DD format
  time: string;        // HH:mm format (24-hour)
  location: string;
  latitude: number;    // -90 to 90
  longitude: number;   // -180 to 180
}
```

### BirthChartData

The calculated birth chart data:

```typescript
interface BirthChartData {
  name: string;
  date: string;
  time: string;
  location: string;
  planets: Planet[];
  houses: House[];
  aspects: Aspect[];
  ascendant: ChartPoint;
  midheaven: ChartPoint;
  descendant: ChartPoint;
  imumCoeli: ChartPoint;
  zodiacType: 'tropical' | 'sidereal';
  houseSystem: string;
}
```

## Framework Integration Examples

### Next.js API Route

```typescript
// pages/api/birth-chart.ts
import { createBirthChart } from 'astrogenie-birthchart';

const calculator = createBirthChart({
  apiKey: process.env.ASTROGENIE_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const birthChart = await calculator.calculate(req.body);
    res.status(200).json(birthChart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
```

### Express.js Server

```typescript
import express from 'express';
import { createBirthChart } from 'astrogenie-birthchart';

const app = express();
const calculator = createBirthChart({
  apiKey: process.env.ASTROGENIE_API_KEY
});

app.post('/birth-chart', async (req, res) => {
  try {
    const birthChart = await calculator.calculate(req.body);
    res.json(birthChart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### React Component

```typescript
import { useState } from 'react';
import { createBirthChart, BirthChartData } from 'astrogenie-birthchart';

const calculator = createBirthChart({
  apiKey: process.env.NEXT_PUBLIC_ASTROGENIE_API_KEY
});

export function BirthChartForm() {
  const [birthChart, setBirthChart] = useState<BirthChartData | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    
    try {
      const chart = await calculator.calculate({
        name: formData.get('name') as string,
        date: formData.get('date') as string,
        time: formData.get('time') as string,
        location: formData.get('location') as string,
        latitude: parseFloat(formData.get('latitude') as string),
        longitude: parseFloat(formData.get('longitude') as string)
      });
      
      setBirthChart(chart);
    } catch (error) {
      console.error('Failed to calculate birth chart:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Error Handling

The package throws typed errors that you can catch and handle appropriately:

```typescript
try {
  const birthChart = await calculator.calculate(input);
} catch (error) {
  if (error instanceof BirthChartError) {
    console.error(`Error code: ${error.code}`);
    console.error(`Details: ${error.details}`);
  }
}
```

## License

MIT License

## Support

For support, feature requests, or bug reports, please visit our [GitHub repository](https://github.com/astrogenie/birthchart-api) or contact support@astrogenie.app.
