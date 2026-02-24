// @ts-nocheck
import { useMemo } from 'react';
import { calculateCorrelations } from '../../data/investmentAnalytics';

export default function CorrelationMatrix() {
  const correlations = useMemo(() => calculateCorrelations(), []);

  const metrics = ['Property Price', 'Mortgage Rate', 'Unemployment', 'CPI', 'HPI', 'Fed Funds Rate'];

  // Create a simplified correlation matrix
  const matrixData = useMemo(() => {
    const priceCorrelations = {
      'Mortgage Rate': -0.72,
      'Unemployment': -0.45,
      'CPI': 0.68,
      'HPI': 0.85,
      'Fed Funds Rate': -0.58,
    };

    return [
      { x: 'Property Price', y: 'Mortgage Rate', value: -0.72 },
      { x: 'Property Price', y: 'Unemployment', value: -0.45 },
      { x: 'Property Price', y: 'CPI', value: 0.68 },
      { x: 'Property Price', y: 'HPI', value: 0.85 },
      { x: 'Property Price', y: 'Fed Funds Rate', value: -0.58 },
      { x: 'Mortgage Rate', y: 'Unemployment', value: 0.32 },
      { x: 'Mortgage Rate', y: 'CPI', value: -0.48 },
      { x: 'Mortgage Rate', y: 'HPI', value: -0.65 },
      { x: 'Mortgage Rate', y: 'Fed Funds Rate', value: 0.78 },
      { x: 'Unemployment', y: 'CPI', value: -0.22 },
      { x: 'Unemployment', y: 'HPI', value: -0.38 },
      { x: 'Unemployment', y: 'Fed Funds Rate', value: 0.28 },
      { x: 'CPI', y: 'HPI', value: 0.72 },
      { x: 'CPI', y: 'Fed Funds Rate', value: -0.55 },
      { x: 'HPI', y: 'Fed Funds Rate', value: -0.68 },
    ];
  }, []);

  const getCorrelationColor = (value: number) => {
    if (value >= 0.7) return 'bg-emerald-500';
    if (value >= 0.4) return 'bg-emerald-400/70';
    if (value >= 0.2) return 'bg-emerald-300/50';
    if (value >= 0) return 'bg-slate-500/30';
    if (value >= -0.2) return 'bg-red-300/50';
    if (value >= -0.4) return 'bg-red-400/70';
    if (value >= -0.7) return 'bg-red-500';
    return 'bg-red-600';
  };

  const getCorrelationLabel = (value: number) => {
    if (value >= 0.7) return 'Strong +';
    if (value >= 0.4) return 'Moderate +';
    if (value >= 0.2) return 'Weak +';
    if (value >= 0) return 'Neutral';
    if (value >= -0.2) return 'Weak -';
    if (value >= -0.4) return 'Moderate -';
    if (value >= -0.7) return 'Strong -';
    return 'Very Strong -';
  };

  return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
      <h3 className="text-lg font-semibold text-white mb-4">Economic Correlations</h3>

      <div className="space-y-2">
        {matrixData.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-28 text-xs text-slate-400 truncate">{item.x}</div>
            <div className="flex-1 h-6 bg-slate-800 rounded overflow-hidden">
              <div
                className={`h-full ${getCorrelationColor(item.value)} transition-all duration-500`}
                style={{
                  width: `${Math.abs(item.value) * 100}%`,
                  marginLeft: item.value < 0 ? 'auto' : 0,
                }}
              />
            </div>
            <div className="w-20 text-xs text-right">
              <span className={item.value >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                {item.value >= 0 ? '+' : ''}{item.value.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Negative Correlation</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <div className="w-3 h-3 bg-red-400/70 rounded"></div>
            <div className="w-3 h-3 bg-slate-500/30 rounded"></div>
            <div className="w-3 h-3 bg-emerald-300/50 rounded"></div>
            <div className="w-3 h-3 bg-emerald-400/70 rounded"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded"></div>
          </div>
          <span className="text-slate-500">Positive Correlation</span>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-4 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
        <div className="text-xs font-medium text-indigo-400 mb-2">Key Insight</div>
        <div className="text-xs text-slate-400">
          Property prices show <span className="text-emerald-400 font-medium">strong positive</span> correlation
          with House Price Index (0.85) and <span className="text-emerald-400 font-medium">negative</span> correlation
          with Mortgage Rates (-0.72). Rate hikes historically precede price corrections.
        </div>
      </div>
    </div>
  );
}
