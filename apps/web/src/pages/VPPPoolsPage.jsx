import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import PoolList from "../components/vpp/PoolList";
import { useVPPPools } from "../hooks/useVPPPools";

const VPPPoolsPage = () => {
  const [filters, setFilters] = useState({
    region: null,
    status: "active",
  });

  const { pools, loading, error } = useVPPPools(filters);
  const [userPoolIds, setUserPoolIds] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserPools();
  }, []);

  const fetchUserPools = async () => {
    try {
      const response = await fetch("/api/vpp/pools/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUserPoolIds(data.pools.map((p) => p._id));
      }
    } catch (err) {
      console.error("Fetch user pools error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Icons.Layers className="text-white" size={42} />
              <h1 className="text-5xl font-bold text-white">VPP Pools</h1>
            </div>

            <p className="text-xl text-blue-100 mb-6">
              Join aggregation pools to participate in wholesale energy markets
              and earn revenue from your devices
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                <div className="text-sm text-blue-100">Available Pools</div>
                <div className="text-2xl font-bold text-white">
                  {pools.length}
                </div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                <div className="text-sm text-blue-100">Your Pools</div>
                <div className="text-2xl font-bold text-white">
                  {userPoolIds.length}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Info Banner */}
          <motion.div
            className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Icons.Info className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                  How VPP Pools Work
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed mb-3">
                  VPP pools aggregate capacity from multiple devices to meet
                  minimum market participation requirements. Revenue is
                  distributed proportionally based on your device contribution
                  and availability.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <Icons.CheckCircle
                      size={16}
                      className="text-green-600 dark:text-green-400"
                    />
                    <span>Automated bidding</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <Icons.CheckCircle
                      size={16}
                      className="text-green-600 dark:text-green-400"
                    />
                    <span>Battery health protection</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <Icons.CheckCircle
                      size={16}
                      className="text-green-600 dark:text-green-400"
                    />
                    <span>Daily revenue tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pool List */}
          <PoolList pools={pools} loading={loading} userPoolIds={userPoolIds} />
        </div>
      </section>
    </div>
  );
};

export default VPPPoolsPage;
