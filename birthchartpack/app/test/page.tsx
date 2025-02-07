"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { BirthChartResult } from '@/components/birth-chart/birth-chart-result'
import type { BirthChartData } from '@/lib/types/birth-chart'

interface UserProfile {
  id: string
  full_name: string
  birth_date: string
  birth_time: string | null
  birth_location: string
  latitude: number
  longitude: number
  has_unknown_birth_time: boolean
}

export default function TestPage() {
  const router = useRouter()
  const [birthChartData, setBirthChartData] = useState<BirthChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserDataAndGenerateChart = async () => {
      try {
        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          router.push('/auth')
          return
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (profileError || !profile) {
          throw new Error('Failed to fetch user profile')
        }

        // Generate birth chart
        const requestData = {
          name: profile.full_name,
          date: profile.birth_date,
          time: profile.birth_time || '12:00',
          location: profile.birth_location,
          latitude: profile.latitude,
          longitude: profile.longitude,
        }

        const response = await fetch('http://localhost:3001/api/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to calculate birth chart')
        }

        const data = await response.json()
        setBirthChartData(data)
      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchUserDataAndGenerateChart()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading your birth chart...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {birthChartData && (
        <BirthChartResult 
          data={birthChartData} 
          onBack={() => router.push('/dashboard')} 
        />
      )}
    </div>
  )
}
