import { useState, useEffect } from "react";
import { generateRealtimeUpdate } from "../lib/mockData";

export const useRealTimeData = (interval = 5000) => {
  const [realtimeData, setRealtimeData] = useState({
    currentUsage: 3.2,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    const updateInterval = setInterval(() => {
      const newData = generateRealtimeUpdate();
      setRealtimeData(newData);
    }, interval);

    return () => clearInterval(updateInterval);
  }, [interval]);

  return realtimeData;
};
