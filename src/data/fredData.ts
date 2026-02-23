// FRED Economic Data Service
// API Documentation: https://fred.stlouisfed.org/docs/api/fred/
// Get your free API key at: https://fred.stlouisfed.org/docs/api/api_key.html

import { quarters } from '../components/TimeSlider';

export interface EconomicData {
  quarter: string;
  mortgageRate30Y: number;      // MORTGAGE30US - 30-Year Fixed Rate Mortgage Average
  mortgageRate15Y: number;      // MORTGAGE15US - 15-Year Fixed Rate Mortgage Average
  unemploymentRate: number;     // UNRATE - Civilian Unemployment Rate
  cpi: number;                  // CPIAUCSL - Consumer Price Index
  housePriceIndex: number;      // CSUSHPINSA - S&P/Case-Shiller U.S. National Home Price Index
  buildingPermits: number;      // PERMIT - New Private Housing Units Authorized
  gdpGrowth: number;            // GDP growth rate
  federalFundsRate: number;     // FEDFUNDS - Federal Funds Effective Rate
}

// Synthetic historical data (replace with real FRED API calls)
// This data simulates realistic trends from 2020-2026
export const economicDataByQuarter: Record<string, EconomicData> = {
  '2020-Q1': { quarter: '2020-Q1', mortgageRate30Y: 3.45, mortgageRate15Y: 2.95, unemploymentRate: 3.8, cpi: 258.8, housePriceIndex: 218.5, buildingPermits: 1464, gdpGrowth: -5.1, federalFundsRate: 1.55 },
  '2020-Q2': { quarter: '2020-Q2', mortgageRate30Y: 3.23, mortgageRate15Y: 2.72, unemploymentRate: 13.0, cpi: 256.4, housePriceIndex: 220.1, buildingPermits: 1066, gdpGrowth: -31.2, federalFundsRate: 0.05 },
  '2020-Q3': { quarter: '2020-Q3', mortgageRate30Y: 2.94, mortgageRate15Y: 2.48, unemploymentRate: 8.8, cpi: 259.9, housePriceIndex: 228.3, buildingPermits: 1476, gdpGrowth: 33.8, federalFundsRate: 0.09 },
  '2020-Q4': { quarter: '2020-Q4', mortgageRate30Y: 2.76, mortgageRate15Y: 2.32, unemploymentRate: 6.7, cpi: 261.6, housePriceIndex: 239.1, buildingPermits: 1709, gdpGrowth: 4.5, federalFundsRate: 0.09 },
  '2021-Q1': { quarter: '2021-Q1', mortgageRate30Y: 2.81, mortgageRate15Y: 2.29, unemploymentRate: 6.2, cpi: 264.9, housePriceIndex: 250.2, buildingPermits: 1756, gdpGrowth: 6.3, federalFundsRate: 0.07 },
  '2021-Q2': { quarter: '2021-Q2', mortgageRate30Y: 2.98, mortgageRate15Y: 2.31, unemploymentRate: 5.9, cpi: 271.7, housePriceIndex: 263.8, buildingPermits: 1683, gdpGrowth: 6.7, federalFundsRate: 0.06 },
  '2021-Q3': { quarter: '2021-Q3', mortgageRate30Y: 2.87, mortgageRate15Y: 2.19, unemploymentRate: 5.1, cpi: 276.6, housePriceIndex: 275.4, buildingPermits: 1650, gdpGrowth: 2.3, federalFundsRate: 0.08 },
  '2021-Q4': { quarter: '2021-Q4', mortgageRate30Y: 3.07, mortgageRate15Y: 2.35, unemploymentRate: 4.2, cpi: 280.1, housePriceIndex: 283.2, buildingPermits: 1717, gdpGrowth: 6.9, federalFundsRate: 0.08 },
  '2022-Q1': { quarter: '2022-Q1', mortgageRate30Y: 3.76, mortgageRate15Y: 3.01, unemploymentRate: 3.8, cpi: 287.5, housePriceIndex: 293.5, buildingPermits: 1873, gdpGrowth: -1.6, federalFundsRate: 0.20 },
  '2022-Q2': { quarter: '2022-Q2', mortgageRate30Y: 5.23, mortgageRate15Y: 4.42, unemploymentRate: 3.6, cpi: 296.2, housePriceIndex: 305.8, buildingPermits: 1685, gdpGrowth: -0.6, federalFundsRate: 1.21 },
  '2022-Q3': { quarter: '2022-Q3', mortgageRate30Y: 5.66, mortgageRate15Y: 4.95, unemploymentRate: 3.5, cpi: 298.0, housePriceIndex: 302.1, buildingPermits: 1564, gdpGrowth: 2.7, federalFundsRate: 2.56 },
  '2022-Q4': { quarter: '2022-Q4', mortgageRate30Y: 6.42, mortgageRate15Y: 5.68, unemploymentRate: 3.5, cpi: 299.2, housePriceIndex: 293.4, buildingPermits: 1351, gdpGrowth: 2.6, federalFundsRate: 3.65 },
  '2023-Q1': { quarter: '2023-Q1', mortgageRate30Y: 6.32, mortgageRate15Y: 5.56, unemploymentRate: 3.5, cpi: 301.8, housePriceIndex: 289.7, buildingPermits: 1413, gdpGrowth: 2.2, federalFundsRate: 4.65 },
  '2023-Q2': { quarter: '2023-Q2', mortgageRate30Y: 6.67, mortgageRate15Y: 6.03, unemploymentRate: 3.6, cpi: 304.1, housePriceIndex: 298.2, buildingPermits: 1441, gdpGrowth: 2.1, federalFundsRate: 5.08 },
  '2023-Q3': { quarter: '2023-Q3', mortgageRate30Y: 7.09, mortgageRate15Y: 6.46, unemploymentRate: 3.8, cpi: 306.8, housePriceIndex: 306.5, buildingPermits: 1471, gdpGrowth: 4.9, federalFundsRate: 5.33 },
  '2023-Q4': { quarter: '2023-Q4', mortgageRate30Y: 7.44, mortgageRate15Y: 6.76, unemploymentRate: 3.7, cpi: 308.7, housePriceIndex: 311.2, buildingPermits: 1467, gdpGrowth: 3.4, federalFundsRate: 5.33 },
  '2024-Q1': { quarter: '2024-Q1', mortgageRate30Y: 6.82, mortgageRate15Y: 6.21, unemploymentRate: 3.8, cpi: 311.5, housePriceIndex: 318.4, buildingPermits: 1518, gdpGrowth: 1.4, federalFundsRate: 5.33 },
  '2024-Q2': { quarter: '2024-Q2', mortgageRate30Y: 6.95, mortgageRate15Y: 6.32, unemploymentRate: 4.0, cpi: 314.2, housePriceIndex: 325.1, buildingPermits: 1446, gdpGrowth: 2.8, federalFundsRate: 5.33 },
  '2024-Q3': { quarter: '2024-Q3', mortgageRate30Y: 6.52, mortgageRate15Y: 5.89, unemploymentRate: 4.2, cpi: 315.8, housePriceIndex: 328.7, buildingPermits: 1470, gdpGrowth: 2.5, federalFundsRate: 5.00 },
  '2024-Q4': { quarter: '2024-Q4', mortgageRate30Y: 6.78, mortgageRate15Y: 6.12, unemploymentRate: 4.1, cpi: 317.3, housePriceIndex: 331.5, buildingPermits: 1485, gdpGrowth: 2.3, federalFundsRate: 4.58 },
  '2025-Q1': { quarter: '2025-Q1', mortgageRate30Y: 6.65, mortgageRate15Y: 5.98, unemploymentRate: 4.0, cpi: 319.1, housePriceIndex: 334.8, buildingPermits: 1512, gdpGrowth: 2.1, federalFundsRate: 4.33 },
  '2025-Q2': { quarter: '2025-Q2', mortgageRate30Y: 6.42, mortgageRate15Y: 5.78, unemploymentRate: 3.9, cpi: 320.8, housePriceIndex: 339.2, buildingPermits: 1548, gdpGrowth: 2.4, federalFundsRate: 4.08 },
  '2025-Q3': { quarter: '2025-Q3', mortgageRate30Y: 6.28, mortgageRate15Y: 5.65, unemploymentRate: 3.8, cpi: 322.4, housePriceIndex: 343.1, buildingPermits: 1576, gdpGrowth: 2.6, federalFundsRate: 3.83 },
  '2025-Q4': { quarter: '2025-Q4', mortgageRate30Y: 6.15, mortgageRate15Y: 5.52, unemploymentRate: 3.7, cpi: 324.0, housePriceIndex: 346.5, buildingPermits: 1598, gdpGrowth: 2.5, federalFundsRate: 3.58 },
  '2026-Q1': { quarter: '2026-Q1', mortgageRate30Y: 6.05, mortgageRate15Y: 5.42, unemploymentRate: 3.6, cpi: 325.8, housePriceIndex: 349.2, buildingPermits: 1615, gdpGrowth: 2.3, federalFundsRate: 3.33 },
};

