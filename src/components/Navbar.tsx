import React from "react";
import { Rocket, LogOut, Sun, Moon } from "lucide-react";
import { useWeb3 } from "../context/Web3Context.js";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  const { walletAddress, disconnectWallet } = useWeb3();

  // Helper function to truncate long EVM wallet addresses
  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header
      className={`border-b border-gray-200 bg-white/80 dark:border-cosmic-panel dark:bg-cosmic-station/80 backdrop-blur-md sticky top-0 z-50 p-4 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand logo */}
        <div className="flex items-center gap-3">
          <Rocket className="w-6 h-6 text-cosmic-secondary animate-pulse" />
          <h1 className="text-xl font-bold bg-linear-to-r from-cosmic-light-text to-cosmic-primary dark:from-white dark:to-cosmic-secondary bg-clip-text text-transparent select-none">
            ASTROFORGE
          </h1>
        </div>

        {/* Right side control interface */}
        <div className="flex items-center gap-3">
          {/* Theme toggle button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl border border-gray-300 hover:bg-gray-100 dark:border-cosmic-panel dark:hover:bg-cosmic-panel text-cosmic-light-text dark:text-slate-300 transition-all duration-200"
            aria-label="Toggle theme mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-cosmic-accent" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-950" />
            )}
          </button>

          {/* Conditional wallet display */}
          {walletAddress && (
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-cosmic-panel pl-4 pr-2 py-1.5 rounded-xl border border-gray-200 dark:border-cosmic-panel">
              <span className="text-xs font-heading tracking-wider text-cosmic-light-text dark:text-cyan-400">
                {formatAddress(walletAddress)}
              </span>
              <button
                onClick={disconnectWallet}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors"
                title="Disconnect Space Station Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
