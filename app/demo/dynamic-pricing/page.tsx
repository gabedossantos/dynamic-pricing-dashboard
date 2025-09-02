"use client";

import "./layout";
import { useState, useEffect, useMemo } from "react";
import { TestComponent } from "../../components/test";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/mytabs";
import { LayoutShell } from "../../../components/dynamic-pricing/LayoutShell";
import { Controls } from "../../../components/dynamic-pricing/Controls";
import { Chart } from "../../../components/dynamic-pricing/Chart";
import { Insights } from "../../../components/dynamic-pricing/Insights";
import { ScenarioTable } from "../../../components/dynamic-pricing/ScenarioTable";
import type {
  Scenario,
  PricingData,
} from "../../../components/dynamic-pricing/types";
import { formatCurrency } from "../../../components/dynamic-pricing/utils";
import {
  calcRevenue,
  calcProfit,
  findPeak,
  computeThresholds,
  ThresholdMode,
} from "../../../components/dynamic-pricing/engine/calcs";

// TODO: Replace with your actual pricing calculation functions
// import { estimateDemand, calculateRevenue, calculateProfit } from "@/store/pricing";

export default function DynamicPricingPage() {
  // State management
  const [price, setPrice] = useState(80);
  const [segment, setSegment] = useState<"low" | "med" | "high">("med");
  const [competitorPrice, setCompetitorPrice] = useState(85);
  const [costPct, setCostPct] = useState(40);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [thresholdMode, setThresholdMode] = useState<ThresholdMode>("derived");

  // Generate pricing curves using engine (revenue/profit across sampled price range)
  useEffect(() => {
    setLoading(true);
    // Higher resolution sampling for smoother curves (1-step) within visible chart range
    const PRICE_MIN = 25;
    const PRICE_MAX = 150;
    const prices: number[] = [];
    for (let p = PRICE_MIN; p <= PRICE_MAX; p += 1) prices.push(p);

    const revenue = prices.map((p) => calcRevenue(p, segment, competitorPrice));
    const profit = prices.map((p) =>
      calcProfit(p, segment, competitorPrice, costPct),
    );

    // Compute thresholds grounded in VW data & actual profit peak
    const { pmc, opp, pme, meta } = computeThresholds(
      segment,
      competitorPrice,
      costPct,
      PRICE_MIN,
      PRICE_MAX,
      thresholdMode,
    );

    setPricingData({
      prices,
      revenue,
      profit,
      pmc,
      opp,
      pme,
      thresholdMeta: meta,
      thresholdMode,
    });
    setLoading(false);
  }, [segment, competitorPrice, costPct, thresholdMode]);

  // Calculate current metrics with real-time updates
  const currentMetrics = useMemo(() => {
    if (!pricingData) return { revenue: 0, profit: 0 };
    const revenue = calcRevenue(price, segment, competitorPrice);
    const profit = calcProfit(price, segment, competitorPrice, costPct);
    return { revenue, profit };
  }, [price, segment, competitorPrice, costPct, pricingData]);

  // Find peak points
  const peakPoints = useMemo(() => {
    if (!pricingData)
      return {
        peakRevenue: { price: 0, value: 0 },
        peakProfit: { price: 0, value: 0 },
      };
    const peakRevenue = findPeak(
      (p) => calcRevenue(p, segment, competitorPrice),
      25,
      150,
      1,
    );
    const peakProfit = findPeak(
      (p) => calcProfit(p, segment, competitorPrice, costPct),
      25,
      150,
      1,
    );
    return { peakRevenue, peakProfit };
  }, [pricingData, segment, competitorPrice, costPct]);

  // Generate insights
  const insights = useMemo(() => {
    if (!pricingData) return { rangeHint: "", competitionHint: "" };

    const optimalRange = `${formatCurrency(pricingData.opp - 10)}–${formatCurrency(pricingData.opp + 10)}`;
    const rangeHint = `Optimal range ${optimalRange} for ${segment} sensitivity segment`;

    const competitionHint =
      price < competitorPrice
        ? "Priced below competitor - good for market penetration"
        : "Priced above competitor - premium positioning";

    return { rangeHint, competitionHint };
  }, [price, competitorPrice, segment, pricingData]);

  // Scenario management
  const handleSaveScenario = () => {
    if (scenarios.length >= 5 || !pricingData) return;

    const newScenario: Scenario = {
      id: Date.now().toString(),
      label: `Scenario ${scenarios.length + 1}`,
      price,
      segment,
      competitorPrice,
      costPct,
      revenue: currentMetrics.revenue,
      profit: currentMetrics.profit,
      thresholdMode,
      pmc: pricingData.pmc,
      opp: pricingData.opp,
      pme: pricingData.pme,
    };

    setScenarios([...scenarios, newScenario]);
  };

  const handleLoadScenario = (id: string) => {
    const scenario = scenarios.find((s) => s.id === id);
    if (scenario) {
      setPrice(scenario.price);
      setSegment(scenario.segment);
      setCompetitorPrice(scenario.competitorPrice);
      setCostPct(scenario.costPct);
      if (scenario.thresholdMode)
        setThresholdMode(scenario.thresholdMode as ThresholdMode);
    }
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter((s) => s.id !== id));
  };

  if (loading || !pricingData) {
    return (
      <LayoutShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading pricing data...</p>
          </div>
        </div>
      </LayoutShell>
    );
  }

  return (
    <LayoutShell>
      <div className="space-y-6">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls - Left Column */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-6">
              <Controls
                price={price}
                onPriceChange={setPrice}
                segment={segment}
                onSegmentChange={setSegment}
                competitorPrice={competitorPrice}
                onCompetitorPriceChange={setCompetitorPrice}
                costPct={costPct}
                onCostPctChange={setCostPct}
                onSaveScenario={handleSaveScenario}
                scenariosCount={scenarios.length}
                thresholdMode={thresholdMode}
                onThresholdModeChange={setThresholdMode}
              />
            </div>
          </div>

          {/* Chart - Center Column */}
          <div className="lg:col-span-6">
            <Chart
              prices={pricingData.prices}
              revenue={pricingData.revenue}
              profit={pricingData.profit}
              pmc={pricingData.pmc}
              opp={pricingData.opp}
              pme={pricingData.pme}
              peakRevenue={peakPoints.peakRevenue}
              peakProfit={peakPoints.peakProfit}
              thresholdMeta={pricingData.thresholdMeta}
              ariaLabel="Dynamic pricing revenue and profit analysis chart"
            />
          </div>

          {/* Insights - Right Column */}
          <div className="lg:col-span-3">
            <Insights
              currentPrice={price}
              currentRevenue={currentMetrics.revenue}
              currentProfit={currentMetrics.profit}
              opp={pricingData.opp}
              rangeHint={insights.rangeHint}
              competitionHint={insights.competitionHint}
            />
          </div>
        </div>

        {/* Bottom Tabs */}
  <Tabs>
          <TabsList>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios">
            <ScenarioTable
              scenarios={scenarios}
              onLoadScenario={handleLoadScenario}
              onDeleteScenario={handleDeleteScenario}
            />
          </TabsContent>

          <TabsContent value="about">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h3>About the Dynamic Pricing Model</h3>
              <p>
                This simulator uses Van Westendorp Price Sensitivity Meter
                methodology combined with competitive positioning analysis to
                help you find optimal pricing strategies.
              </p>
              <h4>Key Metrics:</h4>
              <ul>
                <li>
                  <strong>PMC (Point of Marginal Cheapness):</strong> Price
                  below which quality concerns arise
                </li>
                <li>
                  <strong>OPP (Optimal Price Point):</strong> Intersection of
                  &quot;not cheap&quot; and &quot;not expensive&quot;
                </li>
                <li>
                  <strong>PME (Point of Marginal Expensiveness):</strong> Price
                  above which value concerns arise
                </li>
              </ul>
              <h4>Threshold Strategies:</h4>
              <ul>
                <li>
                  <strong>Global:</strong> Single VW-derived band applied to all
                  segments.
                </li>
                <li>
                  <strong>Derived (Default):</strong> Adjusts the global band
                  using elasticity-based scaling per segment.
                </li>
                <li>
                  <strong>Per Segment:</strong> Amplifies differentiation (or
                  would use true segment VW data if provided) for clearer cohort
                  separation.
                </li>
              </ul>
              <p>
                The shaded vertical area represents the currently acceptable
                price band (PMC → PME) for the chosen strategy; OPP is clamped
                inside this band to balance economic and perceived value.
              </p>
              <h4>Market Segments:</h4>
              <ul>
                <li>
                  <strong>Low Sensitivity:</strong> Premium customers, less
                  price-conscious
                </li>
                <li>
                  <strong>Medium Sensitivity:</strong> Balanced value seekers
                </li>
                <li>
                  <strong>High Sensitivity:</strong> Price-conscious,
                  budget-focused customers
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </LayoutShell>
  );
}

/*
## How to Wire Your Existing Functions

1. Replace the placeholder calculations in the `currentMetrics` useMemo:
   \`\`\`typescript
   // Replace this:
   const revenue = simpleInterpolator(price, pricingData.prices, pricingData.revenue);
   
   // With your function:
   const revenue = calculateRevenue(price, segment, competitorPrice);
*/
