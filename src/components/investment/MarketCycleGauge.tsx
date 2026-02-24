// @ts-nocheck
import { useMemo } from 'react';
import { determineMarketCycle } from '../../data/investmentAnalytics';

interface MarketCycleGaugeProps {
  selectedQuarter: string;
}

export default function MarketCycleGauge({ selectedQuarter }: MarketCycleGaugeProps) {
  const cycle = useMemo(() => determineMarketCycle(selectedQuarter), [selectedQuarter]);

  const phases = ['Recovery', 'Expansion', 'Peak', 'Recession', 'Hypersupply'];
  const currentIndex = phases.indexOf(cycle.phase);

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Recovery': return '#3b82f6';
      case 'Expansion': return '#10b981';
      case 'Peak': return '#f59e0b';
      case 'Recession': return '#ef4444';
      case 'Hypersupply': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
      <h3 className="text-lg font-semibold text-white mb-4">Market Cycle Position</h3>

      <div className="relative">
        {/* Gauge visualization */}
        <div className="h-32 relative">
          {/* Background arc */}
          <svg viewBox="0 0 300 160" className="w-full h-full">
            {/* Phase segments */}
            {phases.map((phase, index) => {
              const startAngle = -90 + (index * 72);
              const endAngle = startAngle + 72;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;

              const x1 = 150 + 130 * Math.cos(startRad);
              const y1 = 160 + 130 * Math.sin(startRad);
              const x2 = 150 + 130 * Math.cos(endRad);
              const y2 = 160 + 130 * Math.sin(endRad);

              const isActive = index === currentIndex;
              const isPast = index < currentIndex;

              return (
                <g key={phase}>
                  <path
                    d={`M ${x1} ${y1} A 130 130 0 0 1 ${x2} ${y2}`}
                    fill="none"
                    stroke={getPhaseColor(phase)}
                    strokeWidth={isActive ? 12 : 8}
                    strokeOpacity={isActive ? 1 : isPast ? 0.3 : 0.15}
                    className="transition-all duration-500"
                  />
                </g>
              );
            })}

            {/* Needle */}
            <g transform={`rotate(${-90 + currentIndex * 72 + 36}, 150, 160)`}>
              <line
                x1="150"
                y1="160"
                x2="150"
                y2="40"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="150" cy="160" r="8" fill="white" />
            </g>
          </svg>
        </div>

        {/* Phase labels */}
        <div className="flex justify-between mt-2 px-2">
          {phases.map((phase, index) => (
            <div
              key={phase}
              className={`text-xs font-medium transition-all ${
                index === currentIndex
                  ? 'text-white scale-110'
                  : index < currentIndex
                  ? 'text-slate-500'
                  : 'text-slate-600'
              }`}
              style={{ color: index === currentIndex ? getPhaseColor(phase) : undefined }}
            >
              {phase.slice(0, 4)}
            </div>
          ))}
        </div>
      </div>

      {/* Phase description */}
      <div className="mt-4 p-3 rounded-lg bg-slate-800/50">
        <div className="text-sm font-medium text-white mb-1">{cycle.phase} Phase</div>
        <div className="text-xs text-slate-400">{cycle.description}</div>
        <div className="mt-2 flex items-center gap-2">
          <div className="text-xs text-slate-500">Confidence:</div>
          <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${cycle.confidence}%` }}
            />
          </div>
          <div className="text-xs text-slate-400">{cycle.confidence}%</div>
        </div>
      </div>
    </div>
  );
}
