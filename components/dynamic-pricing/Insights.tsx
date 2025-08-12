"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Alert,
  AlertDescription,
} from "@gabe/components";
import { TrendingUp, Target, Users } from "lucide-react";
import type { InsightsProps } from "./types";
import { formatCurrency } from "./utils";

export function Insights({
  currentPrice,
  currentRevenue,
  currentProfit,
  opp,
  rangeHint,
  competitionHint,
}: InsightsProps) {
  const isOptimal = Math.abs(currentPrice - opp) <= 10;

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Performance */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Current Performance
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(currentRevenue)}
              </div>
              <div className="text-xs text-muted-foreground">Revenue</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatCurrency(currentProfit)}
              </div>
              <div className="text-xs text-muted-foreground">Profit</div>
            </div>
          </div>
        </div>

        {/* Price Position */}
        <div className="space-y-3">
          <h4 className="font-medium">Price Position</h4>
          <div className="flex items-center gap-2">
            <Badge variant={isOptimal ? "default" : "secondary"}>
              {isOptimal ? "Within optimal range" : "Outside optimal range"}
            </Badge>
          </div>
          <Alert>
            <AlertDescription className="text-sm">{rangeHint}</AlertDescription>
          </Alert>
        </div>

        {/* Competition Analysis */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Users className="w-4 h-4" />
            Competition
          </h4>
          <Alert>
            <AlertDescription className="text-sm">
              {competitionHint}
            </AlertDescription>
          </Alert>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Quick Actions</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Try price {formatCurrency(opp)} for optimal positioning</p>
            <p>• Compare with saved scenarios below</p>
            <p>• Adjust segment sensitivity for different markets</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
