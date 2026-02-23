// @ts-nocheck
import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Home, Building, Percent, Activity } from 'lucide-react';
import { getEconomicData, getYoYChange, EconomicData } from '../data/fredData';

interface EconomicIndicatorsPanelProps {
  selectedQuarter: string;
}

interface IndicatorCardProps {
  label: string;
  value: string;
  change: number | null;
  icon: React.ReactNode;
  unit?: string;
  invertColors?: boolean; // For metrics where lower is better (like unemployment)
}

function IndicatorCard({ label, value, change, icon, unit = '', invertColors = false }: IndicatorCardProps) {
  const isPositive = change !== null && change > 0;
  const isNegative = change !== null && change < 0;

  // Determine if the change is "good" or "bad"
  const isGood = invertColors ? isNegative : isPositive;
  const isBad = invertColors ? isPositive : isNegative;

  return (
    <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <span className="text-gray-400">{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold text-gray-900">{value}{unit}</span>
        {change !== null && (
          <span className={`text-xs font-medium flex items-center gap-0.5 ${
            isGood ? 'text-green-600' : isBad ? 'text-red-600' : 'text-gray-500'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : isNegative ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {change.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

export default function EconomicIndicatorsPanel({ selectedQuarter }: EconomicIndicatorsPanelProps) {
  const data = useMemo(() => getEconomicData(selectedQuarter), [selectedQuarter]);

  const yoyChanges = useMemo(() => ({
    mortgageRate30Y: getYoYChange(selectedQuarter, 'mortgageRate30Y'),
    unemploymentRate: getYoYChange(selectedQuarter, 'unemploymentRate'),
    housePriceIndex: getYoYChange(selectedQuarter, 'housePriceIndex'),
    buildingPermits: getYoYChange(selectedQuarter, 'buildingPermits'),
    cpi: getYoYChange(selectedQuarter, 'cpi'),
    federalFundsRate: getYoYChange(selectedQuarter, 'federalFundsRate'),
  }), [selectedQuarter]);

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <p className="text-gray-500 text-sm">No economic data available for this period</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Economic Indicators</h3>
        <span className="text-xs text-gray-400">YoY Change</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <IndicatorCard
          label="30Y Mortgage"
          value={data.mortgageRate30Y.toFixed(2)}
          unit="%"
          change={yoyChanges.mortgageRate30Y}
          icon={<Percent className="w-4 h-4" />}
          invertColors={true}
        />

        <IndicatorCard
          label="Unemployment"
          value={data.unemploymentRate.toFixed(1)}
          unit="%"
          change={yoyChanges.unemploymentRate}
          icon={<Users className="w-4 h-4" />}
          invertColors={true}
        />

        <IndicatorCard
          label="Home Price Index"
          value={data.housePriceIndex.toFixed(0)}
          change={yoyChanges.housePriceIndex}
          icon={<Home className="w-4 h-4" />}
        />

        <IndicatorCard
          label="Building Permits"
          value={(data.buildingPermits / 1000).toFixed(1) + 'K'}
          change={yoyChanges.buildingPermits}
          icon={<Building className="w-4 h-4" />}
        />

        <IndicatorCard
          label="CPI (Inflation)"
          value={data.cpi.toFixed(1)}
          change={yoyChanges.cpi}
          icon={<DollarSign className="w-4 h-4" />}
          invertColors={true}
        />

        <IndicatorCard
          label="Fed Funds Rate"
          value={data.federalFundsRate.toFixed(2)}
          unit="%"
          change={yoyChanges.federalFundsRate}
          icon={<Activity className="w-4 h-4" />}
        />
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">GDP Growth</span>
          <span className={`font-semibold ${data.gdpGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.gdpGrowth >= 0 ? '+' : ''}{data.gdpGrowth.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
        <p>Data source: FRED (Federal Reserve Economic Data)</p>
        <p className="mt-1">Add your API key to fetch live data</p>
      </div>
    </div>
  );
}
