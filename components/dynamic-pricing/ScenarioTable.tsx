"use client";


import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Trash2, Play } from "lucide-react";
import type { ScenarioTableProps } from "./types";
import { formatCurrency } from "./utils";

export function ScenarioTable({ scenarios, onLoadScenario, onDeleteScenario }: ScenarioTableProps) {
  if (scenarios.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-2">No scenarios saved yet</p>
            <p className="text-sm">Save your current settings to compare different pricing strategies</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Scenarios ({scenarios.length}/5)</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile: Stacked Cards */}
        <div className="md:hidden space-y-4">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{scenario.label}</h4>
                <div className="flex gap-2">
                  <Button className="btn-outline" onClick={() => onLoadScenario(scenario.id)} aria-label={`Load scenario ${scenario.label}`}>
                    <Play className="w-3 h-3" />
                  </Button>
                  <Button className="btn-outline" onClick={() => onDeleteScenario(scenario.id)} aria-label={`Delete scenario ${scenario.label}`}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Price:</span> {formatCurrency(scenario.price)}
                </div>
                <div>
                  <span className="text-muted-foreground">Segment:</span> <Badge className="text-xs">{scenario.segment}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Mode:</span> <Badge className="text-[10px] uppercase tracking-wide">{scenario.thresholdMode || '-'}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Competitor:</span> {formatCurrency(scenario.competitorPrice)}
                </div>
                <div>
                  <span className="text-muted-foreground">Cost:</span> {scenario.costPct}%
                </div>
                <div>
                  <span className="text-muted-foreground">Revenue:</span> {formatCurrency(scenario.revenue)}
                </div>
                <div>
                  <span className="text-muted-foreground">Profit:</span> {formatCurrency(scenario.profit)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2">Label</th>
                <th className="text-left py-2 px-2">Price</th>
                <th className="text-left py-2 px-2">Segment</th>
                <th className="text-left py-2 px-2">Mode</th>
                <th className="text-left py-2 px-2">Competitor</th>
                <th className="text-left py-2 px-2">Cost%</th>
                <th className="text-left py-2 px-2">Revenue</th>
                <th className="text-left py-2 px-2">Profit</th>
                <th className="text-left py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario) => (
                <tr key={scenario.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-2 font-medium">{scenario.label}</td>
                  <td className="py-3 px-2">{formatCurrency(scenario.price)}</td>
                  <td className="py-3 px-2"><Badge className="text-xs">{scenario.segment}</Badge></td>
                  <td className="py-3 px-2"><Badge className="text-[10px] uppercase tracking-wide">{scenario.thresholdMode || '-'}</Badge></td>
                  <td className="py-3 px-2">{formatCurrency(scenario.competitorPrice)}</td>
                  <td className="py-3 px-2">{scenario.costPct}%</td>
                  <td className="py-3 px-2">{formatCurrency(scenario.revenue)}</td>
                  <td className="py-3 px-2">{formatCurrency(scenario.profit)}</td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <Button className="btn-outline" onClick={() => onLoadScenario(scenario.id)} aria-label={`Load scenario ${scenario.label}`}>
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button className="btn-outline" onClick={() => onDeleteScenario(scenario.id)} aria-label={`Delete scenario ${scenario.label}`}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

