import { findTimeZone, getZonedTime } from 'timezone-support'

/**
 * Get timezone for coordinates
 */
export function getTimezone(latitude: number, longitude: number): string {
  // Default to UTC if timezone lookup fails
  try {
    // Use longitude to approximate timezone
    const tzHours = Math.round(longitude / 15)
    const tzName = `Etc/GMT${tzHours >= 0 ? '-' : '+'}${Math.abs(tzHours)}`
    return findTimeZone(tzName).name
  } catch (error) {
    console.warn('Timezone lookup failed:', error)
    return 'UTC'
  }
}

/**
 * Convert local time to UTC
 */
export function localToUTC(date: Date, timezone: string): Date {
  try {
    const tz = findTimeZone(timezone)
    const zonedTime = getZonedTime(date, tz)
    return new Date(Date.UTC(
      zonedTime.year,
      zonedTime.month - 1,
      zonedTime.day,
      zonedTime.hours,
      zonedTime.minutes,
      zonedTime.seconds
    ))
  } catch (error) {
    console.warn('Time conversion failed:', error)
    return date
  }
}

/**
 * Calculate Julian Day Number
 */
export function calculateJulianDay(date: Date): number {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  const hour = date.getUTCHours() +
               date.getUTCMinutes() / 60.0 +
               date.getUTCSeconds() / 3600.0

  let y = year
  let m = month
  if (m <= 2) {
    y -= 1
    m += 12
  }

  const a = Math.floor(y / 100)
  const b = 2 - a + Math.floor(a / 4)

  const jd = Math.floor(365.25 * (y + 4716)) +
             Math.floor(30.6001 * (m + 1)) +
             day + hour / 24.0 + b - 1524.5

  return jd
}