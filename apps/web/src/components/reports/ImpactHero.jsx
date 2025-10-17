import React, { useEffect, useState } from "react";
import { Leaf, TrendingDown, Sparkles } from "lucide-react";
import { Card } from "../ui/Card";
import AnimatedNumber from "../ui/AnimatedNumber";

const ImpactHero = ({
  totalCO2Saved,
  totalCostSaved,
  period,
  loading = false,
}) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Create floating particles for visual effect
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  const treesEquivalent = Math.floor(totalCO2Saved / 20); // 20kg CO2 per tree per year
  const carsOffRoad = Math.floor(totalCO2Saved / 4600); // Average car emits 4.6 tons per year

  if (loading) {
    return (
      <Card>
        <div className="h-80 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl animate-pulse" />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700" />

      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white/20 animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative p-8 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="animate-pulse" size={24} />
              <h2 className="text-2xl font-bold">Environmental Impact</h2>
            </div>
            <p className="text-green-100 text-sm">
              Your contribution to a sustainable future • {period}
            </p>
          </div>
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <Leaf size={32} />
          </div>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* CO2 Saved */}
          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Leaf size={28} />
              </div>
              <TrendingDown className="text-white/60" size={20} />
            </div>
            <div className="mb-2">
              <div className="text-5xl font-bold mb-1">
                <AnimatedNumber
                  value={totalCO2Saved}
                  decimals={0}
                  suffix=" kg"
                  duration={2000}
                />
              </div>
              <div className="text-green-100 text-sm font-medium">
                CO₂ Emissions Avoided
              </div>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/60 rounded-full animate-pulse"
                style={{ width: "75%" }}
              />
            </div>
          </div>

          {/* Cost Saved */}
          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">💰</span>
              </div>
              <TrendingDown className="text-white/60" size={20} />
            </div>
            <div className="mb-2">
              <div className="text-5xl font-bold mb-1">
                <AnimatedNumber
                  value={totalCostSaved}
                  decimals={2}
                  prefix="$"
                  duration={2000}
                />
              </div>
              <div className="text-green-100 text-sm font-medium">
                Total Savings
              </div>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/60 rounded-full animate-pulse"
                style={{ width: "85%" }}
              />
            </div>
          </div>
        </div>

        {/* Real-World Equivalents */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="text-4xl mb-2">🌳</div>
            <div className="text-3xl font-bold mb-1">{treesEquivalent}</div>
            <div className="text-xs text-green-100">
              Trees Planted Equivalent
            </div>
          </div>
          <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="text-4xl mb-2">🚗</div>
            <div className="text-3xl font-bold mb-1">{carsOffRoad}</div>
            <div className="text-xs text-green-100">Cars Off Road</div>
          </div>
          <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="text-4xl mb-2">⚡</div>
            <div className="text-3xl font-bold mb-1">
              {Math.floor(totalCO2Saved / 0.4)}
            </div>
            <div className="text-xs text-green-100">kWh Saved</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Add floating animation to CSS
const style = document.createElement("style");
style.textContent = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) translateX(0px);
      opacity: 0.3;
    }
    50% {
      transform: translateY(-20px) translateX(10px);
      opacity: 0.6;
    }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

export default ImpactHero;
