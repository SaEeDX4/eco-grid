import React, { useState } from "react";

export const Tabs = ({ tabs, defaultTab = 0, onChange, className = "" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    if (onChange) onChange(index);
  };

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={`
              flex-1 px-4 py-3 rounded-lg font-semibold text-sm
              transition-all duration-300
              ${
                activeTab === index
                  ? "bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }
            `}
          >
            {tab.icon && <tab.icon className="inline mr-2" size={18} />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};
