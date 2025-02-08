import type { NextApiRequest, NextApiResponse } from 'next'
import { calculateBirthChart } from '../../birthchartpack/lib/services/astro/calculator'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      details: 'This endpoint only accepts POST requests'
    })
  }

  if (!req.headers['content-type'] || !req.headers['content-type']?.toLowerCase().includes('application/json')) {
    return res.status(400).json({
      error: 'Invalid or missing Content-Type',
      details: 'Request Content-Type must be application/json'
    })
  }

  let body: {
    name: string
    date: string
    time: string
    location: string
    latitude: number
    longitude: number
  }

  try {
    body = req.body
  } catch (err: any) {
    return res.status(400).json({
      error: 'Invalid request body format',
      details: err.message
    })
  }

  // Validate required fields
  const requiredFields = ['name', 'date', 'time', 'location', 'latitude', 'longitude']
  for (const field of requiredFields) {
    if (!(field in body)) {
      return res.status(400).json({
        error: 'Missing required field',
        details: `The field "${field}" is required`
      })
    }
  }

  // Validate field values
  if (typeof body.latitude !== 'number' || typeof body.longitude !== 'number') {
    return res.status(400).json({
      error: 'Invalid coordinates',
      details: 'Latitude and longitude must be numbers'
    })
  }

  if (body.latitude < -90 || body.latitude > 90) {
    return res.status(400).json({
      error: 'Invalid latitude',
      details: 'Latitude must be between -90 and 90 degrees'
    })
  }

  if (body.longitude < -180 || body.longitude > 180) {
    return res.status(400).json({
      error: 'Invalid longitude',
      details: 'Longitude must be between -180 and 180 degrees'
    })
  }

  // Validate date format (YYYY-MM-DD or MM/DD/YYYY)
  const dateRegex = /^(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})$/
  if (!dateRegex.test(body.date)) {
    return res.status(400).json({
      error: 'Invalid date format',
      details: 'Date must be in YYYY-MM-DD or MM/DD/YYYY format'
    })
  }

  // Validate time format (HH:MM)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
  if (!timeRegex.test(body.time)) {
    return res.status(400).json({
      error: 'Invalid time format',
      details: 'Time must be in 24-hour format (HH:MM)'
    })
  }

  // Calculate birth chart
  try {
    const birthChartData = await calculateBirthChart(body)
    return res.status(200).json(birthChartData)
  } catch (err: any) {
    console.error('Birth chart calculation error:', err)

    if (err.message.includes('ephemeris')) {
      return res.status(500).json({
        error: 'Ephemeris data error',
        details: err.message
      })
    }

    if (err.message.includes('timezone')) {
      return res.status(500).json({
        error: 'Timezone determination error',
        details: err.message
      })
    }

    if (err.message.includes('Julian')) {
      return res.status(500).json({
        error: 'Date/time conversion error',
        details: err.message
      })
    }

    if (err.message.includes('calculate')) {
      return res.status(500).json({
        error: 'Planetary calculation error',
        details: err.message
      })
    }

    // Generic error with details
    return res.status(500).json({
      error: 'Birth chart calculation failed',
      details: err.message || 'Unknown error occurred'
    })
  }
}
