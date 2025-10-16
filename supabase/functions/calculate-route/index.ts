import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  PRICING_CONFIG,
  PRODUCT_TYPE_MULTIPLIERS,
  WEIGHT_PER_KG,
  corsHeaders,
  normalizeProductType,
  normalizeServiceLevel,
  normalizeWeight,
  calculatePrice,
  geocodeAddress,
  getRouteSummary,
  ServiceLevel,
  ProductType,
} from "../_shared/pricing.ts";

interface RouteRequest {
  pointA: string;
  pointB: string;
  serviceLevel?: string;
  weight?: number | string;
  productType?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pointA, pointB, serviceLevel, weight, productType }: RouteRequest = await req.json();

    if (!pointA || !pointA.trim() || !pointB || !pointB.trim()) {
      throw new Error('Both pointA and pointB are required');
    }

    const normalizedServiceLevel: ServiceLevel = normalizeServiceLevel(serviceLevel);
    const normalizedProductType: ProductType = normalizeProductType(productType);
    const sanitizedWeight = normalizeWeight(weight);

    console.log(
      `Calculating route from ${pointA} to ${pointB} with service level ${normalizedServiceLevel}`,
    );

    const coordsA = await geocodeAddress(pointA);
    const coordsB = await geocodeAddress(pointB);

    console.log(`Geocoded coordinates: A=${coordsA}, B=${coordsB}`);

    const routeSummary = await getRouteSummary(coordsA, coordsB);

    const distanceKm = routeSummary.distanceKm;
    const durationMin = routeSummary.durationMin;

    console.log(`Route calculated: ${distanceKm} km, ${durationMin} minutes`);

    // Calculate price based on service level
    const pricing = PRICING_CONFIG[normalizedServiceLevel];
    const price = calculatePrice(
      distanceKm,
      durationMin,
      normalizedServiceLevel,
      sanitizedWeight,
      normalizedProductType,
    );

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
          weight_charge: Math.round(sanitizedWeight * WEIGHT_PER_KG * 100) / 100,
          product_type_multiplier: PRODUCT_TYPE_MULTIPLIERS[normalizedProductType],
        },
        service_level: normalizedServiceLevel,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error calculating route:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
