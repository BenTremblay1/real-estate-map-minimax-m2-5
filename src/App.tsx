import { useState, useCallback, useMemo } from 'react';
import PropertyMap from './components/PropertyMap';
import MetricDistribution from './components/MetricDistribution';
import LayerSelector from './components/LayerSelector';
import TimeSlider from './components/TimeSlider';
import EconomicIndicatorsPanel from './components/EconomicIndicatorsPanel';
import { Property, properties } from './data/properties';
import { getPropertiesForQuarter, HistoricalProperty } from './data/historicalData';
import { getMetricByKey, getMetricStats } from './data/metrics';
import { Map, Eye, EyeOff, TrendingUp } from 'lucide-react';

function App() {
  const [visibleProperties, setVisibleProperties] = useState<(Property | HistoricalProperty)[]>(properties);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('pricePerUnit');
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q1');

  // Get properties adjusted for the selected quarter
  const quarterProperties = useMemo(() => {
    return getPropertiesForQuarter(selectedQuarter);
  }, [selectedQuarter]);

  const handleVisiblePropertiesChange = useCallback((props: (Property | HistoricalProperty)[]) => {
    setVisibleProperties(props);
  }, []);

  const currentMetric = getMetricByKey(selectedMetric);

  // Use adjusted price for the metric calculation when pricePerUnit is selected
  const effectiveMetricKey = selectedMetric === 'pricePerUnit' ? 'adjustedPricePerUnit' : selectedMetric;
  const metricStats = useMemo(() => {
    if (selectedMetric === 'pricePerUnit') {
      const values = quarterProperties.map(p => p.adjustedPricePerUnit);
      return {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
      };
    }
    return getMetricStats(quarterProperties, selectedMetric);
  }, [quarterProperties, selectedMetric]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between z-[9000] relative">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <Map className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Real Estate Analytics</h1>
            <p className="text-xs text-gray-500">Taiwan Property Market Dashboard</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Layer Selector */}
          <LayerSelector
            selectedMetric={selectedMetric}
            onMetricChange={setSelectedMetric}
          />

          {/* Toggle Heatmap */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              showHeatmap
                ? 'bg-orange-100 text-orange-700 border border-orange-300'
                : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
            Heatmap
          </button>

          {/* Toggle Markers */}
          <button
            onClick={() => setShowMarkers(!showMarkers)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              showMarkers
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
          >
            {showMarkers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            Markers
          </button>

          {/* Stats Badge */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              <span className="font-semibold">{quarterProperties.length}</span> properties
            </span>
          </div>
        </div>
      </header>

      {/* Time Slider */}
      <TimeSlider
        selectedQuarter={selectedQuarter}
        onQuarterChange={setSelectedQuarter}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 relative">
          <PropertyMap
            properties={quarterProperties}
            onVisiblePropertiesChange={handleVisiblePropertiesChange}
            showHeatmap={showHeatmap}
            showMarkers={showMarkers}
            selectedMetric={selectedMetric}
            selectedQuarter={selectedQuarter}
          />

          {/* Map Overlay - Metric Range Indicator */}
          <div className="absolute bottom-6 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
            <div className="text-xs font-medium text-gray-600 mb-2">
              {currentMetric?.label} {currentMetric?.colorScheme === 'descending' ? '(lower is better)' : ''}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">
                {selectedMetric === 'pricePerUnit'
                  ? `$${metricStats.min.toFixed(0)}`
                  : currentMetric?.format(metricStats.min)}
              </span>
              <div className="w-32 h-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
              <span className="text-xs text-gray-500">
                {selectedMetric === 'pricePerUnit'
                  ? `$${metricStats.max.toFixed(0)}`
                  : currentMetric?.format(metricStats.max)}
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 p-4 flex flex-col gap-4 overflow-y-auto bg-gray-50">
          {/* Economic Indicators */}
          <EconomicIndicatorsPanel selectedQuarter={selectedQuarter} />

          {/* Distribution Chart */}
          <MetricDistribution
            visibleProperties={visibleProperties}
            selectedMetric={selectedMetric}
            selectedQuarter={selectedQuarter}
          />

          {/* Info Panel */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Data Sources</h3>
            <div className="text-xs text-gray-600 space-y-2">
              <p><strong>Property Data:</strong> Taiwan real estate transactions (414 properties)</p>
              <p><strong>Economic Data:</strong> FRED (Federal Reserve Economic Data)</p>
              <p><strong>Time Range:</strong> Q1 2020 - Q1 2026</p>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Coming Soon</h4>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• CoStar vacancy rates</li>
                <li>• Walk Score integration</li>
                <li>• School ratings overlay</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
