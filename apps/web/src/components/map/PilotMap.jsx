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
import { calculateBounds } from "../../lib/mapHelpers";
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

  useEffect(() => {
    const handler = () => {
      const map = mapRef.current?.getMap?.() || mapRef.current;
      if (!map) return;

      const name = (map.getStyle()?.name || "").toLowerCase();
      const isSatellite = name.includes("satellite");
      map.setStyle(
        isSatellite
          ? "mapbox://styles/mapbox/light-v11"
          : "mapbox://styles/mapbox/satellite-streets-v12"
      );
    };

    window.addEventListener("eco-grid:toggle-satellite", handler);
    return () =>
      window.removeEventListener("eco-grid:toggle-satellite", handler);
  }, []);

  // ✅ Updated helpers for GeoJSON format
  const hasCoords = (p) =>
    p &&
    p.coordinates &&
    Array.isArray(p.coordinates.coordinates) &&
    p.coordinates.coordinates.length === 2 &&
    Number.isFinite(p.coordinates.coordinates[0]) &&
    Number.isFinite(p.coordinates.coordinates[1]);

  const safeLngLat = (p) =>
    hasCoords(p)
      ? [p.coordinates.coordinates[0], p.coordinates.coordinates[1]]
      : [BC_CENTER.longitude, BC_CENTER.latitude];

  const validPilots = Array.isArray(pilots) ? pilots.filter(hasCoords) : [];

  const handleMarkerClick = (pilot) => {
    setSelectedPilot(pilot);
    setHoveredPilot(null);

    const map = mapRef.current?.getMap
      ? mapRef.current.getMap()
      : mapRef.current;
    if (map && hasCoords(pilot)) {
      const [lng, lat] = safeLngLat(pilot);
      map.flyTo({
        center: [lng, lat],
        zoom: 12,
        duration: 1000,
      });
    }
  };

  const handleMarkerHover = (pilot) => setHoveredPilot(pilot);

  const handleFitBounds = () => {
    const map = mapRef.current?.getMap
      ? mapRef.current.getMap()
      : mapRef.current;
    if (!validPilots.length || !map) return;

    const bounds = calculateBounds(
      validPilots.map((p) => ({
        longitude: p.coordinates.coordinates[0],
        latitude: p.coordinates.coordinates[1],
      }))
    );

    if (bounds && bounds.minLng !== undefined) {
      map.fitBounds(
        [
          [bounds.minLng, bounds.minLat],
          [bounds.maxLng, bounds.maxLat],
        ],
        {
          padding: 100,
          duration: 1000,
        }
      );
    } else {
      // fallback to BC center
      map.flyTo({
        center: [BC_CENTER.longitude, BC_CENTER.latitude],
        zoom: 11,
        duration: 1000,
      });
    }
  };

  const handleRefresh = () => fetchPilots(filters);
  const handleToggleHeatmap = () => setHeatmapEnabled(!heatmapEnabled);
  const mapStyle = isDarkMode ? MAP_STYLES.dark : MAP_STYLES.light;

  // ✅ Clustering adapted for GeoJSON coordinates
  const clusterPilots = (list, zoom) => {
    const source = Array.isArray(list) ? list.filter(hasCoords) : [];
    if (zoom > 10) return source;

    const clusters = [];
    const processed = new Set();

    source.forEach((pilot, index) => {
      if (processed.has(index)) return;
      const [lng1, lat1] = pilot.coordinates.coordinates;

      const nearby = source.filter((p, i) => {
        if (i === index || processed.has(i)) return false;
        const [lng2, lat2] = p.coordinates.coordinates;
        const distance = Math.sqrt((lng2 - lng1) ** 2 + (lat2 - lat1) ** 2);
        return distance < 0.5;
      });

      if (nearby.length > 0) {
        const allPilots = [pilot, ...nearby];
        const avgLng =
          allPilots.reduce((sum, p) => sum + p.coordinates.coordinates[0], 0) /
          allPilots.length;
        const avgLat =
          allPilots.reduce((sum, p) => sum + p.coordinates.coordinates[1], 0) /
          allPilots.length;

        clusters.push({
          type: "cluster",
          count: allPilots.length,
          coordinates: [avgLng, avgLat],
          pilots: allPilots,
        });

        allPilots.forEach((p) => {
          const idx = source.indexOf(p);
          if (idx >= 0) processed.add(idx);
        });
      } else {
        clusters.push(pilot);
        processed.add(index);
      }
    });

    return clusters;
  };

  const clusteredPilots = clusterPilots(validPilots, viewState.zoom);

  if (loading && !pilots.length) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <Loader
            className="animate-spin text-blue-500 mx-auto mb-4"
            size={48}
          />
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
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        interactiveLayerIds={[]}
        attributionControl={false}
        onMouseLeave={() => setHoveredPilot(null)}
        onClick={(e) => {
          if (!e?.originalEvent?.defaultPrevented) {
            setSelectedPilot(null);
          }
        }}
      >
        {clusteredPilots.map((item, index) => {
          if (item.type === "cluster") {
            const [lng, lat] = item.coordinates;
            if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;

            return (
              <Marker
                key={`cluster-${lng.toFixed(4)}-${lat.toFixed(4)}-${item.count}`}
                longitude={lng}
                latitude={lat}
                anchor="center"
              >
                <MapCluster
                  count={item.count}
                  onClick={() => {
                    const map = mapRef.current?.getMap
                      ? mapRef.current.getMap()
                      : mapRef.current;
                    if (map) {
                      map.flyTo({
                        center: [lng, lat],
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

          if (!hasCoords(item)) return null;
          const [lng, lat] = item.coordinates.coordinates;

          return (
            <Marker
              key={item._id}
              longitude={lng}
              latitude={lat}
              anchor="center"
            >
              <MapMarker
                pilot={item}
                onClick={handleMarkerClick}
                onHover={handleMarkerHover}
                isHovered={hoveredPilot?._id === item._id}
                renderInline
                onPointerDownCapture={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e?.nativeEvent) {
                    e.nativeEvent.preventDefault = true;
                  }
                }}
              />
            </Marker>
          );
        })}

        {/* 🔧 Ensure controls sit above any overlays and accept clicks */}
        <NavigationControl
          position="top-right"
          style={{ zIndex: 9999, pointerEvents: "auto" }}
        />

        <ScaleControl position="bottom-left" />
      </Map>

      <MapFilters activeFilters={filters} onFilterChange={setFilters} />
      <MapDashboard
        metrics={aggregateMetrics}
        pilotCount={validPilots.length}
      />
      <MapControls
        onToggleHeatmap={handleToggleHeatmap}
        heatmapEnabled={heatmapEnabled}
        onFitBounds={handleFitBounds}
        onRefresh={handleRefresh}
        loading={loading}
      />
      <MapLegend />

      {hoveredPilot && (
        <MarkerTooltip pilot={hoveredPilot} position={cursorPosition} />
      )}
      {selectedPilot && (
        <PilotDetailModal
          pilot={selectedPilot}
          onClose={() => setSelectedPilot(null)}
        />
      )}

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
