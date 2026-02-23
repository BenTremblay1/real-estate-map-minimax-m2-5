import { useState, useCallback } from 'react';
import PropertyMap from './components/PropertyMap';
import PriceDistribution from './components/PriceDistribution';
import { Property, properties, priceStats } from './data/properties';
import { Map, Layers, Eye, EyeOff, TrendingUp } from 'lucide-react';

function App() {
  const [visibleProperties, setVisibleProperties] = useState<Property[]>(properties);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);

  const handleVisiblePropertiesChange = useCallback((props: Property[]) => {
    setVisibleProperties(props);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
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
          {/* Toggle Heatmap */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              showHeatmap
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            Heatmap
          </button>

          {/* Toggle Markers */}
          <button
            onClick={() => setShowMarkers(!showMarkers)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              showMarkers
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
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
          />

          {/* Map Overlay - Price Range Indicator */}
          <div className="absolute bottom-6 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
            <div className="text-xs font-medium text-gray-600 mb-2">Price per Unit Area</div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">${priceStats.min.toFixed(0)}</span>
              <div className="w-32 h-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
              <span className="text-xs text-gray-500">${priceStats.max.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 p-4 flex flex-col gap-4 overflow-y-auto">
          {/* Distribution Chart */}
          <PriceDistribution visibleProperties={visibleProperties} />

          {/* Info Panel */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">About This Map</h3>
            <div className="text-xs text-gray-600 space-y-2">
              <p>
                This interactive map displays <strong>414 property transactions</strong> from Taiwan's real estate market.
              </p>
              <p>
                <strong>Heatmap:</strong> Areas with warmer colors (red) indicate higher price per unit area, while cooler colors (green) indicate lower prices.
              </p>
              <p>
                <strong>Dynamic Updates:</strong> The price distribution chart updates automatically as you pan and zoom the map to show only visible properties.
              </p>
            </div>
          </div>

          {/* Dataset Info */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Dataset Columns</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Transaction Date</span>
                <span className="text-gray-400">2012-2013</span>
              </div>
              <div className="flex justify-between">
                <span>House Age</span>
                <span className="text-gray-400">0-43.8 years</span>
              </div>
              <div className="flex justify-between">
                <span>Distance to MRT</span>
                <span className="text-gray-400">23-6,488m</span>
              </div>
              <div className="flex justify-between">
                <span>Convenience Stores</span>
                <span className="text-gray-400">0-10 nearby</span>
              </div>
              <div className="flex justify-between">
                <span>Price/Unit Area</span>
                <span className="text-gray-400">${priceStats.min.toFixed(1)}-${priceStats.max.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
