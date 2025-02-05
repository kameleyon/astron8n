"use client"

import { useState } from 'react'
import { BirthChartForm } from '../../components/birth-chart/birth-chart-form'
import { BirthChartResult } from '../../components/birth-chart/birth-chart-result'
import type { BirthChartData } from '../../lib/types/birth-chart'

export default function TestPage() {
  const [birthChartData, setBirthChartData] = useState<BirthChartData | null>(null)

  const handleFormSubmit = async (formData: {
    name: string
    date: string
    time: string
    location: string
    latitude: number
    longitude: number
  }) => {
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to calculate birth chart')
      }

      const data = await response.json()
      setBirthChartData(data)
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {!birthChartData ? (
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold text-center mb-8">Birth Chart Test Page</h1>
          <div className="max-w-md mx-auto">
            <BirthChartForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      ) : (
        <BirthChartResult 
          data={birthChartData} 
          onBack={() => setBirthChartData(null)} 
        />
      )}
    </div>
  )
}
