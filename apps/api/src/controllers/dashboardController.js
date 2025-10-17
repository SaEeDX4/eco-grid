import User from "../models/User.js";
import Reading from "../models/Reading.js";
import Device from "../models/Device.js";
import Forecast from "../models/Forecast.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's devices
    const devices = await Device.find({ ownerId: userId })
      .sort({ lastSeen: -1 })
      .limit(10);

    // Get latest readings (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const readings = await Reading.find({
      deviceId: { $in: devices.map((d) => d._id) },
      timestamp: { $gte: sevenDaysAgo },
    }).sort({ timestamp: -1 });

    // Calculate KPIs
    const todayReadings = readings.filter((r) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(r.timestamp) >= today;
    });

    const currentUsage =
      todayReadings.length > 0 ? todayReadings[0].powerW / 1000 : 0;

    const todayKWh = todayReadings.reduce((sum, r) => sum + (r.kWh || 0), 0);
    const todayCost = todayKWh * 0.12; // Average BC rate
    const todaySavings = todayKWh * 0.04; // Estimated 35% savings from optimization
    const carbonOffset = todayKWh * 0.35; // kg CO2 per kWh in BC

    // Get forecast
    const forecast = await Forecast.findOne({
      scope: "household",
      userId: userId,
      horizon: { $gte: new Date() },
    }).sort({ timestamp: -1 });

    res.json({
      success: true,
      data: {
        kpis: {
          currentUsage: parseFloat(currentUsage.toFixed(2)),
          todayCost: parseFloat(todayCost.toFixed(2)),
          todaySavings: parseFloat(todaySavings.toFixed(2)),
          carbonOffset: parseFloat(carbonOffset.toFixed(2)),
        },
        devices: devices.map((d) => ({
          id: d._id,
          name: d.name,
          type: d.type,
          status: d.status,
          powerW: d.currentPowerW,
          lastSeen: d.lastSeen,
        })),
        trends: {
          // TODO: Aggregate readings by day
          last7Days: [],
        },
        forecast: forecast
          ? {
              tomorrow: {
                peakHours: forecast.peakHours || [],
                offPeakHours: forecast.offPeakHours || [],
                avgPrice: forecast.avgPrice || 0.12,
                weather: forecast.weather || {},
                recommendation: forecast.recommendation || "",
              },
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};

export const getRealTimeData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get latest reading from all user's devices
    const devices = await Device.find({ ownerId: userId });
    const latestReadings = await Reading.find({
      deviceId: { $in: devices.map((d) => d._id) },
    })
      .sort({ timestamp: -1 })
      .limit(devices.length);

    const totalPowerW = latestReadings.reduce(
      (sum, r) => sum + (r.powerW || 0),
      0,
    );

    res.json({
      success: true,
      data: {
        currentUsage: parseFloat((totalPowerW / 1000).toFixed(2)),
        timestamp: new Date().toISOString(),
        devices: latestReadings.map((r) => ({
          deviceId: r.deviceId,
          powerW: r.powerW,
          timestamp: r.timestamp,
        })),
      },
    });
  } catch (error) {
    console.error("Real-time data error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get real-time data",
    });
  }
};
