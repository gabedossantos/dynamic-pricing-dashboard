# Price Sensitivity Dashboard

A modern interactive tool for exploring pricing strategy trade‑offs across customer segments, competitive landscapes, and unit cost structures. It renders real‑time demand, revenue, and profit curves plus perceived value thresholds (Van Westendorp) to guide price decisions.

---

## 1. What the Tool Does

- Models demand response to price for three sensitivity segments (low / med / high).
- Adjusts demand in real time when competitor price or selected segment changes.
- Computes and plots Revenue and Profit curves with peak markers.
- Derives price perception thresholds (PMC, OPP, PME) under selectable strategies (Global / Derived / Per Segment) and shades the acceptable band.
- Saves up to 5 scenarios (including threshold strategy) for side‑by‑side qualitative comparison.
- Provides interactive tooltips (price point metrics + threshold metadata) and textual insights.

---

## 2. Core Concepts & Formulas

### 2.1 Demand Model

Base (unadjusted) demand for a segment is piecewise linearly interpolated from fixture points:

```
Given sorted price anchors (p_i, D_i_segment),
If p ≤ p_0 → D_base = D_0
If p ≥ p_last → D_base = D_last
Else find interval [p_i, p_{i+1}]:
  t = (p - p_i) / (p_{i+1} - p_i)
  D_base = D_i + t * (D_{i+1} - D_i)
```

Competitive adjustment:

```
rel = (competitorPrice - p) / competitorPrice   (relative under/over pricing)
k = 2.0  (smoothing gain)
smooth = tanh(rel * k)
D(p, segment) = D_base * clamp( 1 + e_segment * smooth , 0.6 , 1.5 )
```

Segment elasticities (heuristic):

```
low: 0.20   med: 0.35   high: 0.55
```

### 2.2 Revenue & Profit

```
Revenue R(p) = p * D(p)
Unit Cost c(p) = p * (costPct / 100)
Unit Margin m(p) = p - c(p) = p * (1 - costPct/100)
Profit π(p) = m(p) * D(p) = p * (1 - costPct/100) * D(p)
```

### 2.3 Peak Detection

Discrete grid search (step = 1):

```
peak = arg max_{p ∈ [p_min, p_max]} π(p)
```

(Analogously for revenue peak.)

### 2.4 Value Perception Thresholds (Van Westendorp Inspired)

Base aggregated thresholds (averages over fixtures):

```
TooCheap_TC, Cheap_C, Expensive_E, TooExpensive_TE
```

Displayed band uses Cheap_C → Expensive_E as acceptable value corridor.

#### Strategy Modes

1. **Global**: Use aggregated Cheap_C & Expensive_E directly (plus minor competitor & segment adjustment).
2. **Derived (Default)**: Scale Cheap/Expensive by relative elasticity vs medium segment:

```
rel = (e_segment - e_med) / e_med
cheap' = Cheap_C * (1 - clamp(rel * a, -0.25, 0.25))
exp'   = Expensive_E * (1 - clamp(rel * b, -0.30, 0.30))
```

3. **Per Segment** (amplified differentiation placeholder until real survey data is added):

```
cheap' = Cheap_C * (1 - clamp(rel * a_strong, -0.35, 0.35))
exp'   = Expensive_E * (1 - clamp(rel * b_strong, -0.40, 0.40))
```

Competitor shift (applied after scaling):

```
mid = (cheap' + exp') / 2
relDiff = (competitorPrice - mid) / mid
competitorShift = clamp(relDiff * 0.15, -0.07, 0.07)
cheap_adj = cheap' * (1 + segmentFactor + competitorShift * -0.5)
exp_adj   = exp'   * (1 + segmentFactor + competitorShift *  0.5)
```

Segment factor (mild widening/narrowing): low=+0.05, med=0, high=-0.05.

OPP (Optimal Price Point) is the profit peak price clamped to [cheap_adj, exp_adj]. PMC=cheap_adj, PME=exp_adj.

---

## 3. User Workflow

1. Adjust price, competitor price, cost %, market segment, and threshold strategy.
2. Observe curve shifts, updated peaks, and acceptable band shading.
3. Save scenarios (max 5) to capture a configuration snapshot.
4. Compare scenario rows (price, segment, costs, performance, strategy mode).
5. Iterate to converge on a price balancing profit, positioning, and perceived value.

---

## 4. Potential Use Cases

- Early stage price envelope discovery before full survey data arrives.
- Educating stakeholders on trade‑offs between margin and perceived value.
- Rapid “what‑if” competitor pricing drills during planning sessions.
- Internal training on elasticity & value perception concepts.
- Foundation for integrating real transactional or survey datasets.

---

## 5. Extension Potentials

