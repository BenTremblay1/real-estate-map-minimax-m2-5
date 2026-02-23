// @ts-nocheck
import { useEffect, useRef, useCallback } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { Property } from '../data/properties';
import { HistoricalProperty } from '../data/historicalData';
import { getMetricByKey, getMetricStats, getMetricColor, getMetricIntensity } from '../data/metrics';

interface PropertyMapProps {
  properties: (Property | HistoricalProperty)[];
  onVisiblePropertiesChange: (visibleProperties: (Property | HistoricalProperty)[]) => void;
  showHeatmap: boolean;
  showMarkers: boolean;
  selectedMetric: string;
  selectedQuarter: string;
}

export default function PropertyMap({
  properties,
  onVisiblePropertiesChange,
  showHeatmap,
  showMarkers,
  selectedMetric,
  selectedQuarter
}: PropertyMapProps) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const heatLayerRef = useRef(null);
  const markersLayerRef = useRef(null);

  const updateVisibleProperties = useCallback(() => {
    if (!mapRef.current) return;

    const bounds = mapRef.current.getBounds();
    const visibleProps = properties.filter(p =>
      bounds.contains([p.latitude, p.longitude])
    );
    onVisiblePropertiesChange(visibleProps);
  }, [onVisiblePropertiesChange, properties]);

  // Get the effective value for a property based on selected metric
  const getPropertyValue = useCallback((p: Property | HistoricalProperty, metric: string) => {
    if (metric === 'pricePerUnit' && 'adjustedPricePerUnit' in p) {
      return p.adjustedPricePerUnit;
    }
    return p[metric] as number;
  }, []);

  const updateHeatmap = useCallback(() => {
    if (!mapRef.current) return;

    // Remove existing heat layer
    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (!showHeatmap) return;

    const metric = getMetricByKey(selectedMetric);
    const values = properties.map(p => getPropertyValue(p, selectedMetric));
    const stats = {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
    };
    const colorScheme = metric?.colorScheme || 'ascending';

    // Create heatmap data with intensity based on selected metric
    const heatData = properties.map(p => [
      p.latitude,
      p.longitude,
      getMetricIntensity(getPropertyValue(p, selectedMetric), stats.min, stats.max, colorScheme)
    ]);

    // Create heat layer with custom gradient
    heatLayerRef.current = (L as any).heatLayer(heatData, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.0: '#22c55e',  // green - low value
        0.3: '#84cc16',  // lime
        0.5: '#eab308',  // yellow - medium value
        0.7: '#f97316',  // orange
        1.0: '#ef4444'   // red - high value
      }
    });

    heatLayerRef.current.addTo(mapRef.current);
  }, [showHeatmap, selectedMetric, properties, getPropertyValue]);

  const updateMarkers = useCallback(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    } else {
      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }

    if (!showMarkers) return;

    const metric = getMetricByKey(selectedMetric);
    const values = properties.map(p => getPropertyValue(p, selectedMetric));
    const stats = {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
    };
    const colorScheme = metric?.colorScheme || 'ascending';

    // Add markers for each property
    properties.forEach(p => {
      const value = getPropertyValue(p, selectedMetric);
      const color = getMetricColor(value, stats.min, stats.max, colorScheme);

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: ${color};
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      const marker = L.marker([p.latitude, p.longitude], { icon });

      // Get display price (adjusted if available)
      const displayPrice = 'adjustedPricePerUnit' in p ? p.adjustedPricePerUnit : p.pricePerUnit;
      const priceChange = 'priceChange' in p ? p.priceChange : null;

      marker.bindPopup(`
        <div style="min-width: 240px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">Property #${p.id}</h3>
          <div style="background: #f3f4f6; padding: 8px; border-radius: 6px; margin-bottom: 8px;">
            <div style="font-size: 18px; font-weight: bold; color: ${selectedMetric === 'pricePerUnit' ? color : '#374151'};">
              $${displayPrice.toFixed(1)}/unit
              ${priceChange !== null ? `<span style="font-size: 12px; color: ${priceChange >= 0 ? '#16a34a' : '#dc2626'}; margin-left: 4px;">${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(1)}%</span>` : ''}
            </div>
            <div style="font-size: 11px; color: #6b7280;">Quarter: ${selectedQuarter}</div>
          </div>
          <div style="display: grid; gap: 4px; font-size: 13px;">
            <div><strong>Lot Size:</strong> <span style="color: ${selectedMetric === 'lotSize' ? color : '#374151'}; font-weight: ${selectedMetric === 'lotSize' ? 'bold' : 'normal'};">${p.lotSize.toLocaleString()} sq ft</span></div>
            <div><strong>Living Area:</strong> <span style="color: ${selectedMetric === 'sqft' ? color : '#374151'}; font-weight: ${selectedMetric === 'sqft' ? 'bold' : 'normal'};">${p.sqft.toLocaleString()} sq ft</span></div>
            <div><strong>Year Built:</strong> <span style="color: ${selectedMetric === 'yearBuilt' ? color : '#374151'}; font-weight: ${selectedMetric === 'yearBuilt' ? 'bold' : 'normal'};">${p.yearBuilt}</span></div>
            <div><strong>Bedrooms:</strong> ${p.bedrooms} | <strong>Baths:</strong> ${p.bathrooms}</div>
            <div><strong>House Age:</strong> <span style="color: ${selectedMetric === 'houseAge' ? color : '#374151'}; font-weight: ${selectedMetric === 'houseAge' ? 'bold' : 'normal'};">${p.houseAge.toFixed(1)} years</span></div>
            <div><strong>Distance to MRT:</strong> <span style="color: ${selectedMetric === 'distanceToMRT' ? color : '#374151'}; font-weight: ${selectedMetric === 'distanceToMRT' ? 'bold' : 'normal'};">${p.distanceToMRT.toFixed(0)}m</span></div>
          </div>
        </div>
      `);

      markersLayerRef.current?.addLayer(marker);
    });
  }, [showMarkers, selectedMetric, selectedQuarter, properties, getPropertyValue]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Calculate center of all properties
    const centerLat = properties.reduce((sum, p) => sum + p.latitude, 0) / properties.length;
    const centerLng = properties.reduce((sum, p) => sum + p.longitude, 0) / properties.length;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 14,
      zoomControl: false
    });

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(mapRef.current);

    // Add tile layer (using CartoDB Positron for clean look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(mapRef.current);

    // Set up event listeners for map movement
    mapRef.current.on('moveend', updateVisibleProperties);
    mapRef.current.on('zoomend', updateVisibleProperties);

    // Initial update
    updateVisibleProperties();
    updateHeatmap();
    updateMarkers();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    updateHeatmap();
    updateVisibleProperties();
  }, [showHeatmap, selectedMetric, selectedQuarter, properties, updateHeatmap, updateVisibleProperties]);

  useEffect(() => {
    updateMarkers();
  }, [showMarkers, selectedMetric, selectedQuarter, properties, updateMarkers]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
}
