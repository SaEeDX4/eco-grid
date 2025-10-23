import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { MAPBOX_TOKEN, BC_CENTER, MAP_STYLES } from "../lib/mapboxConfig";

export const useMapbox = (containerRef, options = {}) => {
  const [map, setMap] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const mapInstance = useRef(null);

  const {
    initialCenter = BC_CENTER,
    initialStyle = MAP_STYLES.light,
    isDarkMode = false,
  } = options;

  useEffect(() => {
    if (!containerRef.current || mapInstance.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const newMap = new mapboxgl.Map({
      container: containerRef.current,
      style: isDarkMode ? MAP_STYLES.dark : initialStyle,
      center: [initialCenter.longitude, initialCenter.latitude],
      zoom: initialCenter.zoom,
      pitch: 0,
      bearing: 0,
      antialias: true,
      attributionControl: false,
    });

    // Add navigation controls
    newMap.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add scale control
    newMap.addControl(new mapboxgl.ScaleControl(), "bottom-left");

    newMap.on("load", () => {
      setLoaded(true);
    });

    mapInstance.current = newMap;
    setMap(newMap);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update style when dark mode changes
  useEffect(() => {
    if (!map || !loaded) return;

    const newStyle = isDarkMode ? MAP_STYLES.dark : MAP_STYLES.light;
    map.setStyle(newStyle);
  }, [isDarkMode, map, loaded]);

  const flyTo = (coordinates, zoom = 12, duration = 1000) => {
    if (!map) return;

    map.flyTo({
      center: coordinates,
      zoom,
      duration,
      essential: true,
    });
  };

  const fitBounds = (bounds, padding = 50) => {
    if (!map) return;

    map.fitBounds(bounds, {
      padding,
      duration: 1000,
    });
  };

  const addMarker = (coordinates, options = {}) => {
    if (!map) return null;

    const marker = new mapboxgl.Marker(options)
      .setLngLat(coordinates)
      .addTo(map);

    return marker;
  };

  const removeMarker = (marker) => {
    if (marker) {
      marker.remove();
    }
  };

  return {
    map,
    loaded,
    flyTo,
    fitBounds,
    addMarker,
    removeMarker,
  };
};
