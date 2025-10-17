import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

const DateRangePicker = ({ startDate, endDate, onChange, presets = true }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const presetRanges = [
    {
      label: "Last 7 Days",
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);
        return { start, end };
      },
    },
    {
      label: "Last 30 Days",
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        return { start, end };
      },
    },
    {
      label: "This Month",
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { start, end };
      },
    },
    {
      label: "Last Month",
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return { start, end };
      },
    },
    {
      label: "This Year",
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const end = new Date(now.getFullYear(), 11, 31);
        return { start, end };
      },
    },
  ];

  const handlePresetClick = (preset) => {
    const { start, end } = preset.getValue();
    onChange(start, end);
    setShowPicker(false);
  };

  const handleApply = () => {
    onChange(tempStart, tempEnd);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className={`
          flex items-center gap-3 px-6 py-3 rounded-xl
          bg-white dark:bg-slate-800
          border-2 border-slate-200 dark:border-slate-700
          hover:border-blue-300 dark:hover:border-blue-600
          transition-all duration-300
          shadow-sm hover:shadow-md
          group
        `}
      >
        <Calendar
          size={20}
          className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform"
        />
        <div className="text-left">
          <div className="text-xs text-slate-500 dark:text-slate-500">
            Date Range
          </div>
          <div className="font-semibold text-slate-900 dark:text-white">
            {formatDate(startDate)} - {formatDate(endDate)}
          </div>
        </div>
        <ChevronRight
          size={16}
          className={`
            text-slate-400 transition-transform duration-300
            ${showPicker ? "rotate-90" : ""}
          `}
        />
      </button>

      {/* Picker Dropdown */}
      {showPicker && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPicker(false)}
          />

          {/* Picker Panel */}
          <div
            className={`
            absolute top-full left-0 mt-2 z-50
            w-[600px] bg-white dark:bg-slate-800
            border-2 border-slate-200 dark:border-slate-700
            rounded-2xl shadow-2xl
            animate-in fade-in slide-in-from-top-2 duration-300
          `}
          >
            <div className="flex">
              {/* Presets */}
              {presets && (
                <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 p-4">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Quick Select
                  </h4>
                  <div className="space-y-1">
                    {presetRanges.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => handlePresetClick(preset)}
                        className={`
                          w-full text-left px-3 py-2 rounded-lg
                          text-sm font-medium
                          hover:bg-blue-50 dark:hover:bg-blue-950/30
                          hover:text-blue-600 dark:hover:text-blue-400
                          transition-colors duration-200
                        `}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Calendar */}
              <div className="flex-1 p-4">
                <div className="space-y-4">
                  {/* Start Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={tempStart?.toISOString().split("T")[0]}
                      onChange={(e) => setTempStart(new Date(e.target.value))}
                      className={`
                        w-full px-4 py-2 rounded-lg
                        bg-slate-50 dark:bg-slate-900
                        border border-slate-200 dark:border-slate-700
                        text-slate-900 dark:text-white
                        focus:ring-2 focus:ring-blue-500
                        transition-all duration-200
                      `}
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={tempEnd?.toISOString().split("T")[0]}
                      onChange={(e) => setTempEnd(new Date(e.target.value))}
                      className={`
                        w-full px-4 py-2 rounded-lg
                        bg-slate-50 dark:bg-slate-900
                        border border-slate-200 dark:border-slate-700
                        text-slate-900 dark:text-white
                        focus:ring-2 focus:ring-blue-500
                        transition-all duration-200
                      `}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPicker(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={handleApply}
                      className="flex-1"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangePicker;
