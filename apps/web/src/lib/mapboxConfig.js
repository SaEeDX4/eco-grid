export const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "pk.your_mapbox_token_here";

// BC-centered view
export const BC_CENTER = {
  longitude: -123.3656,
  latitude: 49.2827, // Vancouver
  zoom: 7,
};

// Map style URLs
export const MAP_STYLES = {
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
  streets: "mapbox://styles/mapbox/streets-v12",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
};

// Custom dark theme
export const DARK_THEME = {
  version: 8,
  name: "Eco-Grid Dark",
  sources: {
    mapbox: {
      type: "vector",
      url: "mapbox://mapbox.mapbox-streets-v8",
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#0f172a",
      },
    },
    {
      id: "water",
      type: "fill",
      source: "mapbox",
      "source-layer": "water",
      paint: {
        "fill-color": "#1e293b",
      },
    },
    {
      id: "land",
      type: "fill",
      source: "mapbox",
      "source-layer": "landuse",
      paint: {
        "fill-color": "#1e293b",
      },
    },
  ],
};

// Marker colors by status
export const STATUS_COLORS = {
  active: "#10b981", // green
  idle: "#f59e0b", // orange
  maintenance: "#ef4444", // red
  offline: "#6b7280", // gray
};

// Device type colors
export const DEVICE_COLORS = {
  solar: "#fbbf24", // yellow
  "ev-charger": "#3b82f6", // blue
  battery: "#8b5cf6", // purple
  "heat-pump": "#ec4899", // pink
  thermostat: "#14b8a6", // teal
};

// Animation settings
export const ANIMATION = {
  duration: 500,
  easing: [0.4, 0.0, 0.2, 1], // cubic-bezier
  stagger: 50,
};

// Clustering settings
export const CLUSTER_CONFIG = {
  radius: 50,
  maxZoom: 14,
  minPoints: 2,
};
