import React from "react";
import { Coins } from "lucide-react";
import type { PlayerProfile } from "../types/type";

interface OreSmelterProps {
  playerProfile: PlayerProfile;
  isProcessing: boolean;
  onMint: () => Promise<void>;
}

export const OreSmelter: React.FC<OreSmelterProps> = ({
  playerProfile,
  isProcessing,
  onMint,
}) => {
  return (
    <div className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-cosmic-panel dark:bg-cosmic-station shadow-sm flex flex-col justify-between hover:border-cosmic-primary/40 transition-colors duration-300">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-heading font-bold text-sm text-cosmic-light-text dark:text-white">
            QUANTUM ORE SMELTER
          </h4>
          <span className="text-[9px] bg-cosmic-primary/10 text-indigo-400 border border-cosmic-primary/20 px-2 py-0.5 rounded font-mono">
            RATIO 100:1
          </span>
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-400 leading-relaxed mb-6">
          Bridge your raw off-chain resources into the permanent ledger. Convert
          accumulated Iron Ore payload directly into decentralized $ORE assets.
        </p>
      </div>

      <button
        onClick={() => {
          void onMint();
        }}
        disabled={isProcessing || playerProfile.ironOre < 100}
        className="w-full flex items-center justify-center gap-2 font-heading text-xs tracking-wider bg-linear-to-r from-cosmic-primary to-indigo-500 hover:opacity-90 text-white py-3.5 px-4 rounded-xl font-bold shadow-neon-primary disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-cosmic-panel dark:disabled:to-cosmic-panel dark:disabled:text-slate-500 disabled:opacity-40 disabled:shadow-none transition-all duration-200 cursor-pointer"
      >
        <Coins className="w-4 h-4" />
        {playerProfile.ironOre < 100
          ? "MINIMUM 100 KG REQUIRED"
          : "SMELT AND MINT $ORE TOKENS"}
      </button>
    </div>
  );
};
