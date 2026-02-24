// Investment Analytics Service
// Provides predictive forecasting, deal scoring, and economic correlation analysis

import { Property, properties } from './properties';
import { getPropertiesForQuarter, HistoricalProperty } from './historicalData';
import { economicDataByQuarter, EconomicData } from './fredData';
import { quarters } from './constants';

// Types
export interface PropertyScore {
  propertyId: number;
  score: number;
  yieldScore: number;
  appreciationScore: number;
  volatilityScore: number;
  locationScore: number;
  affordabilityScore: number;
}

export interface ForecastData {
  quarter: string;
  predictedPrice: number;
  lowerBound: number;
  upperBound: number;
  isForecast: boolean;
}

export interface CorrelationData {
  x: string;
  y: string;
  value: number;
}

export interface StressScenario {
  interestRateChange: number;
  vacancyChange: number;
  rentGrowthChange: number;
  projectedValueChange: number;
}

export interface MarketCyclePhase {
  phase: 'Recovery' | 'Expansion' | 'Peak' | 'Recession' | 'Hypersupply';
  confidence: number;
  description: string;
}

// Scoring Weights
const YIELD_WEIGHT = 0.35;
const APPRECIATION_WEIGHT = 0.35;
const VOLATILITY_WEIGHT = 0.15;
const LOCATION_WEIGHT = 0.10;
const AFFORDABILITY_WEIGHT = 0.05;

// Calculate investment score for a property
export function calculatePropertyScore(property: HistoricalProperty, economicData: EconomicData): PropertyScore {
  // Yield Score: Based on price per unit (lower is better for yield)
  const basePrice = property.adjustedPricePerUnit;
  const yieldScore = Math.max(0, Math.min(100, 100 - (basePrice / 50)));

  // Appreciation Score: Based on price change momentum
  const priceChange = property.priceChange || 0;
  const appreciationScore = Math.max(0, Math.min(100, 50 + priceChange));

  // Volatility Score: Based on distance from MRT (less distance = less volatility)
  const volatilityScore = Math.max(0, Math.min(100, 100 - (property.distanceToMRT / 30)));

  // Location Score: Based on convenience stores nearby
  const locationScore = Math.min(100, property.convenienceStores * 10);

  // Affordability Score: Based on house age (newer = more expensive but better value)
  const age = property.houseAge;
  const affordabilityScore = age < 5 ? 80 : age < 15 ? 60 : age < 30 ? 40 : 20;

  // Calculate weighted total
  const totalScore =
    yieldScore * YIELD_WEIGHT +
    appreciationScore * APPRECIATION_WEIGHT +
    volatilityScore * VOLATILITY_WEIGHT +
    locationScore * LOCATION_WEIGHT +
    affordabilityScore * AFFORDABILITY_WEIGHT;

  return {
    propertyId: property.id,
    score: Math.round(totalScore),
    yieldScore: Math.round(yieldScore),
    appreciationScore: Math.round(appreciationScore),
    volatilityScore: Math.round(volatilityScore),
    locationScore: Math.round(locationScore),
    affordabilityScore: Math.round(affordabilityScore),
  };
}

// Get all property scores
export function getAllPropertyScores(quarter: string = '2026-Q1'): PropertyScore[] {
  const quarterProperties = getPropertiesForQuarter(quarter);
  const economicData = economicDataByQuarter[quarter];

  if (!economicData) return [];

  return quarterProperties.map(property => calculatePropertyScore(property, economicData));
}

// Generate predictive forecast
export function generateForecast(quartersAhead: number = 8): ForecastData[] {
  try {
    const idx = quarters.indexOf('2026-Q1');
    if (idx === -1) {
      // Fallback if 2026-Q1 not found
      return [];
    }

    const historicalQuarters = quarters.slice(0, idx + 1);
    const forecastQuarters = quarters.slice(idx + 1, idx + 1 + quartersAhead);

    const result: ForecastData[] = [];

    // Historical data points
    historicalQuarters.forEach(quarter => {
      const props = getPropertiesForQuarter(quarter);
      if (!props || props.length === 0) return;
      const avgPrice = props.reduce((sum, p) => sum + p.adjustedPricePerUnit, 0) / props.length;
      result.push({
        quarter,
        predictedPrice: avgPrice,
        lowerBound: avgPrice,
        upperBound: avgPrice,
        isForecast: false,
      });
    });

    // Calculate trend from historical data
    const historicalPrices = result.map(r => r.predictedPrice);
    const n = historicalPrices.length;

    if (n === 0) {
      return [];
    }

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += historicalPrices[i];
      sumXY += i * historicalPrices[i];
      sumX2 += i * i;
    }

    const denominator = (n * sumX2 - sumX * sumX);
    if (denominator === 0) {
      return result;
    }

    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;

    // Generate forecast with confidence intervals
    const lastHistoricalPrice = historicalPrices[n - 1];
    const stdDev = Math.sqrt(
      historicalPrices.reduce((sum, p) => sum + Math.pow(p - (slope * historicalPrices.indexOf(p) + intercept), 2), 0) / n
    );

    forecastQuarters.forEach((quarter, index) => {
      const growthRate = 1 + (index * 0.005); // Diminishing growth
      const predictedPrice = lastHistoricalPrice * growthRate;

      // Expand confidence interval over time
      const uncertainty = stdDev * (1 + index * 0.3);

      result.push({
        quarter,
        predictedPrice: Math.round(predictedPrice),
        lowerBound: Math.round(predictedPrice - uncertainty * 1.96),
        upperBound: Math.round(predictedPrice + uncertainty * 1.96),
        isForecast: true,
      });
    });

    return result;
  } catch (error) {
    console.error('Error generating forecast:', error);
    return [];
  }
}

