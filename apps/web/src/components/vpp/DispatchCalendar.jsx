import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import DispatchCard from "./DispatchCard";

const DispatchCalendar = ({ calendar, onCancelDispatch }) => {
  if (!calendar || Object.keys(calendar).length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <Icons.Calendar className="text-slate-400" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          No Upcoming Dispatches
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Your schedule is clear for the next 7 days
        </p>
      </div>
    );
  }

  // Sort dates
  const sortedDates = Object.keys(calendar).sort();

  return (
    <div className="space-y-6">
      {sortedDates.map((date, index) => {
        const dispatches = calendar[date];
        const dateObj = new Date(date);
        const isToday = date === new Date().toISOString().split("T")[0];
        const dayName = dateObj.toLocaleDateString("en-US", {
          weekday: "long",
        });
        const dateStr = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        return (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {/* Date Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center ${
                  isToday
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                }`}
              >
                <div className="text-xs font-semibold uppercase">
                  {dateObj.toLocaleDateString("en-US", { month: "short" })}
                </div>
                <div className="text-2xl font-bold">{dateObj.getDate()}</div>
              </div>

              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {dayName}
                  {isToday && (
                    <span className="ml-2 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/30 text-xs font-bold text-blue-600 dark:text-blue-400">
                      Today
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {dispatches.length} dispatch
                  {dispatches.length !== 1 ? "es" : ""}
                </div>
              </div>
            </div>

            {/* Dispatches */}
            <div className="space-y-3 ml-20">
              {dispatches.map((dispatch) => (
                <DispatchCard
                  key={dispatch._id}
                  dispatch={dispatch}
                  showActions={true}
                  onCancel={onCancelDispatch}
                />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DispatchCalendar;
