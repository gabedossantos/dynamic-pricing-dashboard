"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Slider,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Badge,
  Label,
} from "@gabe/components";
import { Save, TrendingUp, Target, DollarSign, Percent } from "lucide-react";
import type { ControlsProps, ThresholdMode } from "./types";
import { formatCurrency } from "./utils";

export function Controls({
  price,
  onPriceChange,
  segment,
  onSegmentChange,
  competitorPrice,
  onCompetitorPriceChange,
  costPct,
  onCostPctChange,
  onSaveScenario,
  scenariosCount,
  thresholdMode,
  onThresholdModeChange,
}: ControlsProps) {
  return (
    <Card className="h-fit sticky top-6 bg-gradient-to-br from-background to-muted/20 border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          Live Controls
          <Badge
            variant="secondary"
            className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
          >
            Real-time
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Price Control */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="price-slider"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <DollarSign className="h-4 w-4 text-blue-500" />
              Current Price
            </Label>
            <Badge
              variant="outline"
              className="font-mono text-sm px-3 py-1 bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300"
            >
              {formatCurrency(price)}
            </Badge>
          </div>
          <div className="px-1">
            <Slider
              id="price-slider"
              min={25}
              max={150}
              step={1}
              value={[price]}
              onValueChange={([value]) => onPriceChange(value)}
              className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-blue-500 [&_[role=slider]]:to-purple-500 [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-lg [&_[role=slider]]:w-5 [&_[role=slider]]:h-5"
              aria-label="Current price"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>$25</span>
              <span>$150</span>
            </div>
          </div>
        </div>

        {/* Segment Selection */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Target className="h-4 w-4 text-purple-500" />
            Market Segment
          </Label>
          <Select value={segment} onValueChange={onSegmentChange}>
            <SelectTrigger className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 dark:from-purple-950 dark:to-pink-950 dark:border-purple-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Low Sensitivity</div>
                    <div className="text-xs text-muted-foreground">
                      Premium customers
                    </div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="med">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Medium Sensitivity</div>
                    <div className="text-xs text-muted-foreground">
                      Balanced buyers
                    </div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">High Sensitivity</div>
                    <div className="text-xs text-muted-foreground">
                      Price-conscious
                    </div>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Competitor Price */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="competitor-slider"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <TrendingUp className="h-4 w-4 text-orange-500" />
              Competitor Price
            </Label>
            <Badge
              variant="outline"
              className="font-mono text-sm px-3 py-1 bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-300"
            >
              {formatCurrency(competitorPrice)}
            </Badge>
          </div>
          <div className="px-1">
            <Slider
              id="competitor-slider"
              min={20}
              max={200}
              step={1}
              value={[competitorPrice]}
              onValueChange={([value]) => onCompetitorPriceChange(value)}
              className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-orange-500 [&_[role=slider]]:to-red-500 [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-lg [&_[role=slider]]:w-5 [&_[role=slider]]:h-5"
              aria-label="Competitor average price"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>$20</span>
              <span>$200</span>
            </div>
          </div>
        </div>

        {/* Cost Percentage - Now a Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="cost-slider"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Percent className="h-4 w-4 text-green-500" />
              Cost (% of price)
            </Label>
            <Badge
              variant="outline"
              className="font-mono text-sm px-3 py-1 bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300"
            >
              {costPct}%
            </Badge>
          </div>
          <div className="px-1">
            <Slider
              id="cost-slider"
              min={0}
              max={80}
              step={1}
              value={[costPct]}
              onValueChange={([value]) => onCostPctChange(value)}
              className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-green-500 [&_[role=slider]]:to-emerald-500 [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-lg [&_[role=slider]]:w-5 [&_[role=slider]]:h-5"
              aria-label="Cost as percentage of price"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>0%</span>
              <span>80%</span>
            </div>
          </div>
        </div>

        {/* Threshold Mode Selector */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Target className="h-4 w-4 text-indigo-500" />
            Threshold Strategy
          </Label>
          <Select
            value={thresholdMode}
            onValueChange={(v) => onThresholdModeChange(v as ThresholdMode)}
          >
            <SelectTrigger className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 dark:from-indigo-950 dark:to-blue-950 dark:border-indigo-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="font-medium">Global Average</span>
                  <span className="text-xs text-muted-foreground">
                    One VW band for all segments
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="derived">
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="font-medium">Derived (Default)</span>
                  <span className="text-xs text-muted-foreground">
                    Elasticity-based scaling
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="per-segment">
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="font-medium">Per Segment</span>
                  <span className="text-xs text-muted-foreground">
                    Stronger cohort differentiation
                  </span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Save Scenario */}
        <div className="pt-6 border-t border-gradient-to-r from-transparent via-border to-transparent">
          <Button
            onClick={onSaveScenario}
            disabled={scenariosCount >= 5}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Scenario ({scenariosCount}/5)
          </Button>
          {scenariosCount >= 5 && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Maximum scenarios reached. Delete one to save more.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
