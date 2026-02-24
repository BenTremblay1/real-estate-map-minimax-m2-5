// @ts-nocheck
import { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { generateForecast } from '../../data/investmentAnalytics';

export default function PredictiveForecastChart() {
  const forecastData = useMemo(() => generateForecast(8), []);

  // Handle empty data case
  if (!forecastData || forecastData.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
        <h3 className="text-lg font-semibold text-white mb-4">Price Forecast</h3>
        <div className="h-72 flex items-center justify-center text-slate-500">
          Loading forecast data...
        </div>
      </div>
    );
  }

  const formatYAxis = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <div className="text-sm font-medium text-white mb-1">{label}</div>
          <div className="text-xs space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">
                {data.isForecast ? 'Forecast' : 'Historical'}:
              </span>
              <span className="text-indigo-400 font-medium">
                ${data.predictedPrice.toLocaleString()}
              </span>
            </div>
            {data.isForecast && (
              <>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Upper 95%:</span>
                  <span className="text-emerald-400">
                    ${data.upperBound.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Lower 95%:</span>
                  <span className="text-red-400">
                    ${data.lowerBound.toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Find the transition point between historical and forecast
  const transitionIndex = forecastData.findIndex(d => d.isForecast);

  return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Price Forecast</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-indigo-500"></div>
            <span className="text-slate-400">Historical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-indigo-400 border-dashed border-t border-indigo-400"></div>
            <span className="text-slate-400">Forecast</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500/20 border border-indigo-500/50"></div>
            <span className="text-slate-400">95% CI</span>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="quarter"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10 }}
              interval={3}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickFormatter={formatYAxis}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Confidence interval area (only for forecast) */}
            <Area
              type="monotone"
              dataKey="upperBound"
              stroke="none"
              fill="url(#confidenceGradient)"
              fillOpacity={1}
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="lowerBound"
              stroke="none"
              fill="#0f172a"
              fillOpacity={1}
              animationDuration={1000}
            />

            {/* Historical line */}
            <Line
              type="monotone"
              dataKey="predictedPrice"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              connectNulls
              animationDuration={1500}
              segment={forecastData.map((d, i) => ({
                stroke: d.isForecast ? undefined : '#6366f1',
                strokeDasharray: d.isForecast ? '5 5' : undefined,
              }))}
            />

            {/* Transition line */}
            {transitionIndex > 0 && (
              <ReferenceLine
                x={forecastData[transitionIndex]?.quarter}
                stroke="#6366f1"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-800">
        <div>
          <div className="text-xs text-slate-500">Current Avg Price</div>
          <div className="text-sm font-medium text-white">
            ${forecastData[transitionIndex - 1]?.predictedPrice.toLocaleString() || 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500">8Q Forecast</div>
          <div className="text-sm font-medium text-indigo-400">
            ${forecastData[forecastData.length - 1]?.predictedPrice.toLocaleString() || 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Growth Projection</div>
          <div className="text-sm font-medium text-emerald-400">
            {forecastData.length > transitionIndex && (
              <>
                +
                {(
                  ((forecastData[forecastData.length - 1]?.predictedPrice -
                    forecastData[transitionIndex - 1]?.predictedPrice) /
                    forecastData[transitionIndex - 1]?.predictedPrice) *
                  100
                ).toFixed(1)}
                %
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
