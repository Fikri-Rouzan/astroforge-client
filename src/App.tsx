import { useState } from "react";
import { Navbar } from "./components/Navbar.js";
import { LoginScreen } from "./components/LoginScreen.js";
import { useWeb3 } from "./context/Web3Context.js";
import { Coins, Flame, Gem } from "lucide-react";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const { walletAddress, playerProfile } = useWeb3();

  return (
    <div
      className={`${darkMode ? "dark bg-cosmic-void text-slate-100" : "bg-cosmic-light-bg text-cosmic-light-text"} min-h-screen transition-colors duration-300 font-body`}
    >
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main content area */}
      {!walletAddress || !playerProfile ? (
        <LoginScreen />
      ) : (
        <main className="max-w-7xl mx-auto p-4 md:p-8 mt-4 animate-[fadeIn_0.5s_ease-out]">
          {/* Welcome banner */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold font-heading text-cosmic-secondary">
              COMMAND STATION PANEL
            </h2>
            <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Telemetry links active. Monitoring automated refinery systems and
              hangar telemetry modules.
            </p>
          </div>

          {/* Telemetry resources view */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Resource iron ore */}
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-cosmic-panel bg-white dark:bg-cosmic-station shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 dark:text-slate-500 font-heading tracking-wider block">
                  IRON ORE
                </span>
                <span className="text-2xl font-bold font-heading text-slate-700 dark:text-white mt-1 block">
                  {playerProfile.ironOre}
                </span>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-cosmic-primary">
                <Coins className="w-6 h-6" />
              </div>
            </div>

            {/* Resource fuel */}
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

            {/* Resource platinum */}
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

          {/* Placeholder */}
          <div className="p-12 rounded-3xl border border-dashed border-gray-300 dark:border-cosmic-panel text-center text-gray-400 dark:text-slate-500">
            Hangar control panel deployment pending next module updates...
          </div>
        </main>
      )}
    </div>
  );
}
