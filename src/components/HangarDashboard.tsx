import React, { useState } from "react";
import { Ship as ShipIcon, Pickaxe, Gauge } from "lucide-react";
import { useWeb3 } from "../context/Web3Context.js";
import { API_CONFIG } from "../config/api.config.js";
import { toast } from "react-hot-toast";

export const HangarDashboard: React.FC = () => {
  const { playerProfile, authToken, refreshProfile } = useWeb3();
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // Safeguard if profile or ships data hasn't loaded yet
  if (
    !playerProfile ||
    !playerProfile.ships ||
    playerProfile.ships.length === 0
  ) {
    return (
      <div className="p-8 text-center rounded-2xl border border-gray-200 dark:border-cosmic-panel bg-white dark:bg-cosmic-station">
        <p className="text-sm text-gray-400 dark:text-slate-500">
          No active spaceships registered in your hangar node.
        </p>
      </div>
    );
  }

  /**
   * Dispatches a secure network request to launch a ship into space
   */
  const handleLaunch = async (shipId: number) => {
    if (!authToken) return;
    setActionLoadingId(shipId);

    try {
      const response = await fetch(API_CONFIG.endpoints.mining.launch, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ shipId }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      // Refresh the global profile layout context dynamically
      await refreshProfile();
      toast.success("Spaceship launched into the asteroid belts successfully!");
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Launch sequence error.";
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  /**
   * Dispatches a secure network request to claim accumulated ore cargo
   */
  const handleClaim = async (shipId: number) => {
    if (!authToken) return;
    setActionLoadingId(shipId);

    try {
      const response = await fetch(API_CONFIG.endpoints.mining.claim, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ shipId }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      await refreshProfile();
      toast.success("Mined resource cargo safely secured into storage tanks!");
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Refinery cargo claim error.";
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <section className="mt-8">
      <div className="mb-4">
        <h3 className="text-lg font-bold font-heading text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <ShipIcon className="w-5 h-5 text-cosmic-secondary" />
          FLEET HANGAR BAY
        </h3>
      </div>

      {/* Spaceship layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {playerProfile.ships.map((ship) => (
          <div
            key={ship.id}
            className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-cosmic-panel dark:bg-cosmic-station shadow-sm flex flex-col justify-between hover:shadow-neon-glow transition-all duration-300"
          >
            {/* Ship details */}
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

                {/* Status badge */}
                <span
                  className={`text-[10px] font-heading font-bold px-2.5 py-1 rounded-md tracking-widest ${
                    ship.status === "MINING"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse"
                      : "bg-amber-500/10 text-cosmic-accent border border-amber-500/20"
                  }`}
                >
                  {ship.status}
                </span>
              </div>

              {/* Hardware telemetry */}
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
                      MAX CARGO
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">
                      {ship.maxCargo}{" "}
                      <span className="text-[9px] text-gray-400">KG</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div>
              {ship.status === "IDLE" ? (
                <button
                  onClick={() => {
                    void handleLaunch(ship.id);
                  }}
                  disabled={actionLoadingId !== null}
                  className="w-full font-heading text-xs tracking-wider bg-cosmic-primary hover:bg-indigo-500 text-white py-3 px-4 rounded-xl font-bold hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 transition-all duration-200 cursor-pointer"
                >
                  {actionLoadingId === ship.id
                    ? "LAUNCHING..."
                    : "LAUNCH TO ASTEROID FIELD"}
                </button>
              ) : (
                <button
                  onClick={() => {
                    void handleClaim(ship.id);
                  }}
                  disabled={actionLoadingId !== null}
                  className="w-full font-heading text-xs tracking-wider bg-transparent border border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-400 py-3 px-4 rounded-xl font-bold hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 transition-all duration-200 cursor-pointer"
                >
                  {actionLoadingId === ship.id
                    ? "REFINING..."
                    : "SECURE & CLAIM CARGO ORE"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
