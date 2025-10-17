import Reading from "../models/Reading.js";
import Device from "../models/Device.js";
import Report from "../models/Report.js";
import Achievement from "../models/Achievement.js";
import AuditLog from "../models/AuditLog.js";
import { generateReport, calculateESG } from "../services/reportService.js";
import { generatePDF, generateCSV } from "../services/pdfService.js";

export const generateReportData = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    // Fetch readings within date range
    const readings = await Reading.find({
      userId,
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ timestamp: 1 });

    // Fetch user's devices
    const devices = await Device.find({ ownerId: userId });

    // Calculate report metrics
    const reportData = await generateReport(readings, devices, {
      startDate,
      endDate,
    });

    res.json({
      success: true,
      readings: readings.map((r) => ({
        timestamp: r.timestamp,
        powerW: r.powerW,
        kWh: r.kWh,
        cost: r.cost,
        deviceType: r.deviceType,
      })),
      devices: devices.map((d) => ({
        id: d._id,
        name: d.name,
        type: d.type,
      })),
      metrics: reportData.metrics,
      chartData: reportData.chartData,
    });
  } catch (error) {
    console.error("Generate report error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate report",
    });
  }
};

export const getESGData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user data
    const user = await req.user;

    // Fetch recent readings (last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const readings = await Reading.find({
      userId,
      timestamp: { $gte: ninetyDaysAgo },
    });

    // Fetch devices
    const devices = await Device.find({ ownerId: userId });

    // Calculate ESG score
    const esgData = calculateESG(user, readings, devices);

    res.json({
      success: true,
      esg: esgData.scores,
      recommendations: esgData.recommendations,
    });
  } catch (error) {
    console.error("Get ESG data error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ESG data",
    });
  }
};

export const exportReport = async (req, res) => {
  try {
    const { format, includeCharts, includeESG, dateRange, reportData } =
      req.body;
    const userId = req.user.id;

    let exportData;

    if (format === "pdf") {
      // Generate PDF
      exportData = await generatePDF({
        userId,
        reportData,
        includeCharts,
        includeESG,
        dateRange,
      });

      // Save report record
      await Report.create({
        userId,
        reportType: "energy_summary",
        format: "pdf",
        dateRange: {
          start: new Date(reportData.period.split(" - ")[0]),
          end: new Date(reportData.period.split(" - ")[1]),
        },
        fileSize: exportData.length,
        generatedAt: new Date(),
      });

      // Log export
      await AuditLog.create({
        userId,
        action: "report_export",
        entity: "Report",
        details: {
          format: "pdf",
          includeCharts,
          includeESG,
          dateRange,
        },
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=eco-grid-report-${Date.now()}.pdf`,
      );
      res.send(exportData);
    } else if (format === "csv") {
      // Generate CSV
      exportData = generateCSV(reportData);

      await Report.create({
        userId,
        reportType: "energy_data",
        format: "csv",
        dateRange: {
          start: new Date(reportData.period.split(" - ")[0]),
          end: new Date(reportData.period.split(" - ")[1]),
        },
        fileSize: exportData.length,
        generatedAt: new Date(),
      });

      await AuditLog.create({
        userId,
        action: "report_export",
        entity: "Report",
        details: { format: "csv", dateRange },
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=eco-grid-data-${Date.now()}.csv`,
      );
      res.send(exportData);
    } else {
      // JSON format
      exportData = JSON.stringify(reportData, null, 2);

      await Report.create({
        userId,
        reportType: "energy_data",
        format: "json",
        dateRange: {
          start: new Date(reportData.period.split(" - ")[0]),
          end: new Date(reportData.period.split(" - ")[1]),
        },
        fileSize: exportData.length,
        generatedAt: new Date(),
      });

      await AuditLog.create({
        userId,
        action: "report_export",
        entity: "Report",
        details: { format: "json", dateRange },
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });

      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=eco-grid-data-${Date.now()}.json`,
      );
      res.send(exportData);
    }
  } catch (error) {
    console.error("Export report error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export report",
    });
  }
};

export const getAchievements = async (req, res) => {
  try {
    const userId = req.user.id;

    const achievements = await Achievement.find({ userId });

    res.json({
      success: true,
      achievements: achievements.reduce((acc, achievement) => {
        acc[achievement.achievementId] = {
          unlocked: achievement.unlocked,
          progress: achievement.progress,
          unlockedAt: achievement.unlockedAt,
        };
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error("Get achievements error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch achievements",
    });
  }
};

export const getReportHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const reports = await Report.find({ userId })
      .sort({ generatedAt: -1 })
      .limit(20);

    res.json({
      success: true,
      reports: reports.map((r) => ({
        id: r._id,
        type: r.reportType,
        format: r.format,
        dateRange: r.dateRange,
        fileSize: r.fileSize,
        generatedAt: r.generatedAt,
      })),
    });
  } catch (error) {
    console.error("Get report history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch report history",
    });
  }
};
