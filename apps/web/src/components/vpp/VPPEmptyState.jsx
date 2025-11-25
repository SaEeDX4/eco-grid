import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";

const VPPEmptyState = ({ type = "general" }) => {
  const navigate = useNavigate();

  const states = {
    general: {
      icon: "Layers",
      title: "Welcome to Virtual Power Plant",
      description:
        "Join a VPP pool to start earning revenue from your devices while supporting grid stability.",
      action: "Browse Pools",
      onAction: () => navigate("/vpp/pools"),
    },
    noPools: {
      icon: "Inbox",
      title: "Not Enrolled in Any Pools",
      description:
        "Join a VPP pool to aggregate your devices and participate in energy markets.",
      action: "Browse Available Pools",
      onAction: () => navigate("/vpp/pools"),
    },
    noDevices: {
      icon: "Zap",
      title: "No VPP-Enabled Devices",
      description:
        "Add compatible devices to your account to start participating in VPP programs.",
      action: "Go to Devices",
      onAction: () => navigate("/devices"),
    },
    noRevenue: {
      icon: "DollarSign",
      title: "No Revenue Yet",
      description:
        "Once you join a pool and dispatches start, your revenue will appear here.",
      action: "View Pools",
      onAction: () => navigate("/vpp/pools"),
    },
    noDispatches: {
      icon: "Calendar",
      title: "No Dispatches Scheduled",
      description:
        "Your devices are available but no dispatch events are scheduled at this time.",
      action: null,
    },
  };

  const state = states[type] || states.general;
  const Icon = Icons[state.icon];

  return (
    <motion.div
      className="text-center py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl">
        <Icon className="text-white" size={48} />
      </div>

      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
        {state.title}
      </h2>

      <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
        {state.description}
      </p>

      {state.action && (
        <button
          onClick={state.onAction}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold hover:shadow-xl transition-all inline-flex items-center gap-2"
        >
          {state.action}
          <Icons.ArrowRight size={20} />
        </button>
      )}
    </motion.div>
  );
};

export default VPPEmptyState;
