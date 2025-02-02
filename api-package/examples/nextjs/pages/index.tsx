import { useState } from 'react';
import { BirthChartData, Planet, House, Aspect } from 'astrogenie-birthchart';

export default function Home() {
  const [birthChart, setBirthChart] = useState<BirthChartData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      location: formData.get('location') as string,
      latitude: parseFloat(formData.get('latitude') as string),
      longitude: parseFloat(formData.get('longitude') as string)
    };

    try {
      const response = await fetch('/api/birth-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to calculate birth chart');
      }

      const chartData = await response.json();
      setBirthChart(chartData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Birth Chart Calculator</h1>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="date" className="block mb-1">Birth Date</label>
          <input
            type="date"
            id="date"
            name="date"
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="time" className="block mb-1">Birth Time (24-hour)</label>
          <input
            type="time"
            id="time"
            name="time"
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="location" className="block mb-1">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            required
            placeholder="City, Country"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="latitude" className="block mb-1">Latitude</label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            required
            step="any"
            min="-90"
            max="90"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="longitude" className="block mb-1">Longitude</label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            required
            step="any"
            min="-180"
            max="180"
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Calculating...' : 'Calculate Birth Chart'}
        </button>

        {error && (
          <div className="text-red-500 mt-4">
            Error: {error}
          </div>
        )}
      </form>

      {birthChart && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Birth Chart Results</h2>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-2">Planets</h3>
              <div className="grid grid-cols-2 gap-4">
                {birthChart.planets.map((planet: Planet) => (
                  <div key={planet.name} className="border p-3 rounded">
                    <div className="font-medium">{planet.name}</div>
                    <div>{planet.sign} {planet.degree.toFixed(2)}°</div>
                    <div>House {planet.house}</div>
                    {planet.retrograde && <div className="text-red-500">Retrograde</div>}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-2">Houses</h3>
              <div className="grid grid-cols-2 gap-4">
                {birthChart.houses.map((house: House) => (
                  <div key={house.number} className="border p-3 rounded">
                    <div className="font-medium">House {house.number}</div>
                    <div>{house.sign} {house.degree.toFixed(2)}°</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-2">Aspects</h3>
              <div className="grid grid-cols-1 gap-2">
                {birthChart.aspects.map((aspect: Aspect, index: number) => (
                  <div key={index} className="border p-3 rounded">
                    <div>
                      {aspect.planet1} {aspect.type.toLowerCase()} {aspect.planet2}
                    </div>
                    <div>Orb: {aspect.orb.toFixed(2)}°</div>
                    <div className={
                      aspect.nature === 'harmonious' ? 'text-green-500' :
                      aspect.nature === 'challenging' ? 'text-red-500' :
                      'text-blue-500'
                    }>
                      {aspect.nature}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
