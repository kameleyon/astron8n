"use client";

import { useState, useEffect } from 'react';
import { FileText, Sun, Moon, Star } from 'lucide-react';
import { calculateBirthChart } from '@/lib/astro/calculators';
import { BirthChartData } from '@/types/birth-chart';
import { supabase } from '@/lib/supabase';

interface BirthChartProps {
  birthDate: string;
  birthTime: string | null;
  birthLocation: string;
  latitude: number;
  longitude: number;
}

export default function BirthChart() {
  const [chartData, setChartData] = useState<BirthChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User not authenticated');
        }

        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        if (!profile) throw new Error('Profile not found');

        setUserProfile(profile);

        // Generate birth chart using profile data
        const data = await calculateBirthChart({
          name: profile.full_name,
          date: profile.birth_date,
          time: profile.birth_time || '12:00', // Default to noon if time unknown
          location: profile.birth_location,
          latitude: profile.latitude,
          longitude: profile.longitude
        });

        setChartData(data);
      } catch (err: any) {
        console.error('Error loading birth chart:', err);
        setError(err.message || 'Failed to generate birth chart');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 text-center">
        {error}
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="text-gray-500 p-4 text-center">
        No chart data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Grid Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Planetary Positions */}
        <div className="bg-[#0d1117] rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Planetary Positions</h3>
          <div className="space-y-4">
            {chartData.planets.map((planet) => (
              <div key={planet.name} className="flex items-center justify-between border-b border-gray-700 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#FF5D01]">{planet.name}</span>
                  <span className="text-gray-400">in</span>
                </div>
                <div className="text-right">
                  <span className="text-[#FF5D01]">{planet.sign}</span>
                  <span className="text-gray-400 text-sm ml-2">({planet.formatted})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Houses */}
        <div className="bg-[#0d1117] rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Houses</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(chartData.houses).map(([house, data]) => (
              <div key={house} className="border-b border-gray-700 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#FF5D01]">{house}</span>
                  <span className="text-gray-400">{data.sign}</span>
                </div>
                <div className="text-sm text-gray-400">
                  {data.formatted}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aspects */}
      {chartData.aspects.length > 0 && (
        <div className="bg-[#0d1117] rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Major Aspects</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {chartData.aspects.map((aspect, index) => (
              <div key={index} className="border-b border-gray-700 pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#FF5D01]">{aspect.planet1}</span>
                    <span className="text-gray-400 mx-2">{aspect.aspect}</span>
                    <span className="text-[#FF5D01]">{aspect.planet2}</span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {aspect.angle}° ({aspect.orb}° orb)
                  </span>
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {aspect.nature}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Ascendant */}
        <div className="bg-[#0d1117] p-4 rounded-xl text-white">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-[#FF5D01]" />
            <h3 className="font-medium">Ascendant</h3>
          </div>
          <p className="text-lg font-bold text-[#FF5D01]">
            {chartData.ascendant.sign}
          </p>
          <p className="text-sm text-gray-400">
            {chartData.ascendant.formatted}
          </p>
        </div>

        {/* Midheaven */}
        <div className="bg-[#0d1117] p-4 rounded-xl text-white">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-[#FF5D01]" />
            <h3 className="font-medium">Midheaven</h3>
          </div>
          <p className="text-lg font-bold text-[#FF5D01]">
            {chartData.midheaven.sign}
          </p>
          <p className="text-sm text-gray-400">
            {chartData.midheaven.formatted}
          </p>
        </div>

        {/* Chart Patterns */}
        {chartData.patterns.length > 0 && (
          <div className="bg-[#0d1117] p-4 rounded-xl text-white">
            <h3 className="font-medium mb-2">Chart Patterns</h3>
            <div className="space-y-2">
              {chartData.patterns.map((pattern, index) => (
                <div key={index}>
                  <p className="text-[#FF5D01]">{pattern.name}</p>
                  <p className="text-sm text-gray-400">{pattern.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}