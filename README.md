# Dynamic Pricing Dashboard

## Overview

The Dynamic Pricing Dashboard is an interactive web application for simulating and analyzing pricing strategies using the Van Westendorp Price Sensitivity Meter methodology, competitive positioning, and demand modeling. It helps users visualize how price, cost, and competitor pricing affect revenue, profit, and optimal price points across different market segments.

Built with Next.js, React, Radix UI, D3, and Tailwind CSS, the dashboard provides a modern, responsive experience for exploring price sensitivity and maximizing profit.

## Features

- **Dynamic Pricing Simulator:** Adjust price, cost percentage, and competitor price to see real-time changes in demand, revenue, and profit.
- **Market Segmentation:** Analyze pricing for low, medium, and high sensitivity customer segments.
- **Competitive Analysis:** Compare your pricing against competitors and see its impact on demand and profit.
- **Van Westendorp Metrics:** Visualize key thresholds:
  - **PMC (Point of Marginal Cheapness):** Price below which quality concerns arise.
  - **OPP (Optimal Price Point):** Intersection of "not cheap" and "not expensive".
  - **PME (Point of Marginal Expensiveness):** Price above which value concerns arise.
- **Threshold Strategies:** Choose between global, derived, or per-segment price bands.
- **Scenario Management:** Save, load, and delete up to 5 custom pricing scenarios for comparison.
- **Interactive Charts:** Revenue and profit curves, optimal price bands, and peak points.
- **Insights Panel:** Contextual hints and recommendations based on current settings.

## How It Works

- The app uses fixture data and demand curves to model how price changes affect demand for each segment.
- Revenue and profit are calculated using demand, price, and cost percentage.
- Van Westendorp thresholds are computed from survey data and adjusted for segment and competitor effects.
- The chart visualizes revenue, profit, and optimal price bands, updating instantly as you change inputs.

## Tech Stack

- **Next.js**: App routing, SSR, and API integration.
- **React**: UI components and state management.
- **Radix UI**: Accessible, composable UI primitives.
- **D3**: Data visualization and charting.
- **Tailwind CSS**: Utility-first styling.
- **TypeScript**: Type safety and maintainability.

## Getting Started

1. **Install dependencies:**
	```bash
	npm install
	```
2. **Run the development server:**
	```bash
	npm run dev
	```
	Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for production:**
	```bash
	npm run build
	npm start
	```

## File Structure

- `app/`: Next.js app directory, including main layout and demo pages.
- `components/`: UI components, dynamic pricing logic, charts, controls, and scenario management.
- `components/dynamic-pricing/engine/`: Core pricing calculation logic and fixture data.
- `public/`: Static assets.
- `styles/`: Global and component styles.
- `package.json`: Project dependencies and scripts.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.

## License

This project is open source and available under the MIT License.
