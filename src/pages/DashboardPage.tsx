import React from "react";
import { Coins, Flame, Gem } from "lucide-react";
import { ResourceCard } from "../wrappers/ResourceCard.js";
import { AsteroidField } from "../components/AsteroidField.js";
import { HangarDashboard } from "../components/HangarDashboard.js";
import { SpaceportPanel } from "../components/SpaceportPanel.js";
import { useWeb3 } from "../hooks/useWeb3.js";
import { useLiveTelemetry } from "../hooks/useLiveTelemetry.js";

export const DashboardPage: React.FC = () => {
  const { playerProfile } = useWeb3();
  const { totalLiveIronOre } = useLiveTelemetry(playerProfile);

  if (!playerProfile) return null;

  return (
    <main className="max-w-7xl w-full mx-auto p-4 md:p-8 mt-4 flex-1 flex flex-col animate-[fadeIn_0.4s_ease-out]">
      {/* Header */}
      <section className="mb-6" aria-labelledby="dashboard-title">
        <h2
          id="dashboard-title"
          className="text-xl md:text-2xl font-bold font-heading text-cosmic-secondary tracking-wide uppercase"
        >
          COMMAND STATION PANEL
        </h2>
        <p className="text-xs md:text-sm text-gray-400 dark:text-slate-400 mt-1">
          Telemetry terminal operational. Synchronized with core automated
          refinery node systems.
        </p>
      </section>

      {/* Resource cards */}
      <section
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        aria-label="Financial Logs"
      >
        <ResourceCard
          label="IRON ORE Payload"
          displayValue={totalLiveIronOre.toFixed(2)}
          unit="KG"
          icon={Coins}
          iconColorClass="text-cosmic-primary"
        />
        <ResourceCard
          label="FUEL SUPPLY"
          displayValue={`${playerProfile.fuel}%`}
          icon={Flame}
          iconColorClass="text-cosmic-secondary"
        />
        <ResourceCard
          label="PLATINUM REVENUE"
          displayValue={playerProfile.platinum.toString()}
          icon={Gem}
          iconColorClass="text-cosmic-accent"
        />
      </section>

      {/* Canvas */}
      <section aria-label="Orbital Canvas Telemetry">
        <AsteroidField />
      </section>

      {/* Ship hangar */}
      <section aria-label="Ship Hangar Deck">
        <HangarDashboard />
      </section>

      {/* Refinery terminals */}
      <section aria-label="Refinery Terminals">
        <SpaceportPanel />
      </section>
    </main>
  );
};
