// @ts-nocheck
import { useState } from 'react';
import KPICards from './investment/KPICards';
import MarketCycleGauge from './investment/MarketCycleGauge';
import PredictiveForecastChart from './investment/PredictiveForecastChart';
import DealScoringTable from './investment/DealScoringTable';
import CorrelationMatrix from './investment/CorrelationMatrix';
import StressTestPanel from './investment/StressTestPanel';
import { TrendingUp, Calendar } from 'lucide-react';
import { quarters } from '../data/constants';

export default function InvestmentDashboard() {
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q1');

  return (
    <div className="h-full overflow-auto bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Investment Intelligence</h1>
              <p className="text-xs text-slate-400">AI-Powered Real Estate Analytics</p>
            </div>
          </div>

          {/* Quarter Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {quarters.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* KPI Cards */}
        <div className="mb-6">
          <KPICards selectedQuarter={selectedQuarter} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Row 2: Forecast (8 cols) + Deal Scoring (4 cols) */}
          <div className="lg:col-span-8">
            <PredictiveForecastChart />
          </div>
          <div className="lg:col-span-4">
            <DealScoringTable selectedQuarter={selectedQuarter} />
          </div>

          {/* Row 3: Market Cycle (4 cols) + Correlation (4 cols) + Stress Test (4 cols) */}
          <div className="lg:col-span-4">
            <MarketCycleGauge selectedQuarter={selectedQuarter} />
          </div>
          <div className="lg:col-span-4">
            <CorrelationMatrix />
          </div>
          <div className="lg:col-span-4">
            <StressTestPanel />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 p-4 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span>Data Sources: Taiwan Property Transactions, FRED Economic Data</span>
              <span className="text-slate-700">|</span>
              <span>414 Properties Analyzed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Live Analysis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
