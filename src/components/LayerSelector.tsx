// @ts-nocheck
import { useState, useRef, useEffect } from 'react';
import { metrics, MetricConfig } from '../data/metrics';
import { Layers, ChevronDown } from 'lucide-react';

interface LayerSelectorProps {
  selectedMetric: string;
  onMetricChange: (metricKey: string) => void;
}

export default function LayerSelector({ selectedMetric, onMetricChange }: LayerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentMetric = metrics.find(m => m.key === selectedMetric) || metrics[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200 transition-all"
      >
        <Layers className="w-4 h-4" />
        <span>{currentMetric.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-[2000] overflow-hidden">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Map Layers</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {metrics.map((metric) => (
              <button
                key={metric.key}
                onClick={() => {
                  onMetricChange(metric.key);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3 border-b border-gray-100 last:border-b-0 ${
                  metric.key === selectedMetric ? 'bg-emerald-50' : ''
                }`}
              >
                <div className={`w-4 h-4 rounded-full mt-0.5 flex-shrink-0 ${
                  metric.key === selectedMetric
                    ? 'bg-emerald-500'
                    : 'border-2 border-gray-300'
                }`}>
                  {metric.key === selectedMetric && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium text-sm ${
                      metric.key === selectedMetric ? 'text-emerald-700' : 'text-gray-900'
                    }`}>
                      {metric.label}
                    </span>
                    <span className="text-xs text-gray-400">{metric.unit}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{metric.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
