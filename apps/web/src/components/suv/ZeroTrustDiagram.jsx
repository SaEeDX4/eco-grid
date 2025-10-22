import React, { useState } from "react";
import { Shield, Lock, Eye, CheckCircle, AlertTriangle } from "lucide-react";

const ZeroTrustDiagram = () => {
  const [activeLayer, setActiveLayer] = useState(null);

  const layers = [
    {
      id: "identity",
      title: "Identity Verification",
      description: "Every user and device must prove identity before access.",
      icon: Shield,
      color: "from-blue-500 to-cyan-600",
      position: { top: "20%", left: "50%" },
      features: [
        "Multi-Factor Authentication",
        "Biometric Options",
        "Device Fingerprinting",
      ],
    },
    {
      id: "device",
      title: "Device Security",
      description: "Continuous health monitoring of all connected devices.",
      icon: Lock,
      color: "from-purple-500 to-pink-600",
      position: { top: "40%", left: "25%" },
      features: ["Endpoint Detection", "Patch Management", "Compliance Checks"],
    },
    {
      id: "network",
      title: "Network Segmentation",
      description: "Micro-segmentation to limit lateral movement.",
      icon: Eye,
      color: "from-green-500 to-emerald-600",
      position: { top: "40%", left: "75%" },
      features: [
        "Zero Trust Network Access",
        "Encrypted Tunnels",
        "Traffic Inspection",
      ],
    },
    {
      id: "application",
      title: "Application Security",
      description: "Granular access control at application level.",
      icon: CheckCircle,
      color: "from-orange-500 to-red-600",
      position: { top: "60%", left: "35%" },
      features: ["Role-Based Access", "API Security", "Session Management"],
    },
    {
      id: "data",
      title: "Data Protection",
      description: "Encryption and classification of all data assets.",
      icon: AlertTriangle,
      color: "from-indigo-500 to-purple-600",
      position: { top: "60%", left: "65%" },
      features: [
        "AES-256 Encryption",
        "Data Loss Prevention",
        "Access Logging",
      ],
    },
  ];

  return (
    <div className="relative w-full h-[600px] rounded-2xl bg-slate-900 border-2 border-slate-800 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.4) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Center Core */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl animate-pulse">
          <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center">
            <Shield className="text-white" size={48} />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping" />
        </div>
        <div className="text-center mt-4">
          <div className="text-white font-bold text-lg">Zero Trust Core</div>
          <div className="text-blue-400 text-sm">
            Never Trust, Always Verify
          </div>
        </div>
      </div>

      {/* Security Layers */}
      {layers.map((layer) => {
        const Icon = layer.icon;
        const isActive = activeLayer === layer.id;

        return (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(isActive ? null : layer.id)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
            style={{
              top: layer.position.top,
              left: layer.position.left,
            }}
          >
            {/* Node */}
            <div
              className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${layer.color}
                flex items-center justify-center shadow-xl
                transition-all duration-300 ${
                  isActive
                    ? "scale-125 ring-4 ring-white/50"
                    : "group-hover:scale-110"
                }`}
            >
              <Icon className="text-white" size={32} />
            </div>

            {/* Label */}
            <div
              className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap transition-opacity duration-300 ${
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <div className="bg-white dark:bg-slate-800 px-3 py-1 rounded-lg shadow-lg text-xs font-bold">
                {layer.title}
              </div>
            </div>

            {/* Detail Panel */}
            {isActive && (
              <div className="absolute top-full mt-12 left-1/2 transform -translate-x-1/2 w-64 p-4 rounded-xl bg-white dark:bg-slate-800 shadow-2xl border-2 border-slate-200 dark:border-slate-700 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                  {layer.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {layer.description}
                </p>
                <div className="space-y-1">
                  {layer.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle
                        size={12}
                        className="text-green-600 dark:text-green-400"
                      />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </button>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span>Monitoring</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Click to explore</span>
        </div>
      </div>
    </div>
  );
};

export default ZeroTrustDiagram;
