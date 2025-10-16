import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  assertValidServiceLevel,
  calculatePricing,
  type ServiceLevel,
} from "../_shared/pricing.ts";
import { geocodeAddress, getRouteSummary } from "../_shared/routing.ts";
import { getServiceRoleClient } from "../_shared/supabase-client.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ProductType = string;

interface RouteRequest {
  pointA: string;
  pointB: string;
  serviceLevel?: ServiceLevel | string;
  weight?: number | string;
  productType?: ProductType;
  saveQuote?: boolean;
  userId?: string | null;
}

interface RouteResponse {
  distance: number;
  duration: number;
  price: number;
  price_breakdown: {
    base: number;
    per_km: number;
    per_min: number;
    multiplier: number;
    weight_charge: number;
    product_type_multiplier: number;
  };
  service_level: ServiceLevel;
  used_fallback: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as RouteRequest;

    const pointA = body.pointA?.trim();
    const pointB = body.pointB?.trim();

    if (!pointA || !pointB) {
      throw new Error("Both pointA and pointB are required");
    }

    const serviceLevel = normalizeServiceLevel(body.serviceLevel);
    const productType = body.productType ?? "colis";
    const weight = normalizeWeight(body.weight);

    console.log(
      `Calculating route from "${pointA}" to "${pointB}" with service level ${serviceLevel}`,
    );

    const coordsA = await geocodeAddress(pointA);
    const coordsB = await geocodeAddress(pointB);

    const route = await getRouteSummary(coordsA, coordsB);
    const pricing = calculatePricing(route.distanceKm, route.durationMin, serviceLevel, weight, productType);

    const responsePayload: RouteResponse = {
      distance: roundToTwo(route.distanceKm),
      duration: Math.round(route.durationMin),
      price: roundToTwo(pricing.total),
      price_breakdown: pricing.breakdown,
      service_level: serviceLevel,
      used_fallback: route.usedFallback,
    };

    if (body.saveQuote || body.userId) {
      await persistQuote({
        userId: body.userId,
        pointA,
        pointB,
        response: responsePayload,
        weight,
        serviceLevel,
        productType,
      });
    }

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error calculating route:", error);
    return new Response(JSON.stringify({ error: error.message ?? "Unknown error" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function normalizeServiceLevel(level: RouteRequest["serviceLevel"]): ServiceLevel {
  const normalized = (level ?? "standard").toString().toLowerCase();
  assertValidServiceLevel(normalized);
  return normalized;
}

function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

function normalizeWeight(weight: RouteRequest["weight"]): number {
  const numeric = Number(weight);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  return Math.max(0, numeric);
}

async function persistQuote({
  userId,
  pointA,
  pointB,
  response,
  weight,
  serviceLevel,
  productType,
}: {
  userId?: string | null;
  pointA: string;
  pointB: string;
  response: RouteResponse;
  weight: number;
  serviceLevel: ServiceLevel;
  productType: ProductType;
}): Promise<void> {
  try {
    const client = getServiceRoleClient();
    await client.from("route_quotes").insert({
      user_id: userId ?? null,
      point_a: pointA,
      point_b: pointB,
      service_level: serviceLevel,
      weight,
      product_type: productType,
      distance: response.distance,
      duration: response.duration,
      price_total: response.price,
      price_base: response.price_breakdown.base,
      price_per_km: response.price_breakdown.per_km,
      price_per_min: response.price_breakdown.per_min,
      multiplier: response.price_breakdown.multiplier,
      weight_charge: response.price_breakdown.weight_charge,
      product_type_multiplier: response.price_breakdown.product_type_multiplier,
      used_fallback: response.used_fallback,
    });
  } catch (error) {
    console.error("Failed to persist route quote", error);
  }
}
