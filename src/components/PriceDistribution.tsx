// @ts-nocheck
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Property, priceStats } from '../data/properties';

interface PriceDistributionProps {
  visibleProperties: Property[];
}

export default function PriceDistribution({ visibleProperties }: PriceDistributionProps) {
  const chartData = useMemo(() => {
    if (visibleProperties.length === 0) return [];

    // Create bins for histogram
    const binCount = 12;
    const binSize = (priceStats.max - priceStats.min) / binCount;
    const bins = [];

    for (let i = 0; i < binCount; i++) {
      const minPrice = priceStats.min + i * binSize;
      const maxPrice = priceStats.min + (i + 1) * binSize;
      const count = visibleProperties.filter(
        p => p.pricePerUnit >= minPrice && p.pricePerUnit < maxPrice
      ).length;

      // Get color based on normalized position
      const normalized = i / (binCount - 1);
      let color;
      if (normalized < 0.33) {
        color = '#22c55e'; // green
      } else if (normalized < 0.66) {
        color = '#eab308'; // yellow
      } else {
        color = '#ef4444'; // red
      }

      bins.push({
        range: `$${minPrice.toFixed(0)}`,
        count,
        minPrice,
        maxPrice,
        color
      });
    }

    return bins;
  }, [visibleProperties]);

  const stats = useMemo(() => {
    if (visibleProperties.length === 0) {
      return { min: 0, max: 0, avg: 0, median: 0 };
    }

    const prices = visibleProperties.map(p => p.pricePerUnit).sort((a, b) => a - b);
    const min = prices[0];
    const max = prices[prices.length - 1];
    const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const median = prices.length % 2 === 0
      ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
      : prices[Math.floor(prices.length / 2)];

    return { min, max, avg, median };
  }, [visibleProperties]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Price Distribution</h2>
        <span className="text-sm text-gray-500">{visibleProperties.length} properties</span>
      </div>

      {/* Price Legend */}
      <div className="flex items-center justify-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Lower</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Higher</span>
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
                        <p className="font-semibold">${data.minPrice.toFixed(0)} - ${data.maxPrice.toFixed(0)}</p>
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
          <div className="font-semibold text-green-600">${stats.min.toFixed(1)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Avg</div>
          <div className="font-semibold text-gray-800">${stats.avg.toFixed(1)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Median</div>
          <div className="font-semibold text-gray-800">${stats.median.toFixed(1)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Max</div>
          <div className="font-semibold text-red-600">${stats.max.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
}
