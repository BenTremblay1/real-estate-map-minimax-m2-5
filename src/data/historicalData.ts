// Historical Property Data Generator
// Simulates property value changes over time based on economic conditions

import { Property, properties } from './properties';
import { economicDataByQuarter } from './fredData';
import { quarters } from '../components/TimeSlider';

export interface HistoricalProperty extends Property {
  quarter: string;
  adjustedPricePerUnit: number;
  priceChange: number; // % change from base
}

// Base quarter for the original property data
const BASE_QUARTER = '2013-Q1'; // Original data is from ~2013

// Price adjustment factors based on market conditions
// This simulates how property values changed over time
const quarterlyPriceMultipliers: Record<string, number> = {
  '2020-Q1': 1.35,
  '2020-Q2': 1.32,  // COVID dip
  '2020-Q3': 1.40,  // Recovery
  '2020-Q4': 1.48,  // Strong recovery
  '2021-Q1': 1.55,
  '2021-Q2': 1.65,
  '2021-Q3': 1.72,
  '2021-Q4': 1.78,
  '2022-Q1': 1.85,
  '2022-Q2': 1.92,  // Peak before rate hikes
  '2022-Q3': 1.88,  // Slight correction
  '2022-Q4': 1.82,  // Continued cooling
  '2023-Q1': 1.78,
  '2023-Q2': 1.82,
  '2023-Q3': 1.88,
  '2023-Q4': 1.92,
  '2024-Q1': 1.96,
  '2024-Q2': 2.00,
  '2024-Q3': 2.03,
  '2024-Q4': 2.06,
  '2025-Q1': 2.10,
  '2025-Q2': 2.14,
  '2025-Q3': 2.18,
  '2025-Q4': 2.22,
  '2026-Q1': 2.25,
};

// Add some location-based variation (properties near MRT appreciate more)
function getLocationMultiplier(property: Property): number {
  // Properties closer to MRT appreciate more
  if (property.distanceToMRT < 500) return 1.15;
  if (property.distanceToMRT < 1000) return 1.08;
  if (property.distanceToMRT < 2000) return 1.02;
  return 0.95; // Far from MRT appreciates less
}

// Add some age-based variation (newer properties hold value better)
function getAgeMultiplier(property: Property, quarter: string): number {
  const yearsSince2013 = (quarters.indexOf(quarter) / 4) + 7; // Approximate years since 2013
  const currentAge = property.houseAge + yearsSince2013;

  if (currentAge < 10) return 1.05;
  if (currentAge < 20) return 1.00;
  if (currentAge < 30) return 0.95;
  return 0.90;
}

// Generate adjusted property data for a specific quarter
export function getPropertiesForQuarter(quarter: string): HistoricalProperty[] {
  const baseMultiplier = quarterlyPriceMultipliers[quarter] || 1.0;

  return properties.map(property => {
    const locationMult = getLocationMultiplier(property);
    const ageMult = getAgeMultiplier(property, quarter);

    // Add some random variation for realism (±5%)
    const randomVariation = 0.95 + (Math.sin(property.id * 12345 + quarters.indexOf(quarter)) * 0.5 + 0.5) * 0.1;

    const totalMultiplier = baseMultiplier * locationMult * ageMult * randomVariation;
    const adjustedPrice = property.pricePerUnit * totalMultiplier;
    const priceChange = ((totalMultiplier - 1) / 1) * 100;

    // Calculate adjusted house age
    const yearsSince2013 = Math.floor((quarters.indexOf(quarter) / 4) + 7);

    return {
      ...property,
      quarter,
      houseAge: property.houseAge + yearsSince2013,
      adjustedPricePerUnit: Math.round(adjustedPrice * 10) / 10,
      priceChange: Math.round(priceChange * 10) / 10,
    };
  });
}

// Get statistics for a quarter
export function getQuarterStats(quarter: string) {
  const props = getPropertiesForQuarter(quarter);
  const prices = props.map(p => p.adjustedPricePerUnit);

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: prices.reduce((a, b) => a + b, 0) / prices.length,
    median: prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)],
    totalProperties: props.length,
  };
}

// Get price trend data for a property across all quarters
export function getPropertyPriceTrend(propertyId: number): { quarter: string; price: number }[] {
  return quarters.map(quarter => {
    const props = getPropertiesForQuarter(quarter);
    const prop = props.find(p => p.id === propertyId);
    return {
      quarter,
      price: prop?.adjustedPricePerUnit || 0,
    };
  });
}

// Get market summary across all quarters
export function getMarketTrend(): { quarter: string; avgPrice: number; medianPrice: number }[] {
  return quarters.map(quarter => {
    const stats = getQuarterStats(quarter);
    return {
      quarter,
      avgPrice: Math.round(stats.avg * 10) / 10,
      medianPrice: Math.round(stats.median * 10) / 10,
    };
  });
}
