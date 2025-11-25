import React from "react";
import { NavLink } from "react-router-dom";
import * as Icons from "lucide-react";

const Navigation = () => {
  const navSections = [
    {
      title: "Main",
      items: [
        { to: "/dashboard", icon: "LayoutDashboard", label: "Dashboard" },
        { to: "/devices", icon: "Zap", label: "Devices" },
        { to: "/optimizer", icon: "Settings", label: "Optimizer" },
        { to: "/reports", icon: "FileText", label: "Reports" },
      ],
    },

    {
      title: "Virtual Power Plant",
      items: [
        { to: "/vpp/pools", icon: "Users", label: "Pools" },
        { to: "/vpp/markets", icon: "TrendingUp", label: "Markets" },
        { to: "/vpp/revenue", icon: "DollarSign", label: "Revenue" },
      ],
    },

    {
      title: "Business Hubs",
      items: [
        { to: "/hub/list", icon: "Building", label: "All Hubs" },
        // ❗️ Removed broken route: /hub/tenants
        // There is no tenant list page in your routes config.
        // Tenant detail = /hub/tenants/:tenantId
        // Instead we add analytics to help admins navigate
        { to: "/hub/analytics", icon: "Activity", label: "Analytics" },
      ],
    },
  ];

  return (
    <nav className="space-y-8">
      {navSections.map((section) => (
        <div key={section.title}>
          {/* Section Title */}
          <div className="px-4 mb-3">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {section.title}
            </h3>
          </div>

          {/* Section Items */}
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = Icons[item.icon];
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={true}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                      isActive
                        ? "bg-blue-500 text-white shadow-lg"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  <Icon size={20} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
};

export default Navigation;
