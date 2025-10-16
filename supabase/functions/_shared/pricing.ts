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

export type ServiceLevel = keyof typeof PRICING_CONFIG;

export const PRODUCT_TYPE_MULTIPLIERS = {
  froid: 1.5,
  fragile: 1.3,
  nourriture: 1.2,
  colis: 1.0,
  documents: 0.9,
} as const;

export const WEIGHT_PER_KG = 0.5;

export interface PriceBreakdown {
  base: number;
  per_km: number;
  per_min: number;
  multiplier: number;
  weight_charge: number;
  product_type_multiplier: number;
}

export interface PricingResult {
  total: number;
  breakdown: PriceBreakdown;
}

function normalizeWeight(weight: number): number {
  if (!Number.isFinite(weight)) {
    return 0;
  }

  return Math.max(0, weight);
}

export function assertValidServiceLevel(serviceLevel: string): asserts serviceLevel is ServiceLevel {
  if (!(serviceLevel in PRICING_CONFIG)) {
    throw new Error(`Invalid service level: ${serviceLevel}`);
  }
}

export function calculatePricing(
  distanceKm: number,
  durationMin: number,
  serviceLevel: ServiceLevel,
  weight: number,
  productType: string,
): PricingResult {
  const pricing = PRICING_CONFIG[serviceLevel];
  const normalizedWeight = normalizeWeight(weight);

  const distancePrice = distanceKm * pricing.per_km;
  const timePrice = durationMin * pricing.per_min;
  const weightCharge = normalizedWeight * WEIGHT_PER_KG;
  const productMultiplier =
    PRODUCT_TYPE_MULTIPLIERS[productType as keyof typeof PRODUCT_TYPE_MULTIPLIERS] ?? 1.0;

  const subtotal = pricing.base + distancePrice + timePrice + weightCharge;
  const total = subtotal * pricing.multiplier * productMultiplier;

  return {
    total,
    breakdown: {
      base: pricing.base,
      per_km: pricing.per_km,
      per_min: pricing.per_min,
      multiplier: pricing.multiplier,
      weight_charge: Math.round(weightCharge * 100) / 100,
      product_type_multiplier: productMultiplier,
    },
  };
}
