// @ts-nocheck
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Property } from '../data/properties';
import { getMetricByKey, getMetricStats, MetricConfig } from '../data/metrics';

interface MetricDistributionProps {
  visibleProperties: Property[];
  selectedMetric: string;
}

export default function MetricDistribution({ visibleProperties, selectedMetric }: MetricDistributionProps) {
  const metric = getMetricByKey(selectedMetric);

  const chartData = useMemo(() => {
    if (visibleProperties.length === 0 || !metric) return [];

    const values = visibleProperties.map(p => p[selectedMetric] as number);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    // Create bins for histogram
    const binCount = 12;
    const binSize = (maxValue - minValue) / binCount || 1;
    const bins = [];

    for (let i = 0; i < binCount; i++) {
      const binMin = minValue + i * binSize;
      const binMax = minValue + (i + 1) * binSize;
      const count = visibleProperties.filter(
        p => {
          const val = p[selectedMetric] as number;
          return val >= binMin && val < binMax;
        }
      ).length;

      // Get color based on normalized position
      let normalized = i / (binCount - 1);

      // For descending metrics (lower is better), invert the color scale
      if (metric.colorScheme === 'descending') {
        normalized = 1 - normalized;
      }

      let color;
      if (normalized < 0.33) {
        color = '#22c55e'; // green
      } else if (normalized < 0.66) {
        color = '#eab308'; // yellow
      } else {
        color = '#ef4444'; // red
      }

      bins.push({
        range: metric.format(binMin),
        count,
        binMin,
        binMax,
        color
      });
    }

    return bins;
  }, [visibleProperties, selectedMetric, metric]);

  const stats = useMemo(() => {
    if (visibleProperties.length === 0) {
      return { min: 0, max: 0, avg: 0, median: 0 };
    }

    const values = visibleProperties.map(p => p[selectedMetric] as number).sort((a, b) => a - b);
    const min = values[0];
    const max = values[values.length - 1];
    const avg = values.reduce((sum, p) => sum + p, 0) / values.length;
    const median = values.length % 2 === 0
      ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
      : values[Math.floor(values.length / 2)];

    return { min, max, avg, median };
  }, [visibleProperties, selectedMetric]);

  const isDescending = metric?.colorScheme === 'descending';

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">{metric?.label || 'Distribution'}</h2>
        <span className="text-sm text-gray-500">{visibleProperties.length} properties</span>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>{isDescending ? 'Better' : 'Lower'}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>{isDescending ? 'Worse' : 'Higher'}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[200px]">
        {visibleProperties.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <XAxis
                dataKey="range"
                tick={{ fontSize: 10 }}
                interval={1}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-sm">
                        <p className="font-semibold">{metric?.format(data.binMin)} - {metric?.format(data.binMax)}</p>
                        <p className="text-gray-600">{data.count} properties</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No properties in current view
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-xs text-gray-500">Min</div>
          <div className={`font-semibold ${isDescending ? 'text-red-600' : 'text-green-600'}`}>
            {metric?.format(stats.min) || stats.min.toFixed(1)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Avg</div>
          <div className="font-semibold text-gray-800">
            {metric?.format(stats.avg) || stats.avg.toFixed(1)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Median</div>
          <div className="font-semibold text-gray-800">
            {metric?.format(stats.median) || stats.median.toFixed(1)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Max</div>
          <div className={`font-semibold ${isDescending ? 'text-green-600' : 'text-red-600'}`}>
            {metric?.format(stats.max) || stats.max.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
}
