import * as turf from "@turf/turf";

export const createGeoJSON = (pilots) => {
  return {
    type: "FeatureCollection",
    features: pilots.map((pilot) => {
      let lng = pilot?.coordinates?.coordinates?.[0];
      let lat = pilot?.coordinates?.coordinates?.[1];

      // fallback if old structure is ever used
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
        lng = pilot?.coordinates?.longitude;
        lat = pilot?.coordinates?.latitude;
      }

      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        properties: {
          id: pilot._id,
          name: pilot.name,
          city: pilot.city,
          region: pilot.region,
          deviceTypes: pilot.deviceTypes,
          status: pilot.status,
          energySaved: pilot.metrics.energySaved,
          co2Reduced: pilot.metrics.co2Reduced,
          activeDevices: pilot.metrics.activeDevices,
          totalDevices: pilot.metrics.totalDevices,
        },
      };
    }),
  };
};

export const calculateBounds = (pilots) => {
  if (!pilots || pilots.length === 0) return null;

  const coordinates = pilots
    .map((p) => {
      let lng = p?.coordinates?.coordinates?.[0];
      let lat = p?.coordinates?.coordinates?.[1];
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
        lng = p?.coordinates?.longitude;
        lat = p?.coordinates?.latitude;
      }
      return [lng, lat];
    })
    .filter(
      (coord) =>
        Array.isArray(coord) &&
        Number.isFinite(coord[0]) &&
        Number.isFinite(coord[1])
    );

  if (!coordinates.length) return null;

  const collection = turf.featureCollection(
    coordinates.map((coord) => turf.point(coord))
  );

  const bbox = turf.bbox(collection);
  return bbox; // [minLng, minLat, maxLng, maxLat]
};

export const getStatusColor = (status) => {
  const colors = {
    active: "#10b981",
    idle: "#f59e0b",
    maintenance: "#ef4444",
    offline: "#6b7280",
  };
  return colors[status] || colors.offline;
};

export const getDeviceIcon = (deviceType) => {
  const icons = {
    solar: "☀️",
    "ev-charger": "🔌",
    battery: "🔋",
    "heat-pump": "♨️",
    thermostat: "🌡️",
  };
  return icons[deviceType] || "⚡";
};

export const formatMetric = (value, type) => {
  switch (type) {
    case "energy":
      return `${(value / 1000).toFixed(1)} MWh`;
    case "co2":
      return `${value.toFixed(1)} tonnes`;
    case "currency":
      return `$${value.toLocaleString()}`;
    case "percentage":
      return `${value.toFixed(1)}%`;
    default:
      return value.toString();
  }
};

export const createClusterMarker = (count, coordinates) => {
  const size = Math.min(60, 20 + Math.log(count) * 10);

  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates,
    },
    properties: {
      cluster: true,
      count,
      size,
    },
  };
};

export const getHeatmapIntensity = (energySaved) => {
  // Normalize energy saved to 0-1 scale for heatmap
  const maxEnergy = 500000; // 500 MWh
  return Math.min(energySaved / maxEnergy, 1);
};

export const smoothZoom = (map, target, duration = 1000) => {
  return new Promise((resolve) => {
    map.flyTo({
      ...target,
      duration,
      essential: true,
    });

    map.once("moveend", resolve);
  });
};

export const createPulseAnimation = (intensity = 1) => {
  return {
    scale: [1, 1.3, 1],
    opacity: [0.7, 0, 0.7],
  };
};
