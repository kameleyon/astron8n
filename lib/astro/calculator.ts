import { BirthChartData, PlanetPosition, Position, ZodiacSign, HouseData, PlanetName, PatternData, SpecialFeature } from '../../../lib/types/birth-chart'
import { analyzeBirthChart } from './patterns'
import { analyzeSpecialFeatures } from './features'
import { calculateAspects } from './aspects'
import {
  getTimezone,
  calculatePlanetPositions,
  calculateHouses,
  HOUSE_SYSTEMS
} from './planets'
import moment from 'moment-timezone'
import path from 'path'
import sweImp from 'swisseph-v2'

interface BirthChartInput {
  name: string
  date: string
  time: string
  location: string
  latitude: number
  longitude: number
  houseSystem?: keyof typeof HOUSE_SYSTEMS
}

const ephePath = path.join(process.cwd(), 'birthchartpack', 'ephe')
sweImp.swe_set_ephe_path(ephePath)

function normalizeSwissEph(swe: any) {
  return {
    julday: (year: number, month: number, day: number, hour: number) => {
      return swe.swe_julday(year, month, day, hour, swe.SE_GREG_CAL)
    },
    calc_ut: (jd: number, planet: number, flags: number) => {
      return swe.swe_calc_ut(jd, planet, flags)
    },
    houses: (jd: number, lat: number, lon: number, hsys: string) => {
      return swe.swe_houses(jd, lat, lon, hsys)
    }
  }
}

const swe = normalizeSwissEph(sweImp)

function parseDate(dateStr: string): { year: number; month: number; day: number } {
  const parts = dateStr.includes('/')
    ? dateStr.split('/').map(Number)
    : dateStr.split('-').map(Number)

  if (dateStr.includes('/')) {
    const [m, d, y] = parts
    if (
      isNaN(m) || isNaN(d) || isNaN(y) ||
      m < 1 || m > 12 || d < 1 || d > 31 || y < 1
    ) {
      throw new Error('Invalid date values')
    }
    return { year: y, month: m, day: d }
  } else {
    const [y, m, d] = parts
    if (
      isNaN(m) || isNaN(d) || isNaN(y) ||
      m < 1 || m > 12 || d < 1 || d > 31 || y < 1
    ) {
      throw new Error('Invalid date values')
    }
    return { year: y, month: m, day: d }
  }
}

function parseTime(timeStr: string): { hour: number; minute: number } {
  const [hour, minute] = timeStr.split(':').map(Number)
  if (
    isNaN(hour) || isNaN(minute) ||
    hour < 0 || hour > 23 ||
    minute < 0 || minute > 59
  ) {
    throw new Error('Invalid time values')
  }
  return { hour, minute }
}

async function calculateJulianDay(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  latitude: number,
  longitude: number
): Promise<number> {
  const timezone = await getTimezone(latitude, longitude)
  const localTime = moment.tz([year, month - 1, day, hour, minute, second], timezone)
  if (!localTime.isValid()) {
    throw new Error('Invalid date/time combination')
  }
  const utcTime = localTime.clone().utc()
  const jd = swe.julday(
    utcTime.year(),
    utcTime.month() + 1,
    utcTime.date(),
    utcTime.hours() + utcTime.minutes() / 60.0 + utcTime.seconds() / 3600.0
  )
  if (isNaN(jd)) {
    throw new Error('Julian Day calculation failed')
  }
  return jd
}

export async function calculateBirthChart(input: BirthChartInput): Promise<BirthChartData> {
  try {
    if (
      isNaN(input.latitude) || isNaN(input.longitude) ||
      input.latitude < -90 || input.latitude > 90 ||
      input.longitude < -180 || input.longitude > 180
    ) {
      throw new Error(
        'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180'
      )
    }

    const { year, month, day } = parseDate(input.date)
    const { hour, minute } = parseTime(input.time)

    const jd = await calculateJulianDay(
      year,
      month,
      day,
      hour,
      minute,
      0,
      input.latitude,
      input.longitude
    )

    const positions = await calculatePlanetPositions(jd)

    const houseData = await calculateHouses(
      jd,
      input.latitude,
      input.longitude,
      input.houseSystem || 'PLACIDUS'
    )

    // Build planets array
    const planets = Object.entries(positions).map(([name, data]) => ({
      name,
      longitude: data.longitude,
      latitude: data.latitude,
      distance: data.distance,
      longitudeSpeed: data.longitudeSpeed,
      sign: data.sign as ZodiacSign,
      retrograde: data.retrograde,
      formatted: data.formatted
    }))

    // Convert array to record for aspects
    const planetRecord: Record<PlanetName, PlanetPosition> = planets.reduce(
      (acc, planet) => ({
        ...acc,
        [planet.name as PlanetName]: {
          longitude: planet.longitude,
          latitude: planet.latitude,
          distance: planet.distance,
          longitudeSpeed: planet.longitudeSpeed,
          sign: planet.sign,
          retrograde: planet.retrograde,
          formatted: planet.formatted
        }
      }),
      {} as Record<PlanetName, PlanetPosition>
    )

    const aspects = calculateAspects(planetRecord)

    const ascendant: Position = {
      longitude: houseData.Ascendant.cusp,
      latitude: 0,
      distance: 0,
      longitudeSpeed: 0,
      sign: houseData.Ascendant.sign as ZodiacSign,
      retrograde: false,
      formatted: houseData.Ascendant.formatted
    }

    const midheaven: Position = {
      longitude: houseData.Midheaven.cusp,
      latitude: 0,
      distance: 0,
      longitudeSpeed: 0,
      sign: houseData.Midheaven.sign as ZodiacSign,
      retrograde: false,
      formatted: houseData.Midheaven.formatted
    }

    const typedHouseData = Object.entries(houseData).reduce<Record<string, HouseData>>(
      (acc, [key, val]) => ({
        ...acc,
        [key]: {
          cusp: val.cusp,
          sign: val.sign as ZodiacSign,
          formatted: val.formatted
        }
      }),
      {}
    )

    const birthChartData: BirthChartData = {
      name: input.name,
      location: input.location,
      date: input.date,
      time: input.time,
      planets,
      houses: typedHouseData,
      aspects,
      patterns: [] as PatternData[],
      features: [] as SpecialFeature[],
      ascendant,
      midheaven
    }

    const { patterns } = analyzeBirthChart(birthChartData)
    birthChartData.patterns = patterns

    birthChartData.features = analyzeSpecialFeatures(birthChartData)

    return birthChartData
  } catch (err) {
    const error = err as Error
    throw new Error(`Birth chart calculation failed: ${error.message || 'Unknown error'}`)
  }
}
