import React, { useRef, useState, useEffect } from "react";
import Map, { Marker, NavigationControl, ScaleControl } from "react-map-gl";

import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import MapMarker from "./MapMarker";
import MapCluster from "./MapCluster";
import MarkerTooltip from "./MarkerTooltip";
import PilotDetailModal from "./PilotDetailModal";
import MapFilters from "./MapFilters";
import MapDashboard from "./MapDashboard";
import MapControls from "./MapControls";
import MapLegend from "./MapLegend";
import { usePilots } from "../../hooks/usePilots";
import { MAPBOX_TOKEN, BC_CENTER, MAP_STYLES } from "../../lib/mapboxConfig";
import { calculateBounds, createGeoJSON } from "../../lib/mapHelpers";
import "mapbox-gl/dist/mapbox-gl.css";

const PilotMap = ({ isDarkMode }) => {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({
    longitude: BC_CENTER.longitude,
    latitude: BC_CENTER.latitude,
    zoom: BC_CENTER.zoom,
  });

  const [filters, setFilters] = useState({
    region: [],
    deviceType: [],
    status: [],
  });

  const [hoveredPilot, setHoveredPilot] = useState(null);
  const [selectedPilot, setSelectedPilot] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);

  const { pilots, aggregateMetrics, loading, error, fetchPilots } =
    usePilots(filters);

  useEffect(() => {
    fetchPilots(filters);
  }, [filters]);

  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleMarkerClick = (pilot) => {
    setSelectedPilot(pilot);
    setHoveredPilot(null);

    // Fly to marker
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [pilot.coordinates.longitude, pilot.coordinates.latitude],
        zoom: 12,
        duration: 1000,
      });
    }
  };

  const handleMarkerHover = (pilot) => {
    setHoveredPilot(pilot);
  };

  const handleFitBounds = () => {
    if (!pilots.length || !mapRef.current) return;

    const bounds = calculateBounds(pilots);
    if (bounds) {
      mapRef.current.fitBounds(bounds, {
        padding: 100,
        duration: 1000,
      });
    }
  };

  const handleRefresh = () => {
    fetchPilots(filters);
  };

  const handleToggleHeatmap = () => {
    setHeatmapEnabled(!heatmapEnabled);
  };

  const mapStyle = isDarkMode ? MAP_STYLES.dark : MAP_STYLES.light;

  // Simple clustering logic (group nearby pilots)
  const clusterPilots = (pilots, zoom) => {
    if (zoom > 10) return pilots; // No clustering at high zoom

    const clusters = [];
    const processed = new Set();

    pilots.forEach((pilot, index) => {
      if (processed.has(index)) return;

      const nearby = pilots.filter((p, i) => {
        if (i === index || processed.has(i)) return false;

        const distance = Math.sqrt(
          Math.pow(p.coordinates.longitude - pilot.coordinates.longitude, 2) +
            Math.pow(p.coordinates.latitude - pilot.coordinates.latitude, 2)
        );

        return distance < 0.5; // Cluster threshold
      });

      if (nearby.length > 0) {
        const allPilots = [pilot, ...nearby];
        const avgLng =
          allPilots.reduce((sum, p) => sum + p.coordinates.longitude, 0) /
          allPilots.length;
        const avgLat =
          allPilots.reduce((sum, p) => sum + p.coordinates.latitude, 0) /
          allPilots.length;

        clusters.push({
          type: "cluster",
          count: allPilots.length,
          coordinates: { longitude: avgLng, latitude: avgLat },
          pilots: allPilots,
        });

        allPilots.forEach((p) => {
          const idx = pilots.indexOf(p);
          processed.add(idx);
        });
      } else {
        clusters.push(pilot);
        processed.add(index);
      }
    });

    return clusters;
  };

  const clusteredPilots = clusterPilots(pilots, viewState.zoom);

  if (loading && !pilots.length) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <Loader
            className="animate-spin text-blue-500 mx-auto mb-4"
            size={48}
          />
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Loading pilot locations...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Failed to Load Map
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      {/* Map */}
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        {/* Render markers or clusters */}
        {clusteredPilots.map((item, index) => {
          if (item.type === "cluster") {
            return (
              <Marker
                key={`cluster-${index}`}
                longitude={item.coordinates.longitude}
                latitude={item.coordinates.latitude}
                anchor="center"
              >
                <MapCluster
                  count={item.count}
                  onClick={() => {
                    // Zoom into cluster
                    if (mapRef.current) {
                      mapRef.current.flyTo({
                        center: [
                          item.coordinates.longitude,
                          item.coordinates.latitude,
                        ],
                        zoom: viewState.zoom + 2,
                        duration: 1000,
                      });
                    }
                  }}
                  isHovered={false}
                />
              </Marker>
            );
          }

          return (
            <Marker
              key={item._id}
              longitude={item.coordinates.longitude}
              latitude={item.coordinates.latitude}
              anchor="center"
            >
              <MapMarker
                pilot={item}
                onClick={handleMarkerClick}
                onHover={handleMarkerHover}
                isHovered={hoveredPilot?._id === item._id}
              />
            </Marker>
          );
        })}

        <NavigationControl position="top-right" />
        <ScaleControl position="bottom-left" />
      </Map>

      {/* Overlays */}
      <MapFilters activeFilters={filters} onFilterChange={setFilters} />

      <MapDashboard metrics={aggregateMetrics} pilotCount={pilots.length} />

      <MapControls
        onToggleHeatmap={handleToggleHeatmap}
        heatmapEnabled={heatmapEnabled}
        onFitBounds={handleFitBounds}
        onRefresh={handleRefresh}
        loading={loading}
      />

      <MapLegend />

      {/* Tooltip */}
      {hoveredPilot && (
        <MarkerTooltip pilot={hoveredPilot} position={cursorPosition} />
      )}

      {/* Detail modal */}
      {selectedPilot && (
        <PilotDetailModal
          pilot={selectedPilot}
          onClose={() => setSelectedPilot(null)}
        />
      )}

      {/* Loading overlay */}
      {loading && pilots.length > 0 && (
        <motion.div
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="px-4 py-2 rounded-full bg-blue-500 text-white font-semibold shadow-lg flex items-center gap-2">
            <Loader className="animate-spin" size={16} />
            Updating...
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PilotMap;
