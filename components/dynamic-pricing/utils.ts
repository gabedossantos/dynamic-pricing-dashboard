export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatUnits = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const simpleInterpolator = (
  x: number,
  xArray: number[],
  yArray: number[],
): number => {
  if (xArray.length !== yArray.length) {
    throw new Error("Arrays must have the same length");
  }

  if (x <= xArray[0]) return yArray[0];
  if (x >= xArray[xArray.length - 1]) return yArray[yArray.length - 1];

  for (let i = 0; i < xArray.length - 1; i++) {
    if (x >= xArray[i] && x <= xArray[i + 1]) {
      const t = (x - xArray[i]) / (xArray[i + 1] - xArray[i]);
      return yArray[i] + t * (yArray[i + 1] - yArray[i]);
    }
  }

  return yArray[0];
};
