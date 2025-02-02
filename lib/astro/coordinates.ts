/**
 * Convert ecliptic coordinates to equatorial coordinates
 */
export function eclipticToEquatorial(
  longitude: number,
  latitude: number,
  obliquity: number
): { rightAscension: number; declination: number } {
  // Convert degrees to radians
  const lon = longitude * Math.PI / 180;
  const lat = latitude * Math.PI / 180;
  const obl = obliquity * Math.PI / 180;

  // Calculate right ascension and declination
  const sinDec = Math.sin(lat) * Math.cos(obl) +
                 Math.cos(lat) * Math.sin(obl) * Math.sin(lon);
  const declination = Math.asin(sinDec) * 180 / Math.PI;

  const y = Math.sin(lon) * Math.cos(obl) -
           Math.tan(lat) * Math.sin(obl);
  const x = Math.cos(lon);
  let rightAscension = Math.atan2(y, x) * 180 / Math.PI;

  // Normalize right ascension to 0-360 range
  if (rightAscension < 0) rightAscension += 360;

  return { rightAscension, declination };
}

/**
 * Convert equatorial coordinates to horizontal coordinates
 */
export function equatorialToHorizontal(
  rightAscension: number,
  declination: number,
  latitude: number,
  localSiderealTime: number
): { azimuth: number; altitude: number } {
  // Convert degrees to radians
  const ra = rightAscension * Math.PI / 180;
  const dec = declination * Math.PI / 180;
  const lat = latitude * Math.PI / 180;
  const lst = localSiderealTime * Math.PI / 180;

  // Calculate hour angle
  const ha = lst - ra;

  // Calculate altitude
  const sinAlt = Math.sin(dec) * Math.sin(lat) +
                 Math.cos(dec) * Math.cos(lat) * Math.cos(ha);
  const altitude = Math.asin(sinAlt) * 180 / Math.PI;

  // Calculate azimuth
  const y = Math.sin(ha);
  const x = Math.cos(ha) * Math.sin(lat) -
           Math.tan(dec) * Math.cos(lat);
  let azimuth = Math.atan2(y, x) * 180 / Math.PI;

  // Normalize azimuth to 0-360 range
  if (azimuth < 0) azimuth += 360;

  return { azimuth, altitude };
}

/**
 * Calculate obliquity of the ecliptic
 */
export function calculateObliquity(julianDay: number): number {
  const T = (julianDay - 2451545.0) / 36525; // Julian centuries since J2000.0
  
  // Mean obliquity of the ecliptic (Laskar's formula)
  let eps = 23.43929111111111 -
            T * (46.8150 +
            T * (0.00059 -
            T * (0.001813)));

  // Nutation in obliquity
  const omega = 125.04452 - 1934.136261 * T;
  const L = 280.4665 + 36000.7698 * T;
  const dEps = 9.20 * Math.cos(omega * Math.PI / 180) +
               0.57 * Math.cos(2 * L * Math.PI / 180);

  eps += dEps / 3600; // Add nutation

  return eps;
}

/**
 * Calculate precession since J2000.0
 */
export function calculatePrecession(
  longitude: number,
  latitude: number,
  julianDay: number
): { longitude: number; latitude: number } {
  const T = (julianDay - 2451545.0) / 36525;
  
  // Precession angles
  const zeta = (2306.2181 * T + 0.30188 * T * T + 0.017998 * T * T * T) / 3600;
  const z = (2306.2181 * T + 1.09468 * T * T + 0.018203 * T * T * T) / 3600;
  const theta = (2004.3109 * T - 0.42665 * T * T - 0.041833 * T * T * T) / 3600;

  // Convert to radians
  const zetaR = zeta * Math.PI / 180;
  const zR = z * Math.PI / 180;
  const thetaR = theta * Math.PI / 180;
  const lonR = longitude * Math.PI / 180;
  const latR = latitude * Math.PI / 180;

  // Calculate precessed coordinates
  const A = Math.cos(latR) * Math.sin(lonR + zetaR);
  const B = Math.cos(thetaR) * Math.cos(latR) * Math.cos(lonR + zetaR) -
           Math.sin(thetaR) * Math.sin(latR);
  const C = Math.sin(thetaR) * Math.cos(latR) * Math.cos(lonR + zetaR) +
           Math.cos(thetaR) * Math.sin(latR);

  let lonP = Math.atan2(A, B) + zR;
  const latP = Math.asin(C);

  // Convert back to degrees
  let longitudeP = lonP * 180 / Math.PI;
  const latitudeP = latP * 180 / Math.PI;

  // Normalize longitude to 0-360 range
  while (longitudeP < 0) longitudeP += 360;
  while (longitudeP >= 360) longitudeP -= 360;

  return { longitude: longitudeP, latitude: latitudeP };
}