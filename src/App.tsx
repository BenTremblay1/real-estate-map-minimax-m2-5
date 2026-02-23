import { useState, useCallback } from 'react';
import PropertyMap from './components/PropertyMap';
import MetricDistribution from './components/MetricDistribution';
import LayerSelector from './components/LayerSelector';
import { Property, properties } from './data/properties';
import { getMetricByKey, getMetricStats } from './data/metrics';
import { Map, Eye, EyeOff, TrendingUp } from 'lucide-react';

function App() {
  const [visibleProperties, setVisibleProperties] = useState<Property[]>(properties);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('pricePerUnit');

  const handleVisiblePropertiesChange = useCallback((props: Property[]) => {
    setVisibleProperties(props);
  }, []);

  const currentMetric = getMetricByKey(selectedMetric);
  const metricStats = getMetricStats(properties, selectedMetric);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between z-[9000] relative">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <Map className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Real Estate Price Map</h1>
            <p className="text-xs text-gray-500">Taiwan Property Transactions</p>
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
              <span className="font-semibold">{properties.length}</span> total properties
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Map Container */}
        <div className="flex-1 relative">
          <PropertyMap
            onVisiblePropertiesChange={handleVisiblePropertiesChange}
            showHeatmap={showHeatmap}
            showMarkers={showMarkers}
            selectedMetric={selectedMetric}
          />

          {/* Map Overlay - Metric Range Indicator */}
          <div className="absolute bottom-6 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
            <div className="text-xs font-medium text-gray-600 mb-2">
              {currentMetric?.label} {currentMetric?.colorScheme === 'descending' ? '(lower is better)' : ''}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">{currentMetric?.format(metricStats.min)}</span>
              <div className="w-32 h-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
              <span className="text-xs text-gray-500">{currentMetric?.format(metricStats.max)}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 p-4 flex flex-col gap-4 overflow-y-auto">
          {/* Distribution Chart */}
          <MetricDistribution visibleProperties={visibleProperties} selectedMetric={selectedMetric} />

          {/* Info Panel */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">About This Map</h3>
            <div className="text-xs text-gray-600 space-y-2">
              <p>
                This interactive map displays <strong>414 property transactions</strong> from Taiwan's real estate market.
              </p>
              <p>
                <strong>Layers:</strong> Use the layers dropdown to visualize different property metrics on the map.
              </p>
              <p>
                <strong>Heatmap:</strong> Areas with warmer colors (red) indicate higher values, while cooler colors (green) indicate lower values.
              </p>
              <p>
                <strong>Dynamic Updates:</strong> The distribution chart updates automatically as you pan and zoom the map.
              </p>
            </div>
          </div>

          {/* Dataset Info */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Available Metrics</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Price per Unit</span>
                <span className="text-gray-400">$/unit area</span>
              </div>
              <div className="flex justify-between">
                <span>Lot Size</span>
                <span className="text-gray-400">sq ft</span>
              </div>
              <div className="flex justify-between">
                <span>Living Area</span>
                <span className="text-gray-400">sq ft</span>
              </div>
              <div className="flex justify-between">
                <span>Year Built</span>
                <span className="text-gray-400">year</span>
              </div>
              <div className="flex justify-between">
                <span>House Age</span>
                <span className="text-gray-400">years</span>
              </div>
              <div className="flex justify-between">
                <span>Distance to MRT</span>
                <span className="text-gray-400">meters</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
