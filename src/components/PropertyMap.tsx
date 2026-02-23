// @ts-nocheck
import { useEffect, useRef, useCallback } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { properties, Property, getPriceColor, getHeatmapIntensity } from '../data/properties';

interface PropertyMapProps {
  onVisiblePropertiesChange: (visibleProperties: Property[]) => void;
  showHeatmap: boolean;
  showMarkers: boolean;
}

export default function PropertyMap({ onVisiblePropertiesChange, showHeatmap, showMarkers }: PropertyMapProps) {
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
  }, [onVisiblePropertiesChange]);

  const updateHeatmap = useCallback(() => {
    if (!mapRef.current) return;

    // Remove existing heat layer
    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (!showHeatmap) return;

    // Create heatmap data with intensity based on price
    const heatData = properties.map(p => [
      p.latitude,
      p.longitude,
      getHeatmapIntensity(p.pricePerUnit)
    ]);

    // Create heat layer with custom gradient
    heatLayerRef.current = (L as any).heatLayer(heatData, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.0: '#22c55e',  // green - low price
        0.3: '#84cc16',  // lime
        0.5: '#eab308',  // yellow - medium price
        0.7: '#f97316',  // orange
        1.0: '#ef4444'   // red - high price
      }
    });

    heatLayerRef.current.addTo(mapRef.current);
  }, [showHeatmap]);

  const updateMarkers = useCallback(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    } else {
      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }

    if (!showMarkers) return;

    // Add markers for each property
    properties.forEach(p => {
      const color = getPriceColor(p.pricePerUnit);

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

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">Property #${p.id}</h3>
          <div style="display: grid; gap: 4px; font-size: 13px;">
            <div><strong>Price/Unit:</strong> <span style="color: ${color}; font-weight: bold;">$${p.pricePerUnit.toFixed(1)}</span></div>
            <div><strong>House Age:</strong> ${p.houseAge} years</div>
            <div><strong>Distance to MRT:</strong> ${p.distanceToMRT.toFixed(0)}m</div>
            <div><strong>Convenience Stores:</strong> ${p.convenienceStores}</div>
          </div>
        </div>
      `);

      markersLayerRef.current?.addLayer(marker);
    });
  }, [showMarkers]);

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
  }, [showHeatmap, updateHeatmap]);

  useEffect(() => {
    updateMarkers();
  }, [showMarkers, updateMarkers]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
}
