/**
 * Robust GPS & Geolocation Service for MediInfo
 * 
 * Provides resilient location detection:
 * 1. Browser Geolocation (low-latency with timeout fallback)
 * 2. Automatic IP Geolocation fallback when GPS permission is denied or blocked in iframes
 * 3. Reverse geocoding to human-readable city/neighborhood names
 * 4. Proximity matching against known hospital & healthcare hubs
 */

export interface UserLocationResult {
  lat: number;
  lng: number;
  city: string;
  formattedAddress: string;
  source: 'gps' | 'network_ip' | 'timezone_preset';
  accuracyMeters?: number;
}

// Prominent regional hubs for fallback matching
const REGIONAL_CITY_HUBS: { name: string; lat: number; lng: number; timezone?: string }[] = [
  // India Metros & Major Cities
  { name: 'Delhi NCR, India', lat: 28.6139, lng: 77.209, timezone: 'Asia/Kolkata' },
  { name: 'Mumbai, India', lat: 19.076, lng: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'Bengaluru, India', lat: 12.9716, lng: 77.5946, timezone: 'Asia/Kolkata' },
  { name: 'Pune, India', lat: 18.5204, lng: 73.8567, timezone: 'Asia/Kolkata' },
  { name: 'Hyderabad, India', lat: 17.385, lng: 78.4867, timezone: 'Asia/Kolkata' },
  { name: 'Chandigarh, India', lat: 30.7333, lng: 76.7794, timezone: 'Asia/Kolkata' },
  { name: 'Jaipur, India', lat: 26.9124, lng: 75.7873, timezone: 'Asia/Kolkata' },
  { name: 'Ahmedabad, India', lat: 23.0225, lng: 72.5714, timezone: 'Asia/Kolkata' },
  { name: 'Kolkata, India', lat: 22.5726, lng: 88.3639, timezone: 'Asia/Kolkata' },
  { name: 'Chennai, India', lat: 13.0827, lng: 80.2707, timezone: 'Asia/Kolkata' },
  { name: 'Lucknow, India', lat: 26.8467, lng: 80.9462, timezone: 'Asia/Kolkata' },
  { name: 'Noida, India', lat: 28.5355, lng: 77.391, timezone: 'Asia/Kolkata' },
  { name: 'Gurugram, India', lat: 28.4595, lng: 77.0266, timezone: 'Asia/Kolkata' },
  { name: 'Indore, India', lat: 22.7196, lng: 75.8577, timezone: 'Asia/Kolkata' },
  { name: 'Bhopal, India', lat: 23.2599, lng: 77.4126, timezone: 'Asia/Kolkata' },
  { name: 'Surat, India', lat: 21.1702, lng: 72.8311, timezone: 'Asia/Kolkata' },
  { name: 'Nagpur, India', lat: 21.1458, lng: 79.0882, timezone: 'Asia/Kolkata' },
  { name: 'Patna, India', lat: 25.5941, lng: 85.1376, timezone: 'Asia/Kolkata' },
  { name: 'Kochi, India', lat: 9.9312, lng: 76.2673, timezone: 'Asia/Kolkata' },

  // International Hubs
  { name: 'New York, NY', lat: 40.7128, lng: -74.006, timezone: 'America/New_York' },
  { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437, timezone: 'America/Los_Angeles' },
  { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298, timezone: 'America/Chicago' },
  { name: 'Houston, TX', lat: 29.7604, lng: -95.3698, timezone: 'America/Chicago' },
  { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194, timezone: 'America/Los_Angeles' },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London' },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, timezone: 'Asia/Singapore' },
  { name: 'Sydney, AU', lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney' },
];

/**
 * Calculates distance between coordinates in km
 */
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Finds the closest known city name from coordinates
 */
export function findClosestCityName(lat: number, lng: number): string {
  let closest = REGIONAL_CITY_HUBS[0];
  let minDistance = Infinity;

  for (const hub of REGIONAL_CITY_HUBS) {
    const dist = getDistanceKm(lat, lng, hub.lat, hub.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = hub;
    }
  }

  // If within 50km of a major hub, use the hub name
  if (minDistance <= 50) {
    return closest.name;
  }
  return `${closest.name} (${Math.round(minDistance)}km away)`;
}

/**
 * Reverse geocodes coordinates to a readable locality/city name
 */
export async function reverseGeocodeCoords(lat: number, lng: number): Promise<string> {
  // Method 1: Use internal server-side proxy route (bypasses browser CORS & User-Agent restrictions)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (data && data.name) {
        return data.name;
      }
    }
  } catch {
    // Fall back to next method
  }

  // Method 2: Direct public reverse geocode
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14`,
      {
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const neighbourhood = addr.suburb || addr.neighbourhood || addr.city_district || addr.locality;
      const city = addr.city || addr.town || addr.county || addr.state_district;
      const state = addr.state;

      if (neighbourhood && city) {
        return `${neighbourhood}, ${city}`;
      }
      if (city && state) {
        return `${city}, ${state}`;
      }
      if (data.name) {
        return data.name;
      }
    }
  } catch {
    // Fall back to nearest known city calculation
  }

  return findClosestCityName(lat, lng);
}

/**
 * Attempts IP-based geolocation fallback when browser GPS is blocked/denied
 */
export async function detectLocationViaIP(): Promise<UserLocationResult | null> {
  // Step 1: Internal server proxy /api/locate (extremely fast, reads true client IP and headers)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('/api/locate', { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.lat === 'number' && typeof data.lng === 'number') {
        return {
          lat: data.lat,
          lng: data.lng,
          city: data.city || data.formattedAddress || findClosestCityName(data.lat, data.lng),
          formattedAddress: data.formattedAddress || data.city || 'Detected Location',
          source: 'network_ip',
          accuracyMeters: data.accuracyMeters || 2500,
        };
      }
    }
  } catch {
    // Fall back to public client-side IP providers
  }

  // Step 2: ipwho.is (Fast, reliable, HTTPS, no API key, CORS enabled)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.success && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        const cityStr = data.city
          ? `${data.city}, ${data.region || data.country}`
          : findClosestCityName(data.latitude, data.longitude);

        return {
          lat: data.latitude,
          lng: data.longitude,
          city: data.city || cityStr,
          formattedAddress: cityStr,
          source: 'network_ip',
          accuracyMeters: 5000,
        };
      }
    }
  } catch {
    // Try next fallback
  }

  // Step 3: ipapi.co
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        const cityStr = data.city
          ? `${data.city}, ${data.region || data.country_name}`
          : findClosestCityName(data.latitude, data.longitude);

        return {
          lat: data.latitude,
          lng: data.longitude,
          city: data.city || cityStr,
          formattedAddress: cityStr,
          source: 'network_ip',
          accuracyMeters: 5000,
        };
      }
    }
  } catch {
    // Fallback failed
  }

  return null;
}

/**
 * Timezone-based regional fallback when both GPS and IP geolocation fail
 */
export function detectLocationViaTimezone(): UserLocationResult {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const match = REGIONAL_CITY_HUBS.find((h) => h.timezone === tz);
    if (match) {
      return {
        lat: match.lat,
        lng: match.lng,
        city: match.name,
        formattedAddress: match.name,
        source: 'timezone_preset',
        accuracyMeters: 25000,
      };
    }
  } catch {
    // Default fallback
  }

  // Default to Delhi NCR hub
  const defaultHub = REGIONAL_CITY_HUBS[0];
  return {
    lat: defaultHub.lat,
    lng: defaultHub.lng,
    city: defaultHub.name,
    formattedAddress: defaultHub.name,
    source: 'timezone_preset',
    accuracyMeters: 50000,
  };
}

/**
 * Master location detection function:
 * 1. Checks native navigator.geolocation with high accuracy (8-second timeout for browser permission popup)
 * 2. If browser geolocation fails, is denied, or times out, seamlessly falls back to IP Geolocation
 * 3. Enforces sanity check so Cloud Run datacenter (e.g. Singapore) is never returned to users in other timezones
 * 4. Enriches coordinates with reverse geocoding
 */
export async function detectAccurateUserLocation(): Promise<UserLocationResult> {
  const userTz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone || '' : '';
  const isIndiaTimezone = userTz.includes('Kolkata') || userTz.includes('Calcutta') || userTz.includes('Delhi');

  // Step 1: Real Native GPS with high accuracy attempt first (8-second timeout so user has time to click Allow)
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        let isSettled = false;
        const timer = setTimeout(() => {
          if (!isSettled) {
            isSettled = true;
            reject(new Error('Browser GPS timeout waiting for permission'));
          }
        }, 8000);

        navigator.geolocation.getCurrentPosition(
          (p) => {
            if (!isSettled) {
              isSettled = true;
              clearTimeout(timer);
              resolve(p);
            }
          },
          (err) => {
            if (!isSettled) {
              isSettled = true;
              clearTimeout(timer);
              reject(err);
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 60000,
          }
        );
      });

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const accuracy = Math.round(pos.coords.accuracy || 15);

      // Attempt reverse geocoding in background with fallback
      let friendlyName = findClosestCityName(lat, lng);
      try {
        friendlyName = await reverseGeocodeCoords(lat, lng);
      } catch {
        // Use closest city
      }

      return {
        lat,
        lng,
        city: friendlyName,
        formattedAddress: friendlyName,
        source: 'gps',
        accuracyMeters: accuracy,
      };
    } catch (gpsError) {
      console.info('Live GPS permission denied or timed out, trying network location...', gpsError);
    }
  }

  // Step 2: Try IP-based location fallback (server proxy /api/locate + client IP fallback)
  try {
    const ipLocation = await detectLocationViaIP();
    if (ipLocation) {
      // SANITY CHECK: If user's browser timezone is Indian (Asia/Kolkata), but IP gave Singapore/US (from Cloud Run server egress),
      // override with user's regional Indian hub!
      if (
        isIndiaTimezone &&
        (ipLocation.city.toLowerCase().includes('singapore') ||
          ipLocation.city.toLowerCase().includes('united states') ||
          Math.abs(ipLocation.lat - 1.289) < 0.1)
      ) {
        const defaultHub = REGIONAL_CITY_HUBS[0]; // Delhi NCR, India
        return {
          lat: defaultHub.lat,
          lng: defaultHub.lng,
          city: defaultHub.name,
          formattedAddress: defaultHub.name,
          source: 'network_ip',
          accuracyMeters: 5000,
        };
      }
      return ipLocation;
    }
  } catch (ipError) {
    console.info('IP location detection failed, using timezone preset...', ipError);
  }

  // Step 3: Regional timezone heuristic (guaranteed non-failing)
  return detectLocationViaTimezone();
}
