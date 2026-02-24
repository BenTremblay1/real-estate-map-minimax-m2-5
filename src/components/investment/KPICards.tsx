// @ts-nocheck
import { useMemo } from 'react';
import { TrendingUp, Activity, AlertTriangle, DollarSign } from 'lucide-react';
import { determineMarketCycle, getPortfolioSummary } from '../../data/investmentAnalytics';

interface KPICardsProps {
  selectedQuarter: string;
}

export default function KPICards({ selectedQuarter }: KPICardsProps) {
  const cycle = useMemo(() => determineMarketCycle(selectedQuarter), [selectedQuarter]);
  const portfolio = useMemo(() => getPortfolioSummary(selectedQuarter), [selectedQuarter]);

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Recovery': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'Expansion': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'Peak': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      case 'Recession': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'Hypersupply': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-emerald-400';
      case 'Medium': return 'text-amber-400';
      case 'High': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Market Cycle */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg ${getPhaseColor(cycle.phase)}`}>
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-slate-400 text-sm">Market Cycle</span>
        </div>
        <div className={`text-2xl font-bold ${getPhaseColor(cycle.phase).split(' ')[0]}`}>
          {cycle.phase}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {cycle.confidence}% confidence
        </div>
      </div>

      {/* Average Score */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-slate-400 text-sm">Avg. Score</span>
        </div>
        <div className="text-2xl font-bold text-white">
          {portfolio.avgScore}/100
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {portfolio.highValueAssets} high-value assets
        </div>
      </div>

      {/* Projected Growth */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-slate-400 text-sm">Projected Growth</span>
        </div>
        <div className="text-2xl font-bold text-emerald-400">
          +{portfolio.projectedGrowth}%
        </div>
        <div className="text-xs text-slate-500 mt-1">
          8-quarter forecast
        </div>
      </div>

      {/* Portfolio Risk */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span className="text-slate-400 text-sm">Portfolio Risk</span>
        </div>
        <div className={`text-2xl font-bold ${getRiskColor(portfolio.marketRisk)}`}>
          {portfolio.marketRisk}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Based on scoring analysis
        </div>
      </div>
    </div>
  );
}
