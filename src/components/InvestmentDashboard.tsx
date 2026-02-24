// @ts-nocheck
import { useState } from 'react';
import { TrendingUp, Calendar, Activity, AlertTriangle, DollarSign, BarChart3 } from 'lucide-react';
import { quarters } from '../data/constants';

// Simple static KPI data
const kpiData = {
  cyclePhase: 'Expansion',
  confidence: 80,
  avgScore: 67,
  projectedGrowth: 8.5,
  riskLevel: 'Medium',
  highValueAssets: 142,
};

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
        {/* KPI Cards - Simple Version */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Market Cycle */}
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-slate-400 text-sm">Market Cycle</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {kpiData.cyclePhase}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {kpiData.confidence}% confidence
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-slate-400 text-sm">Avg. Score</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {kpiData.avgScore}/100
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {kpiData.highValueAssets} high-value assets
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
              +{kpiData.projectedGrowth}%
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
            <div className="text-2xl font-bold text-amber-400">
              {kpiData.riskLevel}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Based on scoring analysis
            </div>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-slate-900 rounded-xl p-12 border border-slate-800 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/20 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Advanced Analytics Coming Soon</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            We're working on bringing you predictive forecasting, deal scoring,
            correlation analysis, and stress testing. Check back soon!
          </p>
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
              <span>Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
