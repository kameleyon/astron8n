# Birth Chart Package for Next.js

A comprehensive birth chart generation package that can be integrated into any Next.js application.

## Features

- Birth chart calculation using Swiss Ephemeris
- Interactive birth chart wheel visualization
- Detailed planetary positions and aspects
- House system calculations
- Pattern recognition (Grand Trines, T-Squares, etc.)
- Location search with coordinates
- Personalized interpretations

## Installation

1. Copy this package into your Next.js project:
```bash
cp -r birthchartpack/* your-project/
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
   - Ensure the ephe/ directory is in your project root
   - This contains required Swiss Ephemeris files for calculations

## Required Dependencies

This package requires several peer dependencies that should be installed in your main project:
```json
{
  "next": ">=13.0.0",
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0"
}
```

## Usage

1. Import components:
```tsx
import { BirthChartForm } from '@/components/birth-chart/birth-chart-form'
import { BirthChartResult } from '@/components/birth-chart/birth-chart-result'
```

2. Use in your Next.js pages:
```tsx
export default function BirthChart() {
  const [birthChartData, setBirthChartData] = useState(null)

  const handleFormSubmit = async (formData) => {
    // Call the API endpoint
    const response = await fetch('/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    const data = await response.json()
    setBirthChartData(data)
  }

  return (
    <>
      {!birthChartData ? (
        <BirthChartForm onSubmit={handleFormSubmit} />
      ) : (
        <BirthChartResult data={birthChartData} onBack={() => setBirthChartData(null)} />
      )}
    </>
  )
}
```

## API Routes

The package includes an API route for birth chart calculations:
- POST `/api/calculate` - Calculates birth chart data
  - Required body: `{ name, date, time, location, latitude, longitude }`

## Components

### BirthChartForm
- Handles user input for birth details
- Includes location search with coordinates
- Form validation

### BirthChartResult
- Displays calculated chart data
- Interactive wheel visualization
- Detailed planetary positions
- House placements
- Aspect interpretations
- Pattern recognition

### Supporting Components
- InteractiveWheel - Visual birth chart wheel
- PlanetsSection - Planetary positions display
- HousesSection - House cusps and placements
- AspectsSection - Planetary aspects
- PatternsSection - Chart pattern display

## Styling

The package uses Tailwind CSS for styling. Ensure your project has Tailwind CSS configured with the provided configuration file.

## Swiss Ephemeris Files

The ephe/ directory contains required files for astronomical calculations. These must be present in your project root directory.

## Error Handling

The package includes comprehensive error handling for:
- Invalid input data
- Calculation errors
- API failures
- Missing ephemeris data

## Contributing

Feel free to submit issues and enhancement requests.

## License

MIT License
