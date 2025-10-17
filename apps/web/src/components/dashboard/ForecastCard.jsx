import React from "react";
import { CloudSun, TrendingUp, Clock, Lightbulb } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Badge from "../ui/Badge";

const ForecastCard = ({ forecast }) => {
  const {
    peakHours = [],
    offPeakHours = [],
    avgPrice = 0,
    weather = {},
    recommendation = "",
  } = forecast;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudSun className="text-blue-600" size={24} />
          Tomorrow's Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Weather */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-3xl">
            ☀️
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {weather.temp}°C
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {weather.condition}
            </div>
          </div>
        </div>

        {/* Price Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl">
            <TrendingUp
              className="mx-auto text-green-600 dark:text-green-400 mb-2"
              size={24}
            />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              ${avgPrice.toFixed(3)}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Avg Price/kWh
            </div>
          </div>

          <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl">
            <Clock
              className="mx-auto text-purple-600 dark:text-purple-400 mb-2"
              size={24}
            />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {offPeakHours.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Off-Peak Windows
            </div>
          </div>
        </div>

        {/* Peak/Off-Peak Hours */}
        <div className="space-y-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="error" className="text-xs">
                Peak Hours
              </Badge>
              <span className="text-xs text-slate-500 dark:text-slate-500">
                Higher rates
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {peakHours.map((hour, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium"
                >
                  {hour}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="success" className="text-xs">
                Off-Peak Hours
              </Badge>
              <span className="text-xs text-slate-500 dark:text-slate-500">
                Best rates
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {offPeakHours.map((hour, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium"
                >
                  {hour}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
          <div className="flex items-start gap-3">
            <Lightbulb className="flex-shrink-0 mt-0.5" size={20} />
            <div>
              <div className="font-semibold mb-1">AI Recommendation</div>
              <div className="text-sm opacity-95">{recommendation}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;
