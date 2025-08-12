import fixtures from "./fixtures.json";

// Re-export types for simulator use
export type SegmentKey = "low" | "med" | "high";

export interface FixturePoint {
  price: number;
  demand_low: number;
  demand_med: number;
  demand_high: number;
  vanWestendorp: {
    tooCheap: number;
    cheap: number;
    expensive: number;
    tooExpensive: number;
  };
}

// Local copy of fixture data (shared JSON) – if needed later, can decouple
const data = fixtures as FixturePoint[];

export function getDemand(
  price: number,
  segment: SegmentKey,
  compPrice: number,
): number {
  const sorted = [...data].sort((a, b) => a.price - b.price);
  const base = (() => {
    if (price <= sorted[0].price)
      return sorted[0][`demand_${segment}` as const];
    if (price >= sorted[sorted.length - 1].price)
      return sorted[sorted.length - 1][`demand_${segment}` as const];
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i];
      const b = sorted[i + 1];
      if (price >= a.price && price <= b.price) {
        const t = (price - a.price) / (b.price - a.price);
        const av = a[`demand_${segment}` as const];
        const bv = b[`demand_${segment}` as const];
        return av + t * (bv - av);
      }
    }
    return sorted[0][`demand_${segment}` as const];
  })();
  const elasticity: Record<SegmentKey, number> = {
    low: 0.2,
    med: 0.35,
    high: 0.55,
  };
  const e = elasticity[segment];
  const rel = compPrice > 0 ? (compPrice - price) / compPrice : 0;
  const k = 2.0;
  const smooth = Math.tanh(rel * k);
  const factor = Math.max(0.6, Math.min(1.5, 1 + e * smooth));
  return base * factor;
}

export function calcRevenue(
  price: number,
  segment: SegmentKey,
  compPrice: number,
): number {
  return price * getDemand(price, segment, compPrice);
}

export function calcProfit(
  price: number,
  segment: SegmentKey,
  compPrice: number,
  costPct: number,
): number {
  const demand = getDemand(price, segment, compPrice);
  const unitCost = price * (costPct / 100);
  const unitProfit = price - unitCost;
  return unitProfit * demand;
}

export function findPeak(
  fn: (p: number) => number,
  min: number,
  max: number,
  step = 1,
): { price: number; value: number } {
  let best = { price: min, value: fn(min) };
  for (let p = min + step; p <= max; p += step) {
    const v = fn(p);
    if (v > best.value) best = { price: p, value: v };
  }
  return best;
}

export function aggregateVW() {
  // Average VW thresholds across fixtures for contextual overlays
  const tooCheap =
    data.reduce((s, d) => s + d.vanWestendorp.tooCheap, 0) / data.length;
  const cheap =
    data.reduce((s, d) => s + d.vanWestendorp.cheap, 0) / data.length;
  const expensive =
    data.reduce((s, d) => s + d.vanWestendorp.expensive, 0) / data.length;
  const tooExpensive =
    data.reduce((s, d) => s + d.vanWestendorp.tooExpensive, 0) / data.length;
  return { tooCheap, cheap, expensive, tooExpensive };
}

/**
 * Compute pragmatic PMC / OPP / PME thresholds blending Van Westendorp averages
 * with the modeled profit peak for the current competitive & cost context.
 *
 * - PMC approximated as the average 'cheap' threshold (lower acceptable bound)
 * - PME approximated as the average 'expensive' threshold (upper acceptable bound)
 * - OPP starts at profit maximizing price then is clamped inside [PMC, PME]
 *
 * This keeps OPP economically grounded (actual max profit) while respecting
 * perceived acceptable value band from survey-based VW data.
 */
export type ThresholdMode = "global" | "derived" | "per-segment";

