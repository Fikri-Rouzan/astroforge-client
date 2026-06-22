import { useState } from "react";
import { Navbar } from "./components/Navbar.js";
import { LoginScreen } from "./components/LoginScreen.js";
import { ResourceGrid } from "./components/ResourceGrid.js";
import { HangarDashboard } from "./components/HangarDashboard.js";
import { SpaceportPanel } from "./components/SpaceportPanel.js";
import { AsteroidField } from "./components/AsteroidField.js";
import { useWeb3 } from "./hooks/useWeb3.js";
import { useLiveTelemetry } from "./hooks/useLiveTelemetry.js";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const { walletAddress, playerProfile } = useWeb3();

  // live tracking calculation directly at the orchestration level
  const { totalLiveIronOre } = useLiveTelemetry(playerProfile);

  return (
    <div
      className={`${darkMode ? "dark bg-cosmic-void text-slate-100" : "bg-cosmic-light-bg text-cosmic-light-text"} min-h-screen transition-colors duration-300 font-body`}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          className: darkMode
            ? "!bg-cosmic-station !text-slate-100 !border !border-cosmic-panel !font-body !text-sm"
            : "!font-body !text-sm",
          duration: 4000,
        }}
      />

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {!walletAddress || !playerProfile ? (
        <LoginScreen />
      ) : (
        <main className="max-w-7xl mx-auto p-4 md:p-8 mt-4 animate-[fadeIn_0.5s_ease-out]">
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold font-heading text-cosmic-secondary">
              COMMAND STATION PANEL
            </h2>
            <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Telemetry links active. Monitoring automated refinery systems and
              hangar telemetry modules.
            </p>
          </div>

          <ResourceGrid
            playerProfile={playerProfile}
            totalLiveIronOre={totalLiveIronOre}
          />

          <AsteroidField />

          <HangarDashboard />

          <SpaceportPanel />
        </main>
      )}
    </div>
  );
}
