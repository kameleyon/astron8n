import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Command } from './ui/command';

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface LocationSearchProps {
  onSelect: (location: Location) => void;
}

export function LocationSearch({ onSelect }: LocationSearchProps) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchLocation = async () => {
      if (search.length < 3) {
        setResults([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            search
          )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&types=place`
        );

        if (!response.ok) throw new Error('Failed to fetch locations');

        const data = await response.json();
        const locations = data.features.map((feature: any) => ({
          name: feature.place_name,
          lat: feature.center[1],
          lng: feature.center[0]
        }));

        setResults(locations);
      } catch (error) {
        console.error('Error searching locations:', error);
        setResults([]);
      }
    };

    const debounce = setTimeout(searchLocation, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  return (
    <div className="relative">
      <Input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        placeholder="Enter a city name"
        className="w-full"
      />

      {showResults && results.length > 0 && (
        <Command className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden">
          <div className="max-h-60 overflow-auto">
            {results.map((result, index) => (
              <button
                key={index}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  onSelect(result);
                  setSearch(result.name);
                  setShowResults(false);
                }}
              >
                {result.name}
              </button>
            ))}
          </div>
        </Command>
      )}
    </div>
  );
}
