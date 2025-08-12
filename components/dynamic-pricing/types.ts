export interface Scenario {
  id: string;
  label: string;
  price: number;
  segment: "low" | "med" | "high";
  competitorPrice: number;
  costPct: number;
  revenue: number;
  profit: number;
  thresholdMode?: ThresholdMode;
  pmc?: number;
  opp?: number;
  pme?: number;
}

export interface PeakPoint {
  price: number;
  value: number;
}

export interface ControlsProps {
  price: number;
  onPriceChange: (v: number) => void;
  segment: "low" | "med" | "high";
  onSegmentChange: (s: "low" | "med" | "high") => void;
  competitorPrice: number;
  onCompetitorPriceChange: (v: number) => void;
  costPct: number;
  onCostPctChange: (v: number) => void;
  onSaveScenario: () => void;
  scenariosCount: number;
  thresholdMode: ThresholdMode;
  onThresholdModeChange: (m: ThresholdMode) => void;
}

export type ThresholdMode = "global" | "derived" | "per-segment";

export interface ChartProps {
  prices: number[];
  revenue: number[];
  profit: number[];
  pmc: number;
  opp: number;
  pme: number;
  peakRevenue: PeakPoint;
  peakProfit: PeakPoint;
  ariaLabel?: string;
  thresholdMeta?: {
    peakProfitPrice: number;
    vw: {
      tooCheap: number;
      cheap: number;
      expensive: number;
      tooExpensive: number;
    };
    segmentFactor: number;
    competitorShift: number;
    adjusted: { cheap: number; expensive: number };
  };
}

export interface InsightsProps {
  currentPrice: number;
  currentRevenue: number;
  currentProfit: number;
  opp: number;
  rangeHint: string;
  competitionHint: string;
}

export interface ScenarioTableProps {
  scenarios: Scenario[];
  onLoadScenario: (id: string) => void;
  onDeleteScenario: (id: string) => void;
}

export interface PricingData {
  prices: number[];
  revenue: number[];
  profit: number[];
  pmc: number;
  opp: number;
  pme: number;
  thresholdMeta?: {
    peakProfitPrice: number;
    vw: {
      tooCheap: number;
      cheap: number;
      expensive: number;
      tooExpensive: number;
    };
    segmentFactor: number;
    competitorShift: number;
    adjusted: { cheap: number; expensive: number };
  };
  thresholdMode: ThresholdMode;
}
