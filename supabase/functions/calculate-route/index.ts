import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Pricing configuration
const PRICING_CONFIG = {
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
};

// Product type multipliers
const PRODUCT_TYPE_MULTIPLIERS = {
  'froid': 1.5,  // Cold products require special handling
  'fragile': 1.3,  // Fragile items need extra care
  'nourriture': 1.2,  // Food items
  'colis': 1.0,  // Standard parcels
  'documents': 0.9,  // Documents are lighter and simpler
};

// Weight-based pricing (per kg)
const WEIGHT_PER_KG = 0.5;

interface RouteRequest {
  pointA: string;
  pointB: string;
  serviceLevel: 'express' | 'standard' | 'economy';
  weight?: number;
  productType?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pointA, pointB, serviceLevel = 'standard', weight = 0, productType = 'colis' }: RouteRequest = await req.json();

    console.log(`Calculating route from ${pointA} to ${pointB} with service level ${serviceLevel}`);

    if (!pointA || !pointB) {
      throw new Error('Both pointA and pointB are required');
    }

    // Geocode addresses using OpenRouteService (free tier, no API key needed for basic usage)
    const geocodeA = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pointA)}&limit=1`,
      {
        headers: {
          'User-Agent': 'AtlasExpress-Delivery-App',
        },
      }
    );
    
    const geocodeB = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pointB)}&limit=1`,
      {
        headers: {
          'User-Agent': 'AtlasExpress-Delivery-App',
        },
      }
    );

    const locationsA = await geocodeA.json();
    const locationsB = await geocodeB.json();

    if (!locationsA.length || !locationsB.length) {
      throw new Error('Unable to geocode one or both addresses');
    }

    const coordsA = [parseFloat(locationsA[0].lon), parseFloat(locationsA[0].lat)];
    const coordsB = [parseFloat(locationsB[0].lon), parseFloat(locationsB[0].lat)];

    console.log(`Geocoded coordinates: A=${coordsA}, B=${coordsB}`);

    // Calculate route using OpenRouteService (free public API)
    const routeResponse = await fetch(
      'https://api.openrouteservice.org/v2/directions/driving-car',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          coordinates: [coordsA, coordsB],
        }),
      }
    );

    if (!routeResponse.ok) {
      // Fallback to simple Haversine distance calculation if routing fails
      console.log('Routing API failed, using Haversine distance');
      const distance = calculateHaversineDistance(coordsA[1], coordsA[0], coordsB[1], coordsB[0]);
      const duration = (distance / 50) * 60; // Assume 50 km/h average speed
      
      const pricing = PRICING_CONFIG[serviceLevel];
      const price = calculatePrice(distance, duration, pricing, weight, productType);

      return new Response(
        JSON.stringify({
          distance: Math.round(distance * 100) / 100,
          duration: Math.round(duration),
          price: Math.round(price * 100) / 100,
          price_breakdown: {
            base: pricing.base,
            per_km: pricing.per_km,
            per_min: pricing.per_min,
            multiplier: pricing.multiplier,
            weight_charge: Math.round(weight * WEIGHT_PER_KG * 100) / 100,
            product_type_multiplier: PRODUCT_TYPE_MULTIPLIERS[productType as keyof typeof PRODUCT_TYPE_MULTIPLIERS] || 1.0,
          },
          service_level: serviceLevel,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const routeData = await routeResponse.json();
    const route = routeData.routes[0];
    
    // Distance in kilometers
    const distanceKm = route.summary.distance / 1000;
    // Duration in minutes
    const durationMin = route.summary.duration / 60;

    console.log(`Route calculated: ${distanceKm} km, ${durationMin} minutes`);

    // Calculate price based on service level
    const pricing = PRICING_CONFIG[serviceLevel];
    const price = calculatePrice(distanceKm, durationMin, pricing, weight, productType);

    return new Response(
      JSON.stringify({
        distance: Math.round(distanceKm * 100) / 100,
        duration: Math.round(durationMin),
        price: Math.round(price * 100) / 100,
        price_breakdown: {
          base: pricing.base,
          per_km: pricing.per_km,
          per_min: pricing.per_min,
          multiplier: pricing.multiplier,
          weight_charge: Math.round(weight * WEIGHT_PER_KG * 100) / 100,
          product_type_multiplier: PRODUCT_TYPE_MULTIPLIERS[productType as keyof typeof PRODUCT_TYPE_MULTIPLIERS] || 1.0,
        },
        service_level: serviceLevel,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error calculating route:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function calculatePrice(
  distanceKm: number,
  durationMin: number,
  pricing: typeof PRICING_CONFIG.standard,
  weight: number,
  productType: string
): number {
  const basePrice = pricing.base;
  const distancePrice = distanceKm * pricing.per_km;
  const timePrice = durationMin * pricing.per_min;
  const weightPrice = weight * WEIGHT_PER_KG;
  
  const subtotal = basePrice + distancePrice + timePrice + weightPrice;
  const productMultiplier = PRODUCT_TYPE_MULTIPLIERS[productType as keyof typeof PRODUCT_TYPE_MULTIPLIERS] || 1.0;
  
  return subtotal * pricing.multiplier * productMultiplier;
}

function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
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
