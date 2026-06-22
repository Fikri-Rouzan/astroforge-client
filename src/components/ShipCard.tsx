import React from "react";
import { Pickaxe, Gauge, ArrowUpCircle } from "lucide-react";
import type { Ship } from "../types/type";

interface ShipCardProps {
  ship: Ship;
  livePendingAmount: number;
  ironOreBalance: number;
  actionLoadingId: number | null;
  onLaunch: (id: number) => Promise<void>;
  onClaim: (id: number) => Promise<void>;
  onUpgrade: (id: number) => Promise<void>;
}

export const ShipCard: React.FC<ShipCardProps> = ({
  ship,
  livePendingAmount,
  ironOreBalance,
  actionLoadingId,
  onLaunch,
  onClaim,
  onUpgrade,
}) => {
  const upgradeCost = Math.floor(Number(ship.miningRatePerSecond) * 2000);
  const canAffordUpgrade = ironOreBalance >= upgradeCost;
  const isMining = ship.status === "MINING";

  return (
    <div className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-cosmic-panel dark:bg-cosmic-station shadow-sm flex flex-col justify-between hover:shadow-neon-glow transition-all duration-300">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-heading font-bold text-sm tracking-wide text-cosmic-light-text dark:text-white">
              {ship.shipName}
            </h4>
            <span className="text-[10px] text-gray-400 dark:text-slate-500 font-mono">
              REGID: 00{ship.id} // CONFIG
            </span>
          </div>

          <span
            className={`text-[10px] font-heading font-bold px-2.5 py-1 rounded-md tracking-widest ${
              isMining
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse"
                : "bg-amber-500/10 text-cosmic-accent border border-amber-500/20"
            }`}
          >
            {ship.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 dark:bg-cosmic-panel/40 p-4 rounded-xl border border-gray-100 dark:border-cosmic-panel/20">
          <div className="flex items-center gap-2">
            <Pickaxe className="w-4 h-4 text-indigo-400" />
            <div>
              <span className="text-[10px] text-gray-400 block font-heading">
                SPEED
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">
                {ship.miningRatePerSecond}{" "}
                <span className="text-[9px] text-gray-400">/s</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-[10px] text-gray-400 block font-heading">
                CARGO HOLD
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">
                {isMining ? livePendingAmount.toFixed(1) : "0"} /{" "}
                {ship.maxCargo}{" "}
                <span className="text-[9px] text-gray-400">KG</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          {!isMining ? (
            <button
              onClick={() => {
                void onLaunch(ship.id);
              }}
              disabled={actionLoadingId !== null}
              className="w-full font-heading text-xs tracking-wider bg-cosmic-primary hover:bg-indigo-500 text-white py-3.5 px-4 rounded-xl font-bold hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 transition-all duration-200 cursor-pointer"
            >
              {actionLoadingId === ship.id ? "LAUNCHING..." : "LAUNCH SHIP"}
            </button>
          ) : (
            <button
              onClick={() => {
                void onClaim(ship.id);
              }}
              disabled={actionLoadingId !== null}
              className="w-full font-heading text-xs tracking-wider bg-transparent border border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-400 py-3.5 px-4 rounded-xl font-bold hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 transition-all duration-200 cursor-pointer"
            >
              {actionLoadingId === ship.id ? "REFINING..." : "CLAIM CARGO"}
            </button>
          )}
        </div>

        <button
          onClick={() => {
            void onUpgrade(ship.id);
          }}
          disabled={actionLoadingId !== null || isMining || !canAffordUpgrade}
          className="flex-1 flex items-center justify-center gap-2 font-heading text-xs tracking-wider bg-transparent border border-gray-300 dark:border-cosmic-panel hover:bg-gray-100 dark:hover:bg-cosmic-panel/50 text-cosmic-accent py-3.5 px-4 rounded-xl font-bold disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
        >
          <ArrowUpCircle className="w-4 h-4" />
          <span>
            {actionLoadingId === ship.id
              ? "UPGRADING..."
              : `UPGRADE (${upgradeCost})`}
          </span>
        </button>
      </div>
    </div>
  );
};
