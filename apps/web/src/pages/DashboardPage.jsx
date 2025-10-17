import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  TrendingDown,
  Leaf,
  Zap,
  Download,
  RefreshCw,
} from "lucide-react";
import { useDashboardData } from "../hooks/useDashboardData";
import { useRealTimeData } from "../hooks/useRealTimeData";
import { useToast } from "../hooks/useToast";
import KPICard from "../components/dashboard/KPICard";
import EnergyMonitor from "../components/dashboard/EnergyMonitor";
import TrendChart from "../components/dashboard/TrendChart";
import ForecastCard from "../components/dashboard/ForecastCard";
import AICoach from "../components/dashboard/AICoach";
import QuickActions from "../components/dashboard/QuickActions";
import CarbonWallet from "../components/dashboard/CarbonWallet";
import SavingsSimulator from "../components/dashboard/SavingsSimulator";
import BillComparison from "../components/dashboard/BillComparison";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";
import Button from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { mockDashboardData } from "../lib/mockData"; // ✅ added

const DashboardPage = () => {
  const navigate = useNavigate();

  // ✅ Added: check for token and redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
    }
  }, [navigate]);

  const { data, loading, refresh } = useDashboardData();
  const realtimeData = useRealTimeData(5000);
  const { success } = useToast();

  const handleExport = () => {
    success("Exporting dashboard data...");
  };

  const handleRefresh = () => {
    refresh();
    success("Dashboard refreshed!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>

          {/* KPI Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6"
              >
                <Skeleton className="w-12 h-12 rounded-xl mb-4" />
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>

          {/* Chart Skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-8">
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome Back! 👋
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Here's your energy overview for today
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="default"
              onClick={handleRefresh}
              className="group"
            >
              <RefreshCw
                size={18}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
              Refresh
            </Button>
            <Button variant="gradient" size="default" onClick={handleExport}>
              <Download size={18} />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            icon={Zap}
            title="Current Usage"
            value={realtimeData.currentUsage}
            unit=" kW"
            trend={-12}
            trendLabel="vs yesterday"
            color="blue"
            tooltip="Real-time energy consumption"
          />
          <KPICard
            icon={DollarSign}
            title="Today's Cost"
            value={data?.kpis?.todayCost || 0}
            prefix="$"
            trend={-8}
            trendLabel="vs yesterday"
            color="green"
            tooltip="Estimated cost for today"
          />
          <KPICard
            icon={TrendingDown}
            title="Today's Savings"
            value={data?.kpis?.todaySavings || 0}
            prefix="$"
            trend={15}
            trendLabel="vs yesterday"
            color="purple"
            tooltip="Money saved through optimization"
          />
          <KPICard
            icon={Leaf}
            title="Carbon Offset"
            value={data?.kpis?.carbonOffset || 0}
            unit=" kg"
            trend={5}
            trendLabel="this week"
            color="orange"
            tooltip="CO₂ emissions prevented"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-in fade-in slide-in-from-left duration-700 delay-100">
              <EnergyMonitor
                currentUsage={realtimeData.currentUsage}
                capacity={10}
                status={
                  realtimeData.currentUsage > 7
                    ? "high"
                    : realtimeData.currentUsage > 5
                      ? "normal"
                      : "normal"
                }
              />
            </div>

            <div className="animate-in fade-in slide-in-from-left duration-700 delay-200">
              {/* ✅ Fixed line below */}
              <TrendChart
                data={
                  data?.trends?.last7Days || mockDashboardData.trends.last7Days
                }
              />
            </div>

            <div className="animate-in fade-in slide-in-from-left duration-700 delay-300">
              <BillComparison data={data?.billComparison || {}} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="animate-in fade-in slide-in-from-right duration-700 delay-100">
              <ForecastCard forecast={data?.forecast?.tomorrow || {}} />
            </div>

            <div className="animate-in fade-in slide-in-from-right duration-700 delay-200">
              <AICoach tips={data?.aiCoachTips || []} />
            </div>

            <div className="animate-in fade-in slide-in-from-right duration-700 delay-300">
              <QuickActions devices={data?.devices || []} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            <CarbonWallet data={data?.carbonWallet || {}} />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            <ActivityTimeline activities={data?.recentActivity || []} />
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          <SavingsSimulator />
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl animate-in fade-in duration-700 delay-400">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
            💡 Dashboard Pro Tips
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Click on any KPI card to see detailed breakdown</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Charts are interactive - hover for details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>AI Coach updates every 6 hours with fresh tips</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Export data anytime for your records</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
