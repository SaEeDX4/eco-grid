import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import AchievementBadge from "../ui/AchievementBadge";
import {
  Trophy,
  Target,
  Zap,
  Leaf,
  Star,
  Award,
  Flame,
  Sparkles,
} from "lucide-react";

const AchievementBadges = ({ achievements, loading = false }) => {
  const [filter, setFilter] = useState("all"); // 'all', 'unlocked', 'locked'

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const badgeDefinitions = [
    {
      id: "first_week",
      title: "First Week",
      description: "Complete your first week of energy tracking",
      icon: Star,
      color: "from-blue-500 to-cyan-500",
      progress: achievements.firstWeek?.progress || 0,
      max: 7,
      unlocked: achievements.firstWeek?.unlocked || false,
    },
    {
      id: "eco_warrior",
      title: "Eco Warrior",
      description: "Save 100 kg of CO₂",
      icon: Leaf,
      color: "from-green-500 to-emerald-500",
      progress: achievements.ecoWarrior?.progress || 0,
      max: 100,
      unlocked: achievements.ecoWarrior?.unlocked || false,
    },
    {
      id: "power_saver",
      title: "Power Saver",
      description: "Reduce consumption by 20% for a month",
      icon: Zap,
      color: "from-yellow-500 to-amber-500",
      progress: achievements.powerSaver?.progress || 0,
      max: 30,
      unlocked: achievements.powerSaver?.unlocked || false,
    },
    {
      id: "perfect_month",
      title: "Perfect Month",
      description: "Optimize every day for 30 days",
      icon: Trophy,
      color: "from-purple-500 to-pink-500",
      progress: achievements.perfectMonth?.progress || 0,
      max: 30,
      unlocked: achievements.perfectMonth?.unlocked || false,
    },
    {
      id: "off_peak_master",
      title: "Off-Peak Master",
      description: "Shift 80% of usage to off-peak hours",
      icon: Target,
      color: "from-orange-500 to-red-500",
      progress: achievements.offPeakMaster?.progress || 0,
      max: 100,
      unlocked: achievements.offPeakMaster?.unlocked || false,
    },
    {
      id: "century_club",
      title: "Century Club",
      description: "Save $100 in total",
      icon: Award,
      color: "from-indigo-500 to-purple-500",
      progress: achievements.centuryClub?.progress || 0,
      max: 100,
      unlocked: achievements.centuryClub?.unlocked || false,
    },
    {
      id: "streak_master",
      title: "Streak Master",
      description: "Maintain 30-day optimization streak",
      icon: Flame,
      color: "from-red-500 to-orange-500",
      progress: achievements.streakMaster?.progress || 0,
      max: 30,
      unlocked: achievements.streakMaster?.unlocked || false,
    },
    {
      id: "solar_champion",
      title: "Solar Champion",
      description: "Generate 500 kWh from solar",
      icon: Sparkles,
      color: "from-yellow-500 to-orange-500",
      progress: achievements.solarChampion?.progress || 0,
      max: 500,
      unlocked: achievements.solarChampion?.unlocked || false,
    },
  ];

  const filteredBadges = badgeDefinitions.filter((badge) => {
    if (filter === "unlocked") return badge.unlocked;
    if (filter === "locked") return !badge.unlocked;
    return true;
  });

  const unlockedCount = badgeDefinitions.filter((b) => b.unlocked).length;
  const totalCount = badgeDefinitions.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-yellow-600" size={24} />
            Achievements ({unlockedCount}/{totalCount})
          </CardTitle>

          {/* Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {["all", "unlocked", "locked"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  px-4 py-1.5 rounded-lg text-sm font-medium capitalize
                  transition-all duration-200
                  ${
                    filter === f
                      ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }
                `}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Overall Progress
            </span>
            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </span>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
          {filteredBadges.map((badge, index) => (
            <div
              key={badge.id}
              className="animate-in fade-in zoom-in duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <AchievementBadge
                title={badge.title}
                description={badge.description}
                icon={badge.icon}
                unlocked={badge.unlocked}
                progress={badge.progress}
                max={badge.max}
                color={badge.color}
                size="lg"
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBadges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <p className="text-slate-600 dark:text-slate-400">
              No {filter} achievements yet. Keep optimizing!
            </p>
          </div>
        )}

        {/* Next Achievement */}
        {unlockedCount < totalCount && (
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
            <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Target size={20} className="text-blue-600" />
              Next Achievement
            </h4>
            {(() => {
              const nextBadge =
                badgeDefinitions.find((b) => !b.unlocked && b.progress > 0) ||
                badgeDefinitions.find((b) => !b.unlocked);
              if (!nextBadge) return null;

              return (
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${nextBadge.color} opacity-50 flex items-center justify-center`}
                  >
                    <nextBadge.icon className="text-white" size={28} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {nextBadge.title}
                    </h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {nextBadge.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${nextBadge.color} rounded-full transition-all duration-500`}
                          style={{
                            width: `${(nextBadge.progress / nextBadge.max) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {nextBadge.progress}/{nextBadge.max}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementBadges;
