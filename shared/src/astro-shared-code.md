# Astrology Calculation Shared Code

This document outlines the code that can be shared between the web and mobile applications for astrology calculations.

## Core Functionality to Share

### 1. Types and Interfaces

The type definitions in `birthchartpack/lib/types/birth-chart.ts` can be shared directly:

- ZodiacSign
- PlanetName
- Position
- PlanetPosition
- HouseData
- AspectData
- PatternData
- SpecialFeature
- BirthChartData

These types define the core data structures used throughout the application and should be consistent across platforms.

### 2. Calculation Logic

The core calculation logic in `birthchartpack/lib/services/astro/calculator.ts` can be shared:

- `calculateBirthChart` function
- Date and time parsing functions
- Julian day calculation
- Coordinate handling

This is the heart of the astrology functionality and should be identical on both platforms.

### 3. Supporting Modules

Several supporting modules can also be shared:

- `planets.ts`: Planet position calculations
- `houses.ts`: House calculations
- `aspects.ts`: Aspect calculations
- `patterns.ts`: Chart pattern analysis
- `features.ts`: Special feature detection

### 4. Ephemeris Data

The ephemeris data in the `birthchartpack/ephe` directory is essential for calculations and should be packaged with both applications.

## Platform-Specific Adaptations

While the core calculation logic can be shared, some adaptations will be needed:

### Web-Specific

- API routes for server-side calculations
- React components for web UI
- Web-specific styling

### Mobile-Specific

- React Native components for mobile UI
- Mobile-specific styling
- Native module integration for performance-intensive calculations
- Local storage for offline functionality

## Implementation Strategy

1. Move the core calculation logic to the shared package
2. Create platform-agnostic utility functions
3. Implement platform-specific wrappers for UI components
4. Ensure ephemeris data is properly packaged for both platforms

## Dependencies

The following dependencies will need to be available in both environments:

- `swisseph-v2`: For astronomical calculations
- `moment-timezone`: For timezone handling
- Data structures and utility functions

## API Design

The shared package should expose a clean API:

```typescript
// Example API
import { calculateBirthChart, BirthChartData } from '@astrogenie/shared';

// Input data
const birthData = {
  name: 'John Doe',
  date: '1990-01-01',
  time: '12:00',
  location: 'New York, NY',
  latitude: 40.7128,
  longitude: -74.0060
};

// Calculate birth chart
const birthChart = await calculateBirthChart(birthData);

// Access results
console.log(birthChart.planets);
console.log(birthChart.houses);
console.log(birthChart.aspects);
```

This API should be consistent across platforms, with platform-specific implementations handling the UI rendering.
