"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
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
          <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Real-time</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Price Control */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="price-slider" className="flex items-center gap-2 text-sm font-medium">
              <DollarSign className="h-4 w-4 text-blue-500" />
              Current Price
            </Label>
            <Badge className="font-mono text-sm px-3 py-1 bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300">{formatCurrency(price)}</Badge>
          </div>
          <div className="px-1">
            <Slider
              value={price}
              onChange={onPriceChange}
              min={25}
              max={150}
              step={1}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 border-0 shadow-lg w-5 h-5"
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
          <Select value={segment} onChange={(v: string) => onSegmentChange(v as "low" | "med" | "high") }>
            <SelectTrigger>
              <SelectValue>{segment}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Sensitivity</SelectItem>
              <SelectItem value="med">Medium Sensitivity</SelectItem>
              <SelectItem value="high">High Sensitivity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Competitor Price */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="competitor-slider" className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              Competitor Price
            </Label>
            <Badge className="font-mono text-sm px-3 py-1 bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-300">{formatCurrency(competitorPrice)}</Badge>
          </div>
          <div className="px-1">
            <Slider
              value={competitorPrice}
              onChange={onCompetitorPriceChange}
              min={20}
              max={200}
              step={1}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 border-0 shadow-lg w-5 h-5"
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
            <Label htmlFor="cost-slider" className="flex items-center gap-2 text-sm font-medium">
              <Percent className="h-4 w-4 text-green-500" />
              Cost (% of price)
            </Label>
            <Badge className="font-mono text-sm px-3 py-1 bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300">{costPct}%</Badge>
          </div>
          <div className="px-1">
            <Slider
              value={costPct}
              onChange={onCostPctChange}
              min={0}
              max={80}
              step={1}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 border-0 shadow-lg w-5 h-5"
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
          <Select value={thresholdMode} onChange={(v: string) => onThresholdModeChange(v as ThresholdMode)}>
            <SelectTrigger>
              <SelectValue>{thresholdMode}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global Average</SelectItem>
              <SelectItem value="derived">Derived (Default)</SelectItem>
              <SelectItem value="per-segment">Per Segment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Save Scenario */}
        <div className="pt-6 border-t border-gradient-to-r from-transparent via-border to-transparent">
          <Button
            onClick={onSaveScenario}
            disabled={scenariosCount >= 5}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
