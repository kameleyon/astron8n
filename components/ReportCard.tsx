"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: string;
}

interface ReportCardProps {
  report: Report;
  isActive: boolean;
}

export default function ReportCard({ report, isActive }: ReportCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentEndpoint, setCurrentEndpoint] = useState<string>('');
  
  const endpoints = [
    { name: 'Local', url: process.env.NEXT_PUBLIC_LOCAL_API_URL + '/birth-chart' },
    { name: 'AstroGenie', url: process.env.NEXT_PUBLIC_ASTROGENIE_API_URL + '/birth-chart' },
    { name: 'Netlify', url: process.env.NEXT_PUBLIC_NETLIFY_API_URL + '/birth-chart' }
  ].filter(endpoint => endpoint.url);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);

    for (const endpoint of endpoints) {
      try {
        setCurrentEndpoint(endpoint.name);
        console.log(`Trying ${endpoint.name} endpoint...`);

        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reportType: report.id
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log(`${endpoint.name} failed:`, errorData);
          continue; // Try next endpoint
        }

        const data = await response.json();
        console.log(`${endpoint.name} succeeded:`, data);
        setIsLoading(false);
        setCurrentEndpoint('');
        return; // Success, exit the loop

      } catch (error) {
        console.log(`${endpoint.name} error:`, error);
        // Continue to next endpoint
      }
    }

    // If we get here, all endpoints failed
    setError('All endpoints failed. Please try again later.');
    setCurrentEndpoint('');
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ 
        scale: isActive ? 1 : 0.95, 
        opacity: isActive ? 1 : 0.5 
      }}
      transition={{ duration: 0.3 }}
      className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
    >
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{report.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{report.title}</h3>
              <p className="text-2xl font-bold text-primary mt-1">
                ${report.price}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {report.description}
        </p>

        {currentEndpoint && !error && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
            Trying {currentEndpoint} endpoint...
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Action Button */}
        <button 
          onClick={handleGenerateReport}
          disabled={isLoading}
          className="w-full bg-primary text-white py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Report</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
