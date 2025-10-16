import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  assertValidServiceLevel,
  calculatePricing,
  type ServiceLevel,
} from "../_shared/pricing.ts";
import { geocodeAddress, getRouteSummary } from "../_shared/routing.ts";
import { getServiceRoleClient, getUserFromRequest } from "../_shared/supabase-client.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface BookingRequest {
  pointA: string;
  pointB: string;
  serviceLevel?: ServiceLevel | string;
  weight?: number | string;
  productType?: string;
  remarks?: string;
  saveQuoteOnly?: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const user = await getUserFromRequest(req);
    const payload = (await req.json()) as BookingRequest;

    const pointA = payload.pointA?.trim();
    const pointB = payload.pointB?.trim();

    if (!pointA || !pointB) {
      throw new Error("Both pointA and pointB are required");
    }

    const serviceLevel = normalizeServiceLevel(payload.serviceLevel);
    const productType = payload.productType ?? "colis";
    const weight = normalizeWeight(payload.weight);

    console.log(`Creating booking for user ${user.id}`);

    const coordsA = await geocodeAddress(pointA);
    const coordsB = await geocodeAddress(pointB);

    const route = await getRouteSummary(coordsA, coordsB);
    const pricing = calculatePricing(route.distanceKm, route.durationMin, serviceLevel, weight, productType);

    const client = getServiceRoleClient();

    const { data: quote, error: quoteError } = await client
      .from("route_quotes")
      .insert({
        user_id: user.id,
        point_a: pointA,
        point_b: pointB,
        service_level: serviceLevel,
        weight,
        product_type: productType,
        distance: roundToTwo(route.distanceKm),
        duration: Math.round(route.durationMin),
        price_total: roundToTwo(pricing.total),
        price_base: pricing.breakdown.base,
        price_per_km: pricing.breakdown.per_km,
        price_per_min: pricing.breakdown.per_min,
        multiplier: pricing.breakdown.multiplier,
        weight_charge: pricing.breakdown.weight_charge,
        product_type_multiplier: pricing.breakdown.product_type_multiplier,
        used_fallback: route.usedFallback,
      })
      .select("*")
      .single();

    if (quoteError) {
      throw quoteError;
    }

    if (payload.saveQuoteOnly) {
      return new Response(JSON.stringify({ quote }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: booking, error: bookingError } = await client
      .from("bookings")
      .insert({
        user_id: user.id,
        point_a: pointA,
        point_b: pointB,
        weight,
        product_type: productType,
        remarks: payload.remarks?.trim() || null,
        service_level: serviceLevel,
        estimated_distance: roundToTwo(route.distanceKm),
        estimated_duration: Math.round(route.durationMin),
        estimated_price: roundToTwo(pricing.total),
        price_base: pricing.breakdown.base,
        price_per_km: pricing.breakdown.per_km,
        price_per_min: pricing.breakdown.per_min,
        multiplier: pricing.breakdown.multiplier,
        product_type_multiplier: pricing.breakdown.product_type_multiplier,
        weight_charge: pricing.breakdown.weight_charge,
        used_fallback: route.usedFallback,
        status: "pending",
        quote_id: quote.id,
      })
      .select("*")
      .single();

    if (bookingError) {
      throw bookingError;
    }

    return new Response(JSON.stringify({ booking, quote }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error booking delivery:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const normalizedMessage = message.toLowerCase();
    const status = normalizedMessage.includes("authorization")
      ? 401
      : normalizedMessage.includes("environment variable")
      ? 500
      : 400;

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function normalizeServiceLevel(level: BookingRequest["serviceLevel"]): ServiceLevel {
  const normalized = (level ?? "standard").toString().toLowerCase();
  assertValidServiceLevel(normalized);
  return normalized;
}

function normalizeWeight(weight: BookingRequest["weight"]): number {
  const numeric = Number(weight);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  return Math.max(0, numeric);
}

function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}
