import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { useWeb3 } from "../hooks/useWeb3.js";
import { PHASER_CONFIG } from "../config/phaser.config.js";
import { MiningScene } from "../game/MiningScene.js";
import { Shield, Orbit } from "lucide-react";

export const AsteroidField: React.FC = () => {
  const { playerProfile } = useWeb3();
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<MiningScene | null>(null);

  useEffect(() => {
    const customMiningScene = new MiningScene();
    sceneRef.current = customMiningScene;

    const gameInstance = new Phaser.Game({
      ...PHASER_CONFIG,
      scene: [customMiningScene],
    });
    gameRef.current = gameInstance;

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        sceneRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (
      sceneRef.current &&
      playerProfile &&
      playerProfile.ships &&
      playerProfile.ships.length > 0
    ) {
      const primaryShipStatus = playerProfile.ships[0].status;
      sceneRef.current.updateMiningStatus(primaryShipStatus);
    }
  }, [playerProfile]);

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold font-heading text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <Orbit className="w-5 h-5 text-cosmic-secondary" />
          ORBITAL SECTOR TELEMETRY
        </h3>
        {playerProfile?.ships?.[0]?.status === "MINING" && (
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-md animate-pulse">
            <Shield className="w-3.5 h-3.5" />
            EXTRACTING ASSETS...
          </span>
        )}
      </div>

      <div
        id="astroforge-canvas-container"
        className="w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-cosmic-panel bg-cosmic-void shadow-inner flex justify-center items-center"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
};