export function getEconomicData(quarter: string): EconomicData | undefined {
  return economicDataByQuarter[quarter];
}

export function getEconomicDataRange(startQuarter: string, endQuarter: string): EconomicData[] {
  const startIdx = quarters.indexOf(startQuarter);
  const endIdx = quarters.indexOf(endQuarter);

  if (startIdx === -1 || endIdx === -1) return [];

  return quarters
    .slice(startIdx, endIdx + 1)
    .map(q => economicDataByQuarter[q])
    .filter(Boolean);
}

// Calculate quarter-over-quarter change
export function getQoQChange(quarter: string, metric: keyof EconomicData): number | null {
  const currentIdx = quarters.indexOf(quarter);
  if (currentIdx <= 0) return null;

  const current = economicDataByQuarter[quarter];
  const previous = economicDataByQuarter[quarters[currentIdx - 1]];

  if (!current || !previous) return null;

  const currentVal = current[metric] as number;
  const previousVal = previous[metric] as number;

  return ((currentVal - previousVal) / previousVal) * 100;
}

// Calculate year-over-year change
export function getYoYChange(quarter: string, metric: keyof EconomicData): number | null {
  const currentIdx = quarters.indexOf(quarter);
  if (currentIdx < 4) return null; // Need at least 4 quarters back

  const current = economicDataByQuarter[quarter];
  const yearAgo = economicDataByQuarter[quarters[currentIdx - 4]];

  if (!current || !yearAgo) return null;

  const currentVal = current[metric] as number;
  const yearAgoVal = yearAgo[metric] as number;

  return ((currentVal - yearAgoVal) / yearAgoVal) * 100;
}

// FRED API Integration (uncomment when you have an API key)
/*
const FRED_API_KEY = 'YOUR_API_KEY_HERE';
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

export async function fetchFredSeries(seriesId: string, startDate: string, endDate: string): Promise<any[]> {
  const url = `${FRED_BASE_URL}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&observation_start=${startDate}&observation_end=${endDate}`;

  const response = await fetch(url);
  const data = await response.json();

  return data.observations || [];
}

// Key FRED Series IDs:
// MORTGAGE30US - 30-Year Fixed Rate Mortgage Average
// MORTGAGE15US - 15-Year Fixed Rate Mortgage Average
// UNRATE - Civilian Unemployment Rate
// CPIAUCSL - Consumer Price Index for All Urban Consumers
// CSUSHPINSA - S&P/Case-Shiller U.S. National Home Price Index
// PERMIT - New Private Housing Units Authorized by Building Permits
// GDP - Gross Domestic Product
// FEDFUNDS - Federal Funds Effective Rate
*/
