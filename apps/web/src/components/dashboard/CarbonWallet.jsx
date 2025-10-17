import React from "react";
import { Leaf, TreePine, Car, Award } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Progress from "../ui/Progress";
import Badge from "../ui/Badge";

const CarbonWallet = ({ data }) => {
  const {
    totalOffset = 0,
    thisMonth = 0,
    credits = 0,
    equivalents = {},
    milestones = [],
  } = data;

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-2xl">
        <CardTitle className="flex items-center gap-2 text-white">
          <Leaf size={24} />
          Carbon Offset Wallet
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Main Stats */}
        <div className="text-center mb-8">
          <div className="inline-flex items-baseline gap-2 mb-2">
            <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {totalOffset}
            </div>
            <div className="text-xl text-slate-600 dark:text-slate-400 font-semibold">
              kg CO₂
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Total Carbon Offset
          </p>
          <Badge variant="success" className="mt-3">
            +{thisMonth} kg this month
          </Badge>
        </div>

        {/* Credits */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Carbon Credits
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {credits}
              </div>
            </div>
            <Award className="text-green-600 dark:text-green-400" size={48} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
            Trade in marketplace or donate to green projects
          </p>
        </div>

        {/* Equivalents */}
        <div className="space-y-4 mb-6">
          <h4 className="font-semibold text-slate-900 dark:text-white">
            Environmental Impact
          </h4>

          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <TreePine
                className="text-green-600 dark:text-green-400"
                size={24}
              />
            </div>
            <div className="flex-1">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Equivalent to planting
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {equivalents.trees || 0} trees
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Car className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div className="flex-1">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Miles not driven
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {equivalents.miles?.toLocaleString() || 0} mi
              </div>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Award size={18} className="text-yellow-500" />
            Milestones
          </h4>

          {milestones.map((milestone, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {milestone.name}
                </span>
                {milestone.achieved ? (
                  <Badge variant="success">✓ Achieved</Badge>
                ) : (
                  <span className="text-sm text-slate-500 dark:text-slate-500">
                    {milestone.progress}%
                  </span>
                )}
              </div>
              {!milestone.achieved && (
                <Progress
                  value={milestone.progress}
                  variant="success"
                  size="sm"
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CarbonWallet;
