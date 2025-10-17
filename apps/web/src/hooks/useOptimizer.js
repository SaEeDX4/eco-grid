import { useState, useCallback } from "react";
import api from "../lib/api";
import {
  optimizeSchedule,
  calculateSavings,
  validateSchedule,
} from "../lib/optimizationEngine";

export const useOptimizer = (devices = []) => {
  const [mode, setMode] = useState("normal");
  const [schedule, setSchedule] = useState([]);
  const [beforeData, setBeforeData] = useState(null);
  const [afterData, setAfterData] = useState(null);
  const [savings, setSavings] = useState(null);
  const [validation, setValidation] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState(null);

  const calculate = useCallback(async () => {
    if (!mode || devices.length === 0) return;

    setCalculating(true);
    setError(null);

    try {
      // Try API first
      const response = await api.post("/optimizer/calculate", {
        devices: devices.map((d) => ({
          id: d.id,
          name: d.name,
          type: d.type,
          powerW: d.powerW,
          flexible: d.type === "ev_charger" || d.type === "water_heater",
          requiredHours: d.type === "ev_charger" ? 6 : 4,
          currentStartHour: 8,
          currentEndHour: 18,
        })),
        mode,
      });

      setSchedule(response.data.optimizedSchedule);
      setBeforeData(response.data.beforeData);
      setAfterData(response.data.afterData);
      setSavings(response.data.savings);
      setValidation(response.data.validation);
    } catch (err) {
      console.error("Optimization calculation error:", err);

      // Fallback to client-side calculation
      const deviceData = devices.map((d) => ({
        id: d.id,
        name: d.name,
        type: d.type,
        powerW: d.powerW || 0,
        flexible: d.type === "ev_charger" || d.type === "water_heater",
        requiredHours: d.type === "ev_charger" ? 6 : 4,
        currentStartHour: 8,
        currentEndHour: 18,
      }));

      const beforeSchedule = optimizeSchedule(deviceData, "normal");
      const afterSchedule = optimizeSchedule(deviceData, mode);

      const savingsCalc = calculateSavings(beforeSchedule, afterSchedule);
      const validationResult = validateSchedule(afterSchedule);

      setSchedule(afterSchedule);
      setBeforeData({
        dailyCost: savingsCalc.beforeCost,
        monthlyCost: savingsCalc.beforeCost * 30,
        yearlyCost: savingsCalc.beforeCost * 365,
      });
      setAfterData({
        dailyCost: savingsCalc.afterCost,
        monthlyCost: savingsCalc.afterCost * 30,
        yearlyCost: savingsCalc.afterCost * 365,
      });
      setSavings({
        dailySavings: savingsCalc.dailySavings,
        monthlySavings: savingsCalc.monthlySavings,
        yearlySavings: savingsCalc.yearlySavings,
        percentSaved: savingsCalc.percentSaved,
        co2Reduced: savingsCalc.co2Reduced,
      });
      setValidation(validationResult);
    } finally {
      setCalculating(false);
    }
  }, [devices, mode]);

  const reset = useCallback(() => {
    setMode("normal");
    setSchedule([]);
    setBeforeData(null);
    setAfterData(null);
    setSavings(null);
    setValidation(null);
    setError(null);
  }, []);

  const updateSchedule = useCallback(
    (newSchedule) => {
      setSchedule(newSchedule);

      // Recalculate savings with new schedule
      if (beforeData) {
        const deviceData = devices.map((d) => ({
          id: d.id,
          name: d.name,
          type: d.type,
          powerW: d.powerW || 0,
          currentStartHour: 8,
          currentEndHour: 18,
        }));

        const beforeSchedule = optimizeSchedule(deviceData, "normal");
        const savingsCalc = calculateSavings(beforeSchedule, newSchedule);
        const validationResult = validateSchedule(newSchedule);

        setSavings({
          dailySavings: savingsCalc.dailySavings,
          monthlySavings: savingsCalc.monthlySavings,
          yearlySavings: savingsCalc.yearlySavings,
          percentSaved: savingsCalc.percentSaved,
          co2Reduced: savingsCalc.co2Reduced,
        });
        setValidation(validationResult);
      }
    },
    [devices, beforeData],
  );

  return {
    mode,
    setMode,
    schedule,
    beforeData,
    afterData,
    savings,
    validation,
    calculating,
    error,
    calculate,
    reset,
    updateSchedule,
  };
};
