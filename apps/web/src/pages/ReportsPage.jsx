import React, { useState } from "react";
import { Download, RefreshCw, Calendar } from "lucide-react";
import { useReports } from "../hooks/useReports";
import { useESG } from "../hooks/useESG";
import { useToast } from "../hooks/useToast";
import ImpactHero from "../components/reports/ImpactHero";
import DateRangePicker from "../components/ui/DateRangePicker";
import MetricsGrid from "../components/reports/MetricsGrid";
import EnergyChart from "../components/reports/EnergyChart";
import ESGScoreCard from "../components/reports/ESGScoreCard";
import EnvironmentalImpact from "../components/reports/EnvironmentalImpact";
import AchievementBadges from "../components/reports/AchievementBadges";
import ExportModal from "../components/reports/ExportModal";
import Button from "../components/ui/Button";
import IconButton from "../components/ui/IconButton";

const ReportsPage = () => {
  const { success } = useToast();

  // Date range state
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());

  // Load data
  const {
    loading: reportsLoading,
    metrics,
    chartData,
    impactData,
    refresh: refreshReports,
  } = useReports(startDate, endDate);

  const { loading: esgLoading, esgData, refresh: refreshESG } = useESG();

  // Export modal
  const [showExportModal, setShowExportModal] = useState(false);

  // Mock achievements data
  const achievements = {
    firstWeek: { unlocked: true, progress: 7 },
    ecoWarrior: { unlocked: true, progress: 100 },
    powerSaver: { unlocked: false, progress: 18 },
    perfectMonth: { unlocked: false, progress: 12 },
    offPeakMaster: { unlocked: true, progress: 100 },
    centuryClub: { unlocked: false, progress: 67 },
    streakMaster: { unlocked: false, progress: 23 },
    solarChampion: { unlocked: true, progress: 500 },
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    success("Date range updated");
  };

  const handleRefresh = () => {
    refreshReports();
    refreshESG();
    success("Reports refreshed!");
  };

  const period = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Reports & ESG
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Track your impact and sustainability performance
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {/* Date Range Picker */}
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
            />

            <IconButton
              icon={RefreshCw}
              variant="outline"
              onClick={handleRefresh}
              tooltip="Refresh"
            />

            <Button
              variant="gradient"
              size="default"
              onClick={() => setShowExportModal(true)}
            >
              <Download size={18} />
              Export
            </Button>
          </div>
        </div>

        {/* Impact Hero */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom duration-700">
          <ImpactHero
            totalCO2Saved={impactData?.totalCO2Saved || 0}
            totalCostSaved={metrics?.totalSavings || 0}
            period={period}
            loading={reportsLoading}
          />
        </div>

        {/* Metrics Grid */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
          <MetricsGrid metrics={metrics || {}} loading={reportsLoading} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Energy Chart - 2/3 width */}
          <div className="lg:col-span-2 animate-in fade-in slide-in-from-left duration-700 delay-200">
            <EnergyChart
              data={chartData}
              period="daily"
              loading={reportsLoading}
            />
          </div>

          {/* ESG Score - 1/3 width */}
          <div className="animate-in fade-in slide-in-from-right duration-700 delay-200">
            <ESGScoreCard
              esgData={
                esgData || { environmental: 0, social: 0, governance: 0 }
              }
              loading={esgLoading}
            />
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          <EnvironmentalImpact
            impactData={impactData || {}}
            loading={reportsLoading}
          />
        </div>

        {/* Achievements */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom duration-700 delay-400">
          <AchievementBadges achievements={achievements} loading={false} />
        </div>

        {/* Info Banner */}
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800 rounded-2xl animate-in fade-in duration-700 delay-500">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            📊 About These Reports
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            Your reports are calculated using real-time data from your devices,
            industry-standard ESG frameworks (GRI, SASB), and verified emission
            factors from Environment Canada.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Real-time energy consumption tracking</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Industry-standard ESG methodology</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Verified environmental impact calculations</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Exportable reports for compliance</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        reportData={{ metrics, chartData, impactData, esgData, period }}
      />
    </div>
  );
};

export default ReportsPage;
