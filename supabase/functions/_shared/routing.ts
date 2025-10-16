const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";
const ROUTING_URL = "https://api.openrouteservice.org/v2/directions/driving-car";
const USER_AGENT = "SwiftFareFinder/1.0 (+https://atlasexpress.dz)";

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface RouteSummary {
  distanceKm: number;
  durationMin: number;
  usedFallback: boolean;
}

export async function geocodeAddress(address: string): Promise<Coordinates> {
  const response = await fetch(
    `${NOMINATIM_BASE_URL}?format=json&q=${encodeURIComponent(address)}&limit=1`,
    {
      headers: {
        "User-Agent": USER_AGENT,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Unable to geocode address: ${address}`);
  }

  const locations = await response.json();

  if (!Array.isArray(locations) || locations.length === 0) {
    throw new Error(`No geocoding results for address: ${address}`);
  }

  const [location] = locations;
  const lat = Number.parseFloat(location.lat);
  const lon = Number.parseFloat(location.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error(`Invalid coordinates returned for address: ${address}`);
  }

  return { lat, lon };
}

export async function getRouteSummary(
  pointA: Coordinates,
  pointB: Coordinates,
): Promise<RouteSummary> {
  const fallback = (): RouteSummary => {
    const distance = calculateHaversineDistance(pointA.lat, pointA.lon, pointB.lat, pointB.lon);
    const duration = (distance / 50) * 60; // Assume 50 km/h average speed

    return {
      distanceKm: distance,
      durationMin: duration,
      usedFallback: true,
    };
  };

  try {
    const apiKey = Deno.env.get("OPENROUTESERVICE_API_KEY");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (apiKey) {
      headers.Authorization = apiKey;
    }

    const response = await fetch(ROUTING_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        coordinates: [
          [pointA.lon, pointA.lat],
          [pointB.lon, pointB.lat],
        ],
      }),
    });

    if (!response.ok) {
      console.warn("Routing API failed, using fallback distance", await response.text());
      return fallback();
    }

    const routeData = await response.json();
    const route = routeData?.routes?.[0];

    if (!route || !route.summary) {
      console.warn("Routing API returned unexpected payload", routeData);
      return fallback();
    }

    return {
      distanceKm: route.summary.distance / 1000,
      durationMin: route.summary.duration / 60,
      usedFallback: false,
    };
  } catch (error) {
    console.error("Failed to retrieve route. Falling back to haversine distance.", error);
    return fallback();
  }
}

function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
