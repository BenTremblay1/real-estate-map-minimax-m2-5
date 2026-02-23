// Metric configuration for different map layers

export interface MetricConfig {
  key: string;
  label: string;
  unit: string;
  description: string;
  colorScheme: 'ascending' | 'descending'; // ascending = higher value = red, descending = lower value = red
  format: (value: number) => string;
}

export const metrics: MetricConfig[] = [
  {
    key: 'pricePerUnit',
    label: 'Price per Unit',
    unit: '$/unit',
    description: 'House price per unit area',
    colorScheme: 'ascending',
    format: (v) => `$${v.toFixed(1)}`,
  },
  {
    key: 'lotSize',
    label: 'Lot Size',
    unit: 'sq ft',
    description: 'Total lot size in square feet',
    colorScheme: 'ascending',
    format: (v) => `${v.toLocaleString()} sq ft`,
  },
  {
    key: 'sqft',
    label: 'Living Area',
    unit: 'sq ft',
    description: 'Interior living space',
    colorScheme: 'ascending',
    format: (v) => `${v.toLocaleString()} sq ft`,
  },
  {
    key: 'yearBuilt',
    label: 'Year Built',
    unit: 'year',
    description: 'Year the property was built',
    colorScheme: 'ascending',
    format: (v) => `${Math.round(v)}`,
  },
  {
    key: 'houseAge',
    label: 'House Age',
    unit: 'years',
    description: 'Age of the property',
    colorScheme: 'descending', // newer is better, so lower = green
    format: (v) => `${v.toFixed(1)} yrs`,
  },
  {
    key: 'distanceToMRT',
    label: 'Distance to MRT',
    unit: 'm',
    description: 'Distance to nearest MRT station',
    colorScheme: 'descending', // closer is better, so lower = green
    format: (v) => `${v.toFixed(0)}m`,
  },
];

export function getMetricByKey(key: string): MetricConfig | undefined {
  return metrics.find(m => m.key === key);
}

export function getMetricStats(properties: any[], metricKey: string) {
  const values = properties.map(p => p[metricKey] as number).filter(v => v !== undefined);
  if (values.length === 0) return { min: 0, max: 1, avg: 0 };

  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((sum, v) => sum + v, 0) / values.length,
  };
}

export function getMetricColor(value: number, min: number, max: number, colorScheme: 'ascending' | 'descending'): string {
  let normalized = (value - min) / (max - min || 1);

  // For descending metrics (where lower is better), invert the color scale
  if (colorScheme === 'descending') {
    normalized = 1 - normalized;
  }

  if (normalized < 0.33) {
    return '#22c55e'; // green
  } else if (normalized < 0.66) {
    return '#eab308'; // yellow
  } else {
    return '#ef4444'; // red
  }
}

export function getMetricIntensity(value: number, min: number, max: number, colorScheme: 'ascending' | 'descending'): number {
  let normalized = (value - min) / (max - min || 1);

  // For descending metrics (where lower is better), invert the intensity
  if (colorScheme === 'descending') {
    normalized = 1 - normalized;
  }

  return Math.max(0, Math.min(1, normalized));
}
