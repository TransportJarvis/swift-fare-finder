import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.4";

import {
  corsHeaders,
  normalizeProductType,
  normalizeServiceLevel,
  normalizeWeight,
  calculatePrice,
  geocodeAddress,
  getRouteSummary,
  PRICING_CONFIG,
  PRODUCT_TYPE_MULTIPLIERS,
  WEIGHT_PER_KG,
  ServiceLevel,
  ProductType,
} from "../_shared/pricing.ts";

interface SubmitBookingPayload {
  pointA: string;
  pointB: string;
  serviceLevel?: string;
  weight?: number | string;
  productType?: string;
  remarks?: string | null;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables for submit-booking-request function');
}

const supabase = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!supabase) {
      throw new Error('Supabase client is not configured');
    }

    const payload: SubmitBookingPayload = await req.json();
    const { pointA, pointB, serviceLevel, weight, productType, remarks } = payload;

    if (!pointA || !pointA.trim() || !pointB || !pointB.trim()) {
      throw new Error('Both pointA and pointB are required');
    }

    const normalizedServiceLevel: ServiceLevel = normalizeServiceLevel(serviceLevel);
    const normalizedProductType: ProductType = normalizeProductType(productType);
    const sanitizedWeight = normalizeWeight(weight);

    const coordsA = await geocodeAddress(pointA);
    const coordsB = await geocodeAddress(pointB);

    const routeSummary = await getRouteSummary(coordsA, coordsB);
    const distanceRounded = Math.round(routeSummary.distanceKm * 100) / 100;
    const durationRounded = Math.round(routeSummary.durationMin);

    const price = calculatePrice(
      routeSummary.distanceKm,
      routeSummary.durationMin,
      normalizedServiceLevel,
      sanitizedWeight,
      normalizedProductType,
    );
    const priceRounded = Math.round(price * 100) / 100;

    const pricing = PRICING_CONFIG[normalizedServiceLevel];
    const weightCharge = Math.round(sanitizedWeight * WEIGHT_PER_KG * 100) / 100;

    const { data, error } = await supabase
      .from('booking_requests')
      .insert({
        point_a: pointA.trim(),
        point_b: pointB.trim(),
        weight: sanitizedWeight,
        product_type: normalizedProductType,
        service_level: normalizedServiceLevel,
        remarks: remarks?.trim() ? remarks.trim() : null,
        distance_km: distanceRounded,
        duration_min: durationRounded,
        price_total: priceRounded,
        price_breakdown: {
          base: pricing.base,
          per_km: pricing.per_km,
          per_min: pricing.per_min,
          multiplier: pricing.multiplier,
          weight_charge: weightCharge,
          product_type_multiplier: PRODUCT_TYPE_MULTIPLIERS[normalizedProductType],
        },
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        message: 'Booking request stored successfully',
        booking_request: data,
        quote: {
          distance: distanceRounded,
          duration: durationRounded,
          price: priceRounded,
        },
      }),
      {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error submitting booking request:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