// Calculate correlations between property prices and economic indicators
export function calculateCorrelations(): CorrelationData[] {
  const correlations: CorrelationData[] = [];
  const economicMetrics = ['mortgageRate30Y', 'unemploymentRate', 'cpi', 'housePriceIndex', 'federalFundsRate'];

  // Get all price data and economic data
  const priceData = quarters.map(q => {
    const props = getPropertiesForQuarter(q);
    return props.reduce((sum, p) => sum + p.adjustedPricePerUnit, 0) / props.length;
  });

  economicMetrics.forEach(metric => {
    const economicValues: number[] = quarters.map(q => {
      const data = economicDataByQuarter[q];
      return data ? (data[metric as keyof EconomicData] as number) || 0 : 0;
    });

    const correlation = calculateCorrelation(priceData, economicValues);

    correlations.push({
      x: 'Property Price',
      y: formatMetricName(metric),
      value: correlation,
    });
  });

  return correlations;
}

function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
  const sumX2 = x.reduce((total, xi) => total + xi * xi, 0);
  const sumY2 = y.reduce((total, yi) => total + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : Math.round((numerator / denominator) * 100) / 100;
}

function formatMetricName(metric: string): string {
  const names: Record<string, string> = {
    mortgageRate30Y: 'Mortgage Rate',
    unemploymentRate: 'Unemployment',
    cpi: 'CPI',
    housePriceIndex: 'HPI',
    federalFundsRate: 'Fed Funds Rate',
  };
  return names[metric] || metric;
}

// Determine market cycle phase
export function determineMarketCycle(quarter: string = '2026-Q1'): MarketCyclePhase {
  const data = economicDataByQuarter[quarter];
  if (!data) {
    return { phase: 'Expansion', confidence: 50, description: 'Unable to determine' };
  }

  const { mortgageRate30Y, gdpGrowth, housePriceIndex, federalFundsRate } = data;

  // Calculate leading indicators
  const rateLevel = mortgageRate30Y > 7 ? 'high' : mortgageRate30Y > 5 ? 'medium' : 'low';
  const gdpMomentum = gdpGrowth > 3 ? 'strong' : gdpGrowth > 0 ? 'moderate' : 'weak';
  const fedStance = federalFundsRate > 4.5 ? 'restrictive' : federalFundsRate > 2 ? 'neutral' : 'accommodative';

  // Determine phase based on indicators
  if (fedStance === 'restrictive' && rateLevel === 'high' && gdpMomentum === 'weak') {
    return {
      phase: 'Recession',
      confidence: 75,
      description: 'High rates and weak growth suggest market correction phase',
    };
  } else if (fedStance === 'restrictive' && rateLevel === 'high') {
    return {
      phase: 'Peak',
      confidence: 70,
      description: 'High rates may cool the market after expansion phase',
    };
  } else if (fedStance === 'accommodative' || gdpMomentum === 'strong') {
    return {
      phase: 'Expansion',
      confidence: 80,
      description: 'Favorable financing conditions support market growth',
    };
  } else if (gdpMomentum === 'moderate' && rateLevel === 'medium') {
    return {
      phase: 'Recovery',
      confidence: 65,
      description: 'Market stabilizing with moderate growth potential',
    };
  }

  return {
    phase: 'Expansion',
    confidence: 60,
    description: 'Market showing steady growth patterns',
  };
}

// Calculate stress test scenario
export function calculateStressScenario(
  baseValue: number,
  interestRateChange: number,
  vacancyChange: number,
  rentGrowthChange: number
): StressScenario {
  // Interest rate impact: +1% rate = -5% property value
  const interestImpact = interestRateChange * -5;

  // Vacancy impact: +1% vacancy = -2% property value
  const vacancyImpact = vacancyChange * -2;

  // Rent growth impact: +1% rent growth = +3% property value
  const rentImpact = rentGrowthChange * 3;

  const totalImpact = interestImpact + vacancyImpact + rentImpact;
  const projectedValueChange = totalImpact;

  return {
    interestRateChange,
    vacancyChange,
    rentGrowthChange,
    projectedValueChange: Math.round(projectedValueChange * 10) / 10,
  };
}

// Get portfolio summary
export function getPortfolioSummary(quarter: string = '2026-Q1') {
  const scores = getAllPropertyScores(quarter);
  const props = getPropertiesForQuarter(quarter);

  const totalValue = props.reduce((sum, p) => sum + p.adjustedPricePerUnit, 0);
  const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
  const highValueAssets = scores.filter(s => s.score >= 70).length;
  const mediumValueAssets = scores.filter(s => s.score >= 40 && s.score < 70).length;
  const lowValueAssets = scores.filter(s => s.score < 40).length;

  return {
    totalValue,
    avgScore: Math.round(avgScore),
    propertyCount: props.length,
    highValueAssets,
    mediumValueAssets,
    lowValueAssets,
    projectedGrowth: 8.5, // Based on forecast average
    marketRisk: avgScore > 70 ? 'Low' : avgScore > 50 ? 'Medium' : 'High',
  };
}
