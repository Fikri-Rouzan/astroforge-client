import { useState, useEffect } from "react";
import type { PlayerProfile } from "../types/type.js";

export const useLiveTelemetry = (playerProfile: PlayerProfile | null) => {
  const [livePendingOre, setLivePendingOre] = useState<Record<number, number>>(
    {},
  );

  useEffect(() => {
    if (
      !playerProfile ||
      !playerProfile.ships ||
      playerProfile.ships.length === 0
    ) {
      const timer = setTimeout(() => {
        setLivePendingOre({});
      }, 0);
      return () => clearTimeout(timer);
    }

    // Centralized ticker loop executing every 1 second
    const ticker = setInterval(() => {
      const currentPendingMap: Record<number, number> = {};

      playerProfile.ships?.forEach((ship) => {
        if (ship.status === "MINING" && ship.lastLaunchTime) {
          const startTime = new Date(ship.lastLaunchTime).getTime();
          const nowTime = Date.now();
          const elapsedSeconds = Math.floor((nowTime - startTime) / 1000);

          if (elapsedSeconds > 0) {
            const calculatedOre =
              elapsedSeconds * Number(ship.miningRatePerSecond);
            const cappedOre = Math.min(calculatedOre, Number(ship.maxCargo));
            currentPendingMap[ship.id] = cappedOre;
          } else {
            currentPendingMap[ship.id] = 0;
          }
        } else {
          currentPendingMap[ship.id] = 0;
        }
      });

      setLivePendingOre(currentPendingMap);
    }, 1000);

    return () => clearInterval(ticker);
  }, [playerProfile]);

  const totalPendingAmount = Object.values(livePendingOre).reduce(
    (acc, val) => acc + val,
    0,
  );
  const totalLiveIronOre =
    Number(playerProfile?.ironOre || 0) + totalPendingAmount;

  return { livePendingOre, totalLiveIronOre };
};
