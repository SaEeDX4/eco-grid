import { useState, useEffect } from "react";
import { apiFetch } from "../hooks/useApi"; // ✅ added to handle JWT automatically
import { mockDevices } from "../lib/deviceUtils";

export const useDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      // ✅ Fixed: ensure correct endpoint path
      const response = await apiFetch("/api/devices");
      setDevices(response.devices || []); // ✅ response now comes as JSON
      setError(null);
    } catch (err) {
      console.error("Failed to load devices:", err);
      // fallback to mock data
      setDevices(mockDevices);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadDevices();
  };

  const updateDevice = (deviceId, updates) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, ...updates } : d)),
    );
  };

  const addDevice = (device) => {
    setDevices((prev) => [...prev, device]);
  };

  const removeDevice = (deviceId) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
  };

  return {
    devices,
    loading,
    error,
    refresh,
    updateDevice,
    addDevice,
    removeDevice,
  };
};
