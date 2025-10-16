export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const PRICING_CONFIG = {
  express: {
    base: 15,
    per_km: 2.5,
    per_min: 0.5,
    multiplier: 1.5,
  },
  standard: {
    base: 10,
    per_km: 1.5,
    per_min: 0.3,
    multiplier: 1.0,
  },
  economy: {
    base: 5,
    per_km: 1.0,
    per_min: 0.2,
    multiplier: 0.8,
  },
} as const;

export const PRODUCT_TYPE_MULTIPLIERS = {
  froid: 1.5,
  fragile: 1.3,
  nourriture: 1.2,
  colis: 1.0,
  documents: 0.9,
} as const;

export const WEIGHT_PER_KG = 0.5;

export type ServiceLevel = keyof typeof PRICING_CONFIG;
export type ProductType = keyof typeof PRODUCT_TYPE_MULTIPLIERS;

export interface BookingDetails {
  pointA: string;
  pointB: string;
  serviceLevel?: string;
  weight?: number | string;
  productType?: string;
  remarks?: string | null;
}

export interface RouteSummary {
  distanceKm: number;
  durationMin: number;
}

export const SUPPORTED_SERVICE_LEVELS = new Set<ServiceLevel>(
  Object.keys(PRICING_CONFIG) as ServiceLevel[],
);

export const SUPPORTED_PRODUCT_TYPES = new Set<ProductType>(
  Object.keys(PRODUCT_TYPE_MULTIPLIERS) as ProductType[],
);

export function normalizeServiceLevel(value: string | undefined): ServiceLevel {
  const normalized = (value || 'standard').toLowerCase();
  if (SUPPORTED_SERVICE_LEVELS.has(normalized as ServiceLevel)) {
    return normalized as ServiceLevel;
  }

  throw new Error('Invalid service level provided');
}

export function normalizeProductType(value: string | undefined): ProductType {
  const normalized = (value || 'colis').toLowerCase();
  if (SUPPORTED_PRODUCT_TYPES.has(normalized as ProductType)) {
    return normalized as ProductType;
  }

  throw new Error('Invalid product type provided');
}

export function normalizeWeight(value: number | string | undefined): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  return 0;
}

export function calculatePrice(
  distanceKm: number,
  durationMin: number,
  serviceLevel: ServiceLevel,
  weight: number,
  productType: ProductType,
): number {
  const pricing = PRICING_CONFIG[serviceLevel];
  const basePrice = pricing.base;
  const distancePrice = distanceKm * pricing.per_km;
  const timePrice = durationMin * pricing.per_min;
  const weightPrice = Math.max(weight, 0) * WEIGHT_PER_KG;
  const subtotal = basePrice + distancePrice + timePrice + weightPrice;
  const productMultiplier = PRODUCT_TYPE_MULTIPLIERS[productType];

  return subtotal * pricing.multiplier * productMultiplier;
}

export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
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

export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export async function geocodeAddress(query: string): Promise<[number, number]> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'AtlasExpress-Delivery-App',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to geocode address: ${query}`);
  }

  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error(`No results found for address: ${query}`);
  }

  const lon = parseFloat(results[0].lon);
  const lat = parseFloat(results[0].lat);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error(`Invalid coordinates returned for address: ${query}`);
  }

  return [lon, lat];
}

export async function getRouteSummary(
  coordsA: [number, number],
  coordsB: [number, number],
): Promise<RouteSummary> {
  const apiKey = Deno.env.get('OPENROUTESERVICE_API_KEY');

  if (apiKey) {
    try {
      const routeResponse = await fetch(
        'https://api.openrouteservice.org/v2/directions/driving-car',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: apiKey,
          },
          body: JSON.stringify({
            coordinates: [coordsA, coordsB],
          }),
        },
      );

      if (routeResponse.ok) {
        const routeData = await routeResponse.json();
        const route = routeData.routes?.[0];
        if (route?.summary) {
          return {
            distanceKm: route.summary.distance / 1000,
            durationMin: route.summary.duration / 60,
          };
        }
      } else {
        console.warn('OpenRouteService request failed, falling back to OSRM', await routeResponse.text());
      }
    } catch (error) {
      console.warn('OpenRouteService threw an error, falling back to OSRM', error);
    }
  }

  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsA[0]},${coordsA[1]};${coordsB[0]},${coordsB[1]}?overview=false&alternatives=false`;
    const osrmResponse = await fetch(osrmUrl, {
      headers: {
        'User-Agent': 'AtlasExpress-Delivery-App',
      },
    });

    if (osrmResponse.ok) {
      const osrmData = await osrmResponse.json();
      const route = osrmData.routes?.[0];
      if (route) {
        return {
          distanceKm: route.distance / 1000,
          durationMin: route.duration / 60,
        };
      }
    } else {
      console.warn('OSRM request failed, falling back to Haversine', await osrmResponse.text());
    }
  } catch (error) {
    console.warn('OSRM threw an error, falling back to Haversine', error);
  }

  const distanceKm = calculateHaversineDistance(coordsA[1], coordsA[0], coordsB[1], coordsB[0]);
  const durationMin = (distanceKm / 50) * 60;

  return {
    distanceKm,
    durationMin,
  };
}