| Theme            | Opportunity                                                                          |
| ---------------- | ------------------------------------------------------------------------------------ |
| Data Fidelity    | Replace placeholder per-segment scaling with actual segment VW survey distributions. |
| Time Dynamics    | Introduce seasonality, decay, or temporal demand shifts.                             |
| Inventory        | Constrain demand by available units, incorporate stock-out penalties.                |
| Multi-Competitor | Vector of competitor prices / positioning clusters.                                  |
| Cost Structure   | Non-linear cost curves (volume discounts, tiered COGS).                              |
| Experimentation  | A/B test module to record outcomes and update priors.                                |
| Optimization     | Gradient / Bayesian search vs brute-force grid.                                      |
| Segmentation     | Expand beyond 3 segments; allow user-defined elasticity sets.                        |
| Export           | Scenario export/import and PDF snapshot.                                             |
| API              | Headless service for embedding curves in other dashboards.                           |

---

## 6. Current Limitations & Assumptions

- Demand interpolation is linear between sparse anchor points (no saturation / diminishing returns curve beyond given anchors).
- Elasticity mapping is heuristic, not statistically estimated from data.
- Competitor effect assumes symmetrical tanh response; real markets may exhibit hysteresis or thresholds.
- Cost modeled as constant percentage of price (no fixed + variable decomposition, no scale economies).
- Discrete integer grid for peak detection (no continuous optimization); resolution limited by step size.
- Van Westendorp data aggregated globally; per-segment strategies are synthetic scalings (not survey-backed yet).
- No inventory, capacity, channel mix, or promotional effects.
- Single-period static model (no dynamic pricing over time or learning).
- Assumes competitor price exogenous & static per scenario (no game theory or reaction functions).

---

## 7. Interpreting the Visuals

- **Blue Area/Line**: Revenue curve (shape reveals diminishing returns as price climbs and demand drops).
- **Green Area/Line**: Profit curve (peaks earlier than revenue if cost % moderate/high).
- **Shaded Band**: Acceptable value price corridor (PMC→PME) under chosen strategy.
- **Vertical Dashed Lines**: PMC (red), OPP (amber), PME (purple).
- **Peak Markers**: Solid circles at maximum revenue & maximum profit.
- **Legend Badge (Adjusted Band)**: Shows derived band and adjustment deltas from segment & competitor influences.

---

## 8. Practical Guidance

| Objective                 | Suggested Focus                                                                |
| ------------------------- | ------------------------------------------------------------------------------ |
| Maximize near-term profit | Start at OPP (if unclamped) or profit peak; ensure still inside band.          |
| Market penetration        | Favor lower half of band (≥ PMC + small buffer) to maintain perceived quality. |
| Premium positioning       | Upper band near PME but avoid clamping (watch demand & margin erosion).        |
| Competitive response      | Adjust competitor slider; if your OPP shifts/clamps, reevaluate scenario.      |

---

## 9. Safe Usage Notes

- Treat outputs as directional heuristics, not production price recommendations.
- Validate proposed price windows with real customer research and A/B tests.
- Recalibrate elasticity parameters once observational data accrues.

---

## 10. Glossary

- **Elasticity (here)**: Sensitivity coefficient scaling competitor-induced demand adjustment (not full economic elasticity).
- **PMC / PME**: Lower / upper acceptable price bounds before perceived quality or value risk emerges.
- **OPP**: Profit-maximizing price constrained by perceived value corridor.
- **Van Westendorp**: Survey method collecting perceptions (too cheap, cheap, expensive, too expensive) to derive acceptable range.

---

## 11. Quick Start

1. Open the simulator page.
2. Select a segment (default: medium).
3. Adjust competitor price & cost %.
4. Switch threshold strategy (observe band & OPP shifts).
5. Hover chart for point metrics & threshold meta.
6. Save scenarios for comparison.

---

## 12. Future Data Integration Hook

A future JSON schema for per-segment VW data could look like:

```json
{
  "price": 80,
  "demand_low": 8200,
  "demand_med": 10800,
  "demand_high": 12500,
  "vanWestendorp": {
    "low": {
      "tooCheap": 30,
      "cheap": 65,
      "expensive": 140,
      "tooExpensive": 230
    },
    "med": {
      "tooCheap": 28,
      "cheap": 60,
      "expensive": 130,
      "tooExpensive": 220
    },
    "high": {
      "tooCheap": 25,
      "cheap": 55,
      "expensive": 120,
      "tooExpensive": 210
    }
  }
}
```

This would replace the current synthetic scaling in the **Per Segment** mode.

---

## 13. Attribution

Built as an exploratory pricing strategy aid—this initial release emphasizes clarity, explainability, and extensibility over statistical rigor.

---

**Status**: Exploratory / Educational (Initial Release).  
**Last Updated**: (auto-generated)
