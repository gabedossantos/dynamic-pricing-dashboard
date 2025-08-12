"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import * as d3 from "d3";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@gabe/components";
import { TrendingUp, DollarSign } from "lucide-react";
import type { ChartProps } from "./types";
import { formatCurrency, formatUnits } from "./utils";

interface TooltipData {
  x: number;
  y: number;
  price: number;
  revenue: number;
  profit: number;
  visible: boolean;
}

export function Chart({
  prices,
  revenue,
  profit,
  pmc,
  opp,
  pme,
  peakRevenue,
  peakProfit,
  thresholdMeta,
  ariaLabel = "Revenue and profit chart",
}: ChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData>({
    x: 0,
    y: 0,
    price: 0,
    revenue: 0,
    profit: 0,
    visible: false,
  });
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(600, width - 32),
          height: 400,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Chart configuration
  const config = useMemo(() => {
    const margin = { top: 60, right: 60, bottom: 80, left: 80 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    return {
      margin,
      width,
      height,
      // Expose but mark intentionally unused for layout debugging potential
      totalWidth: dimensions.width,
      totalHeight: dimensions.height,
    };
  }, [dimensions]);

  // Meta state for threshold hover (must be declared before any early return)
  const [metaState, setMetaState] = useState<string | null>(null);

  // D3 Chart Effect
  useEffect(() => {
    if (!svgRef.current || !prices.length || !revenue.length || !profit.length)
      return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const {
      margin,
      width,
      height,
      totalWidth: _totalWidth,
      totalHeight: _totalHeight,
    } = config;

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(prices) as [number, number])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        Math.min(0, d3.min(profit) as number),
        Math.max(d3.max(revenue) as number, d3.max(profit) as number),
      ])
      .range([height, 0]);

    // Create main group
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add gradient definitions
    const defs = svg.append("defs");

    // Revenue gradient
    const revenueGradient = defs
      .append("linearGradient")
      .attr("id", "revenueGradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", height)
      .attr("x2", 0)
      .attr("y2", 0);

    revenueGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#3b82f6")
      .attr("stop-opacity", 0.1);

    revenueGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#3b82f6")
      .attr("stop-opacity", 0.8);

    // Profit gradient
    const profitGradient = defs
      .append("linearGradient")
      .attr("id", "profitGradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", height)
      .attr("x2", 0)
      .attr("y2", 0);

    profitGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#10b981")
      .attr("stop-opacity", 0.1);

    profitGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#10b981")
      .attr("stop-opacity", 0.8);

    // Grid
    const xAxis = d3
      .axisBottom(xScale)
      .tickSize(-height)
      .tickFormat(() => "");

    const yAxis = d3
      .axisLeft(yScale)
      .tickSize(-width)
      .tickFormat(() => "");

    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("line")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.1)
      .attr("stroke-width", 1);

    g.append("g")
      .attr("class", "grid")
      .call(yAxis)
      .selectAll("line")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.1)
      .attr("stroke-width", 1);

    // Van Westendorp lines
    // Acceptable band shading (between PMC and PME)
    const bandGroup = g.append("g").attr("class", "acceptable-band");
    const bandX1 = xScale(pmc);
    const bandX2 = xScale(pme);
    bandGroup
      .append("rect")
      .attr("x", Math.min(bandX1, bandX2))
      .attr("y", 0)
      .attr("width", Math.abs(bandX2 - bandX1))
      .attr("height", height)
      .attr("fill", "url(#bandGradient)")
      .attr("opacity", 0.18);

    // Gradient for band
    const bandDefs = svg.select("defs");
    const bandGradient = bandDefs
      .append("linearGradient")
      .attr("id", "bandGradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");
    bandGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#ef4444")
      .attr("stop-opacity", 0.25);
    bandGradient
      .append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "#f59e0b")
      .attr("stop-opacity", 0.25);
    bandGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#8b5cf6")
      .attr("stop-opacity", 0.25);
    const thresholds = [
      {
        value: pmc,
        label: "PMC",
        color: "#ef4444",
        name: "Point of Marginal Cheapness",
      },
      {
        value: opp,
        label: "OPP",
        color: "#f59e0b",
        name: "Optimal Price Point",
      },
      {
        value: pme,
        label: "PME",
        color: "#8b5cf6",
        name: "Point of Marginal Expensiveness",
      },
    ];

    const thresholdGroup = g.append("g").attr("class", "threshold-lines");
    thresholds.forEach(({ value, label, color, name }) => {
      const x = xScale(value);
      const line = thresholdGroup
        .append("line")
        .attr("x1", x)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", height)
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "8,4")
        .attr("opacity", 0.8)
        .attr("data-threshold", label);

      const rect = thresholdGroup
        .append("rect")
        .attr("x", x - 20)
        .attr("y", -45)
        .attr("width", 40)
        .attr("height", 24)
        .attr("rx", 12)
        .attr("fill", color)
        .attr("opacity", 0.9);
      const text = thresholdGroup
        .append("text")
        .attr("x", x)
        .attr("y", -28)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "12px")
        .attr("font-weight", "600")
        .text(label);

      // Hover interactions for threshold explanation
      const showMeta = () => {
        if (!thresholdMeta) return;
        const rectBounds = containerRef.current?.getBoundingClientRect();
        if (!rectBounds) return;
        const metaContent = `${label}: ${name} \nAdjusted Band: ${thresholdMeta.adjusted.cheap.toFixed(2)} - ${thresholdMeta.adjusted.expensive.toFixed(2)}\nProfit Peak @ ${thresholdMeta.peakProfitPrice.toFixed(2)}\nSegment Adj ${(thresholdMeta.segmentFactor * 100).toFixed(1)}% | Competitor Shift ${(thresholdMeta.competitorShift * 100).toFixed(1)}%`;
        setTooltip({
          x: rectBounds.left + x,
          y: rectBounds.top + 10,
          price: value,
          revenue: 0,
          profit: 0,
          visible: true,
        });
        // Reuse existing tooltip DOM but override via state below (we'll show meta below chart)
        setMetaState(metaContent);
      };
      const hideMeta = () => {
        setMetaState(null);
      };
      line
        .style("cursor", "help")
        .on("mouseenter", showMeta)
        .on("mouseleave", hideMeta);
      rect
        .style("cursor", "help")
        .on("mouseenter", showMeta)
        .on("mouseleave", hideMeta);
      text
        .style("cursor", "help")
        .on("mouseenter", showMeta)
        .on("mouseleave", hideMeta);
    });

    // Line generators with smooth curves
    const revenueLineGenerator = d3
      .line<number>()
      .x((d, i) => xScale(prices[i]))
      .y((d) => yScale(d))
      .curve(d3.curveCardinal.tension(0.2));

    const profitLineGenerator = d3
      .line<number>()
      .x((d, i) => xScale(prices[i]))
      .y((d) => yScale(d))
      .curve(d3.curveCardinal.tension(0.2));

    // Area generators for gradient fills
    const revenueAreaGenerator = d3
      .area<number>()
      .x((d, i) => xScale(prices[i]))
      .y0(height)
      .y1((d) => yScale(d))
      .curve(d3.curveCardinal.tension(0.2));

    const profitAreaGenerator = d3
      .area<number>()
      .x((d, i) => xScale(prices[i]))
      .y0(height)
      .y1((d) => yScale(d))
      .curve(d3.curveCardinal.tension(0.2));

    // Add gradient areas
    g.append("path")
      .datum(revenue)
      .attr("fill", "url(#revenueGradient)")
      .attr("d", revenueAreaGenerator)
      .attr("opacity", 0.3);

    g.append("path")
      .datum(profit)
      .attr("fill", "url(#profitGradient)")
      .attr("d", profitAreaGenerator)
      .attr("opacity", 0.3);

    // Add lines with animation
    const revenuePath = g
      .append("path")
      .datum(revenue)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("d", revenueLineGenerator)
      .attr("filter", "drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))");

    const profitPath = g
      .append("path")
      .datum(profit)
      .attr("fill", "none")
      .attr("stroke", "#10b981")
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("d", profitLineGenerator)
      .attr("filter", "drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))");

    // Animate lines
    const totalLength = (revenuePath.node() as SVGPathElement).getTotalLength();
    revenuePath
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeQuadInOut)
      .attr("stroke-dashoffset", 0);

    const profitLength = (profitPath.node() as SVGPathElement).getTotalLength();
    profitPath
      .attr("stroke-dasharray", profitLength + " " + profitLength)
      .attr("stroke-dashoffset", profitLength)
      .transition()
      .duration(1500)
      .delay(200)
      .ease(d3.easeQuadInOut)
      .attr("stroke-dashoffset", 0);

    // Peak markers with glow effect
    g.append("circle")
      .attr("cx", xScale(peakRevenue.price))
      .attr("cy", yScale(peakRevenue.value))
      .attr("r", 0)
      .attr("fill", "#3b82f6")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .attr("filter", "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))")
      .transition()
      .delay(1500)
      .duration(500)
      .attr("r", 6);

    g.append("circle")
      .attr("cx", xScale(peakProfit.price))
      .attr("cy", yScale(peakProfit.value))
      .attr("r", 0)
      .attr("fill", "#10b981")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .attr("filter", "drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))")
      .transition()
      .delay(1700)
      .duration(500)
      .attr("r", 6);

    // Interactive overlay for tooltips
    const overlay = g
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("pointer-events", "all");

    const bisect = d3.bisector((d: number, x: number) => d - x).left;

    overlay.on("mousemove", (event) => {
      const [mouseX] = d3.pointer(event);
      const x0 = xScale.invert(mouseX);
      const i = bisect(prices, x0, 1);
      const d0 = prices[i - 1];
      const d1 = prices[i];
      const d = x0 - d0 > d1 - x0 ? i : i - 1;

      if (d >= 0 && d < prices.length) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltip({
            x: rect.left + margin.left + xScale(prices[d]),
            y:
              rect.top +
              margin.top +
              yScale(Math.max(revenue[d], profit[d])) -
              10,
            price: prices[d],
            revenue: revenue[d],
            profit: profit[d],
            visible: true,
          });
        }
      }
    });

    overlay.on("mouseleave", () => {
      setTooltip((prev) => ({ ...prev, visible: false }));
    });

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickFormat((d) => formatCurrency(d as number))
          .tickSize(6),
      )
      .selectAll("text")
      .attr("fill", "currentColor")
      .attr("font-size", "12px");

    g.append("g")
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat((d) => formatUnits(d as number))
          .tickSize(6),
      )
      .selectAll("text")
      .attr("fill", "currentColor")
      .attr("font-size", "12px");

    // Axis labels
    g.append("text")
      .attr("transform", `translate(${width / 2}, ${height + 50})`)
      .style("text-anchor", "middle")
      .attr("fill", "currentColor")
      .attr("font-size", "14px")
      .attr("font-weight", "500")
      .text("Price ($)");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -height / 2)
      .style("text-anchor", "middle")
      .attr("fill", "currentColor")
      .attr("font-size", "14px")
      .attr("font-weight", "500")
      .text("Value ($)");
  }, [
    prices,
    revenue,
    profit,
    pmc,
    opp,
    pme,
    peakRevenue,
    peakProfit,
    config,
    thresholdMeta,
  ]);

  if (!prices.length || !revenue.length || !profit.length) {
    return (
      <Card className="h-full bg-gradient-to-br from-background to-muted/20 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Revenue & Profit Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-lg font-medium">No data available</p>
            <p className="text-sm">Adjust controls to see real-time analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-gradient-to-br from-background to-muted/20 border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              Revenue & Profit Analysis
              <div className="flex gap-2 ml-4">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Revenue
                </Badge>
                <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Profit
                </Badge>
              </div>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
              Live updates • Hover for details • Smooth D3 visualization
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="w-full">
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-auto"
            style={{ background: "transparent" }}
            aria-label={ariaLabel}
            role="img"
          />
        </div>

        {/* Enhanced Tooltip */}
        {tooltip.visible && (
          <div
            className="fixed z-50 bg-background/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl p-4 pointer-events-none transition-all duration-200"
            style={{
              left: Math.min(tooltip.x, window.innerWidth - 250),
              top: Math.max(tooltip.y, 10),
              transform:
                tooltip.x > window.innerWidth - 250
                  ? "translateX(-100%)"
                  : "none",
            }}
          >
            {metaState ? (
              <div className="space-y-2 text-xs leading-snug max-w-[220px]">
                <div className="text-xs font-semibold mb-1">
                  Threshold Detail
                </div>
                {metaState.split("\n").map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
              </div>
            ) : (
              <>
                <div className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  {formatCurrency(tooltip.price)}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-0.5 bg-blue-500 rounded-full"></div>
                      <span>Revenue</span>
                    </div>
                    <span className="font-mono font-semibold">
                      {formatUnits(tooltip.revenue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-0.5 bg-green-500 rounded-full"></div>
                      <span>Profit</span>
                    </div>
                    <span className="font-mono font-semibold">
                      {formatUnits(tooltip.profit)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Margin</span>
                      <span className="font-mono text-xs">
                        {tooltip.revenue > 0
                          ? ((tooltip.profit / tooltip.revenue) * 100).toFixed(
                              1,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Peak Information with modern styling */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Peak Revenue
              </span>
            </div>
            <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
              {formatUnits(peakRevenue.value)}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              at {formatCurrency(peakRevenue.price)}
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Peak Profit
              </span>
            </div>
            <div className="text-lg font-bold text-green-800 dark:text-green-200">
              {formatUnits(peakProfit.value)}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              at {formatCurrency(peakProfit.price)}
            </div>
          </div>
        </div>

        {/* Legend with modern styling */}
        <div className="mt-6 flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-red-500 rounded-full opacity-80"></div>
            <span className="text-muted-foreground">
              PMC: Point of Marginal Cheapness
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-amber-500 rounded-full opacity-80"></div>
            <span className="text-muted-foreground">
              OPP: Optimal Price Point
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-purple-500 rounded-full opacity-80"></div>
            <span className="text-muted-foreground">
              PME: Point of Marginal Expensiveness
            </span>
          </div>
          {thresholdMeta && (
            <div className="flex items-center gap-2 text-muted-foreground/80">
              <div className="w-2 h-2 bg-gradient-to-r from-red-500 via-amber-500 to-purple-500 rounded-full"></div>
              <span className="text-xs">
                adj band {thresholdMeta.adjusted.cheap.toFixed(0)}–
                {thresholdMeta.adjusted.expensive.toFixed(0)} (seg{" "}
                {(thresholdMeta.segmentFactor * 100).toFixed(0)}% • comp{" "}
                {(thresholdMeta.competitorShift * 100).toFixed(0)}%)
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
