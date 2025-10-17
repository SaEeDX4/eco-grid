import React from "react";
import {
  Zap,
  TrendingDown,
  Shield,
  Smartphone,
  Brain,
  Users,
  Battery,
  Sun,
  Wind,
  Clock,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/Card";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const [ref, isVisible] = useScrollAnimation(0.3);

  return (
    <div
      ref={ref}
      className="animate-in fade-in slide-in-from-bottom-4 duration-1000"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Card hover className="h-full group">
        <CardHeader>
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all">
            <Icon size={28} className="text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base leading-relaxed">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

const Features = () => {
  const [ref, isVisible] = useScrollAnimation(0.2);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Optimization",
      description:
        "Claude AI analyzes your usage patterns and automatically optimizes energy consumption for maximum savings.",
      delay: 0,
    },
    {
      icon: TrendingDown,
      title: "Reduce Bills by 40%",
      description:
        "Smart scheduling and load shifting during off-peak hours dramatically reduce your monthly energy costs.",
      delay: 100,
    },
    {
      icon: Smartphone,
      title: "Real-Time Control",
      description:
        "Monitor and control all your devices from anywhere with our beautiful mobile and desktop apps.",
      delay: 200,
    },
    {
      icon: Battery,
      title: "Battery Storage",
      description:
        "Optimize home battery usage to store cheap energy and sell back during peak prices through VPP.",
      delay: 300,
    },
    {
      icon: Sun,
      title: "Solar Integration",
      description:
        "Maximize your solar investment with intelligent forecasting and automated energy distribution.",
      delay: 400,
    },
    {
      icon: Wind,
      title: "Carbon Tracking",
      description:
        "Track your CO₂ reduction and earn carbon credits that can be traded in our marketplace.",
      delay: 500,
    },
    {
      icon: Users,
      title: "P2P Energy Trading",
      description:
        "Buy and sell excess energy directly with neighbors in a secure, blockchain-verified marketplace.",
      delay: 600,
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-grade encryption, PIPEDA compliant, and zero-trust architecture protect your data.",
      delay: 700,
    },
    {
      icon: Clock,
      title: "Predictive Analytics",
      description:
        "Machine learning forecasts energy prices, weather, and demand to optimize your usage 24/7.",
      delay: 800,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" ref={ref}>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Everything You Need
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Comprehensive energy management powered by cutting-edge AI and
            designed for Canadian homes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
