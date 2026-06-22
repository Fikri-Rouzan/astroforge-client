import React from "react";
import { Coins, Flame, Gem } from "lucide-react";
import type { PlayerProfile } from "../types/type";

interface ResourceGridProps {
  playerProfile: PlayerProfile;
  totalLiveIronOre: number;
}

export const ResourceGrid: React.FC<ResourceGridProps> = ({
  playerProfile,
  totalLiveIronOre,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {/* Iron Ore */}
      <div className="p-5 rounded-2xl border border-gray-200 dark:border-cosmic-panel bg-white dark:bg-cosmic-station shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-400 dark:text-slate-500 font-heading tracking-wider block">
            IRON ORE Payload
          </span>
          <span className="text-2xl font-bold font-heading text-slate-700 dark:text-white mt-1 block">
            {totalLiveIronOre.toFixed(2)}{" "}
            <span className="text-xs text-gray-400 dark:text-slate-500 font-mono">
              KG
            </span>
          </span>
        </div>
        <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-cosmic-primary">
          <Coins className="w-6 h-6" />
        </div>
      </div>

      {/* Fuel supply */}
      <div className="p-5 rounded-2xl border border-gray-200 dark:border-cosmic-panel bg-white dark:bg-cosmic-station shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-400 dark:text-slate-500 font-heading tracking-wider block">
            FUEL SUPPLY
          </span>
          <span className="text-2xl font-bold font-heading text-slate-700 dark:text-white mt-1 block">
            {playerProfile.fuel}%
          </span>
        </div>
        <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cosmic-secondary">
          <Flame className="w-6 h-6" />
        </div>
      </div>

      {/* Platinum revenue */}
      <div className="p-5 rounded-2xl border border-gray-200 dark:border-cosmic-panel bg-white dark:bg-cosmic-station shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-400 dark:text-slate-500 font-heading tracking-wider block">
            PLATINUM REVENUE
          </span>
          <span className="text-2xl font-bold font-heading text-slate-700 dark:text-white mt-1 block">
            {playerProfile.platinum}
          </span>
        </div>
        <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-cosmic-accent">
          <Gem className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
