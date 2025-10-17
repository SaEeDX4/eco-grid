import React, { useState } from "react";
import { Download, FileText, Table, Calendar, CheckCircle } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useToast } from "../../hooks/useToast";
import api from "../../lib/api";

const ExportModal = ({ isOpen, onClose, reportData }) => {
  const [exportFormat, setExportFormat] = useState("pdf");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeESG, setIncludeESG] = useState(true);
  const [dateRange, setDateRange] = useState("current");
  const [exporting, setExporting] = useState(false);
  const { success, error: showError } = useToast();

  const formats = [
    {
      id: "pdf",
      label: "PDF Report",
      icon: FileText,
      description: "Professional PDF with charts and insights",
      color: "from-red-500 to-pink-500",
    },
    {
      id: "csv",
      label: "CSV Data",
      icon: Table,
      description: "Raw data for analysis in Excel",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "json",
      label: "JSON",
      icon: FileText,
      description: "Structured data for developers",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await api.post(
        "/reports/export",
        {
          format: exportFormat,
          includeCharts,
          includeESG,
          dateRange,
          reportData,
        },
        {
          responseType: exportFormat === "pdf" ? "blob" : "json",
        },
      );

      if (exportFormat === "pdf") {
        // Download PDF
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `eco-grid-report-${Date.now()}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        // Download CSV/JSON
        const blob = new Blob([JSON.stringify(response.data, null, 2)], {
          type: exportFormat === "csv" ? "text/csv" : "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `eco-grid-data-${Date.now()}.${exportFormat}`;
        link.click();
        window.URL.revokeObjectURL(url);
      }

      success("Report exported successfully!");
      onClose();
    } catch (err) {
      console.error("Export error:", err);
      showError("Failed to export report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Report" size="lg">
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
            Select Format
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setExportFormat(format.id)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-300
                  ${
                    exportFormat === format.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 scale-105"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }
                `}
              >
                <div
                  className={`
                  w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center
                  bg-gradient-to-br ${format.color}
                `}
                >
                  <format.icon className="text-white" size={24} />
                </div>
                <div className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                  {format.label}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {format.description}
                </div>
                {exportFormat === format.id && (
                  <div className="mt-2">
                    <CheckCircle size={16} className="text-blue-600 mx-auto" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Options (PDF Only) */}
        {exportFormat === "pdf" && (
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
              Include in Report
            </h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-900 dark:text-white">
                    Charts & Visualizations
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Include energy charts and graphs
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={includeESG}
                  onChange={(e) => setIncludeESG(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-900 dark:text-white">
                    ESG Performance
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Include sustainability metrics
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Date Range */}
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
            Date Range
          </h4>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="current">Current Period</option>
            <option value="last_month">Last Month</option>
            <option value="last_quarter">Last Quarter</option>
            <option value="last_year">Last Year</option>
            <option value="all_time">All Time</option>
          </select>
        </div>

        {/* Preview Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="flex items-start gap-3">
            <Calendar
              className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-1">Report Preview</p>
              <p>Format: {formats.find((f) => f.id === exportFormat)?.label}</p>
              <p>Date Range: {dateRange.replace("_", " ")}</p>
              {exportFormat === "pdf" && (
                <p>
                  Includes:{" "}
                  {[includeCharts && "Charts", includeESG && "ESG"]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onClose}
            disabled={exporting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            size="lg"
            onClick={handleExport}
            loading={exporting}
            disabled={exporting}
            className="flex-1"
          >
            <Download size={20} />
            {exporting ? "Exporting..." : "Export Report"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;
