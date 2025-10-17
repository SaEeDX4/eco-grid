import { useState } from "react";
import api from "../lib/api";
import { useToast } from "./useToast";

export const useDeviceControl = () => {
  const [controlling, setControlling] = useState(false);
  const { success, error } = useToast();

  const toggleDevice = async (deviceId, state) => {
    setControlling(true);
    try {
      await api.post(`/devices/${deviceId}/control`, {
        action: state ? "on" : "off",
      });
      success(`Device ${state ? "turned on" : "turned off"}`);
      return true;
    } catch (err) {
      error("Failed to control device");
      console.error("Device control error:", err);
      return false;
    } finally {
      setControlling(false);
    }
  };

  const setDeviceMode = async (deviceId, mode) => {
    setControlling(true);
    try {
      await api.post(`/devices/${deviceId}/control`, {
        action: "set_mode",
        mode,
      });
      success(`Mode set to ${mode}`);
      return true;
    } catch (err) {
      error("Failed to change mode");
      console.error("Mode change error:", err);
      return false;
    } finally {
      setControlling(false);
    }
  };

  const scheduleDevice = async (deviceId, schedule) => {
    setControlling(true);
    try {
      await api.post(`/devices/${deviceId}/schedule`, schedule);
      success("Schedule saved");
      return true;
    } catch (err) {
      error("Failed to save schedule");
      console.error("Schedule error:", err);
      return false;
    } finally {
      setControlling(false);
    }
  };

  return {
    controlling,
    toggleDevice,
    setDeviceMode,
    scheduleDevice,
  };
};