export function computeThresholds(
  segment: SegmentKey,
  competitorPrice: number,
  costPct: number,
  priceMin = 20,
  priceMax = 200,
  mode: ThresholdMode = "derived",
): {
  pmc: number;
  opp: number;
  pme: number;
  meta: {
    peakProfitPrice: number;
    vw: ReturnType<typeof aggregateVW>;
    segmentFactor: number;
    competitorShift: number;
    adjusted: { cheap: number; expensive: number };
  };
} {
  const vwBase = aggregateVW();
  let cheap = vwBase.cheap;
  let expensive = vwBase.expensive;

  // Elasticity map reused for derived adjustments
  const elasticity: Record<SegmentKey, number> = {
    low: 0.2,
    med: 0.35,
    high: 0.55,
  };

  // Mode logic
  if (mode === "derived") {
    const eMed = elasticity.med;
    const eSeg = elasticity[segment];
    const rel = (eSeg - eMed) / eMed; // high sensitivity => positive rel
    const clamp = (v: number, min: number, max: number) =>
      Math.min(max, Math.max(min, v));
    const a = 0.35; // cheap sensitivity
    const b = 0.45; // expensive sensitivity
    const cheapScale = 1 - clamp(rel * a, -0.25, 0.25);
    const expScale = 1 - clamp(rel * b, -0.3, 0.3);
    cheap = cheap * cheapScale;
    expensive = expensive * expScale;
  } else if (mode === "per-segment") {
    // Placeholder: if real per-segment VW data existed we would aggregate per segment.
    // For now treat as derived but with stronger scaling to accentuate differences.
    const eMed = elasticity.med;
    const eSeg = elasticity[segment];
    const rel = (eSeg - eMed) / eMed;
    const clamp = (v: number, min: number, max: number) =>
      Math.min(max, Math.max(min, v));
    const a = 0.5;
    const b = 0.6;
    const cheapScale = 1 - clamp(rel * a, -0.35, 0.35);
    const expScale = 1 - clamp(rel * b, -0.4, 0.4);
    cheap = cheap * cheapScale;
    expensive = expensive * expScale;
  } // global leaves values unchanged

  // Segment weighting: low sensitivity tolerates higher acceptable band, high sensitivity narrows band
  const segmentFactorMap: Record<SegmentKey, number> = {
    low: 0.05,
    med: 0,
    high: -0.05,
  };
  const segmentFactor = segmentFactorMap[segment];

  // Competitor influence: if competitor markedly cheaper / more expensive shift band modestly
  // Shift expressed as percentage of midpoint
  const mid = (cheap + expensive) / 2;
  const relDiff = (competitorPrice - mid) / mid; // >0 competitor more expensive
  // Cap relative shift effect
  const competitorShift = Math.max(-0.07, Math.min(0.07, relDiff * 0.15));

  // Apply adjustments
  const cheapAdj = cheap * (1 + segmentFactor + competitorShift * -0.5); // if competitor higher, band can widen upward, we slightly raise cheap boundary
  const expensiveAdj = expensive * (1 + segmentFactor + competitorShift * 0.5); // if competitor higher, raise expensive boundary more

  // Ensure ordering and bounds
  const adjCheap = Math.max(priceMin, Math.min(cheapAdj, expensiveAdj - 1));
  const adjExpensive = Math.min(priceMax, Math.max(expensiveAdj, adjCheap + 1));

  // Profit peak across a 1-unit grid for accuracy
  const peak = findPeak(
    (p) => calcProfit(p, segment, competitorPrice, costPct),
    priceMin,
    priceMax,
    1,
  );

  // Clamp OPP to perceived acceptable band (adjusted)
  const opp = Math.min(Math.max(peak.price, adjCheap), adjExpensive);
  const pmc = adjCheap;
  const pme = adjExpensive;

  return {
    pmc,
    opp,
    pme,
    meta: {
      peakProfitPrice: peak.price,
      vw: vwBase,
      segmentFactor,
      competitorShift,
      adjusted: { cheap: pmc, expensive: pme },
    },
  };
}
