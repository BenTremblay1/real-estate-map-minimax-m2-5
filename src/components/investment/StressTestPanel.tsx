// @ts-nocheck
import { useState, useMemo } from 'react';
import { getPortfolioSummary, calculateStressScenario } from '../../data/investmentAnalytics';
import { AlertTriangle, TrendingDown, TrendingUp, RefreshCw } from 'lucide-react';

export default function StressTestPanel() {
  const [interestRateChange, setInterestRateChange] = useState(0);
  const [vacancyChange, setVacancyChange] = useState(0);
  const [rentGrowthChange, setRentGrowthChange] = useState(0);

  const basePortfolio = useMemo(() => getPortfolioSummary('2026-Q1'), []);

  const scenario = useMemo(
    () =>
      calculateStressScenario(
        basePortfolio.totalValue,
        interestRateChange,
        vacancyChange,
        rentGrowthChange
      ),
    [basePortfolio.totalValue, interestRateChange, vacancyChange, rentGrowthChange]
  );

  const projectedValue = useMemo(() => {
    const changeAmount = (basePortfolio.totalValue * scenario.projectedValueChange) / 100;
    return basePortfolio.totalValue + changeAmount;
  }, [basePortfolio.totalValue, scenario]);

  const resetSliders = () => {
    setInterestRateChange(0);
    setVacancyChange(0);
    setRentGrowthChange(0);
  };

  return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Stress Test</h3>
        <button
          onClick={resetSliders}
          className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        {/* Interest Rate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-slate-400">Interest Rate Change</label>
            <span
              className={`text-xs font-medium ${
                interestRateChange > 0 ? 'text-red-400' : interestRateChange < 0 ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              {interestRateChange > 0 ? '+' : ''}{interestRateChange}%
            </span>
          </div>
          <input
            type="range"
            min="-2"
            max="4"
            step="0.5"
            value={interestRateChange}
            onChange={(e) => setInterestRateChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>-2%</span>
            <span>0%</span>
            <span>+4%</span>
          </div>
        </div>

        {/* Vacancy */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-slate-400">Vacancy Change</label>
            <span
              className={`text-xs font-medium ${
                vacancyChange > 0 ? 'text-red-400' : vacancyChange < 0 ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              {vacancyChange > 0 ? '+' : ''}{vacancyChange}%
            </span>
          </div>
          <input
            type="range"
            min="-5"
            max="10"
            step="1"
            value={vacancyChange}
            onChange={(e) => setVacancyChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>-5%</span>
            <span>0%</span>
            <span>+10%</span>
          </div>
        </div>

        {/* Rent Growth */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-slate-400">Rent Growth Change</label>
            <span
              className={`text-xs font-medium ${
                rentGrowthChange > 0 ? 'text-emerald-400' : rentGrowthChange < 0 ? 'text-red-400' : 'text-slate-400'
              }`}
            >
              {rentGrowthChange > 0 ? '+' : ''}{rentGrowthChange}%
            </span>
          </div>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.5"
            value={rentGrowthChange}
            onChange={(e) => setRentGrowthChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>-5%</span>
            <span>0%</span>
            <span>+5%</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-400">Projected Portfolio Impact</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-500">Current Value</div>
            <div className="text-lg font-semibold text-white">
              ${(basePortfolio.totalValue / 1000000).toFixed(2)}M
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Projected Value</div>
            <div className={`text-lg font-semibold ${scenario.projectedValueChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${(projectedValue / 1000000).toFixed(2)}M
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {scenario.projectedValueChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className="text-sm font-medium text-slate-300">Value Change</span>
          </div>
          <span
            className={`text-sm font-bold ${
              scenario.projectedValueChange >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {scenario.projectedValueChange >= 0 ? '+' : ''}{scenario.projectedValueChange.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
