# Birth Chart Calculator Example (Next.js)

This example demonstrates how to use the Astrogenie Birth Chart API in a Next.js application.

## Features

- Form to input birth details (date, time, location)
- Display calculated birth chart data
- Responsive design with Tailwind CSS
- TypeScript support
- API route implementation

## Setup

1. Make sure you have Node.js installed (version 14 or higher)

2. Set up your environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add your Astrogenie API key:
   ```
   ASTROGENIE_API_KEY=your_api_key_here
   ```

3. Run the setup script:
   ```bash
   # Make the script executable
   chmod +x setup.sh
   
   # Run the setup
   ./setup.sh
   ```

   This will:
   - Build the main package
   - Install dependencies
   - Link the local package
   - Set up Tailwind CSS

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
.
├── pages/
│   ├── _app.tsx           # App component with global styles
│   ├── index.tsx          # Main page with birth chart form
│   └── api/
│       └── birth-chart.ts # API route for calculations
├── styles/
│   └── globals.css        # Global styles and Tailwind imports
├── setup.sh               # Setup script
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## API Usage

The example demonstrates two ways to use the birth chart API:

1. Direct usage in frontend components:
```typescript
import { createBirthChart } from 'astrogenie-birthchart';

const calculator = createBirthChart({
  apiKey: process.env.NEXT_PUBLIC_ASTROGENIE_API_KEY
});

const birthChart = await calculator.calculate({
  name: 'John Doe',
  date: '1990-01-01',
  time: '12:00',
  location: 'New York, NY',
  latitude: 40.7128,
  longitude: -74.0060
});
```

2. Through API routes:
```typescript
// pages/api/birth-chart.ts
import { createBirthChart } from 'astrogenie-birthchart';

const calculator = createBirthChart({
  apiKey: process.env.ASTROGENIE_API_KEY
});

export default async function handler(req, res) {
  const birthChart = await calculator.calculate(req.body);
  res.json(birthChart);
}
```

## Customization

You can customize the birth chart calculations by modifying the configuration:

```typescript
const calculator = createBirthChart({
  apiKey: process.env.ASTROGENIE_API_KEY,
  zodiacType: 'tropical',  // or 'sidereal'
  houseSystem: 'P',       // Placidus house system
  aspectOrbs: {
    conjunction: 10,
    opposition: 10,
    trine: 8,
    square: 8,
    sextile: 6
  }
});
```

## Learn More

- [Astrogenie Birth Chart API Documentation](../../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
