import React, { useState } from "react";
import { Rocket, LogOut, Sun, Moon, Menu } from "lucide-react";
import { useWeb3 } from "../hooks/useWeb3.js";
import { MobileDrawer } from "../wrappers/MobileDrawer.js";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  const { walletAddress, disconnectWallet } = useWeb3();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="border-b border-gray-200 bg-white/80 dark:border-cosmic-panel dark:bg-cosmic-station/80 backdrop-blur-md sticky top-0 z-40 p-4 transition-colors duration-300 w-full">
        <nav
          className="max-w-7xl mx-auto flex justify-between items-center"
          aria-label="Global tracking link"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Rocket className="w-6 h-6 text-cosmic-secondary animate-pulse" />
            <span className="text-xl font-bold bg-linear-to-r from-cosmic-light-text to-cosmic-primary dark:from-white dark:to-cosmic-secondary bg-clip-text text-transparent select-none font-heading">
              ASTROFORGE
            </span>
          </div>

          {/* Desktop controls */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-gray-300 hover:bg-gray-100 dark:border-cosmic-panel dark:hover:bg-cosmic-panel text-cosmic-light-text dark:text-slate-300 transition-all duration-200 cursor-pointer"
              aria-label="Toggle structural display theme"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-cosmic-accent" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-950" />
              )}
            </button>

            {walletAddress && (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-cosmic-panel/70 pl-4 pr-2 py-1.5 rounded-xl border border-gray-200 dark:border-cosmic-panel">
                <span className="text-xs font-heading tracking-wider text-cosmic-light-text dark:text-cyan-400">
                  {formatAddress(walletAddress)}
                </span>
                <button
                  onClick={disconnectWallet}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors cursor-pointer"
                  title="Disconnect Node Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile drawer trigger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl border border-gray-300 dark:border-cosmic-panel text-cosmic-light-text dark:text-slate-300 cursor-pointer"
              aria-label="Open system configuration drawer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        walletAddress={walletAddress}
        onDisconnect={handleDisconnect}
        formatAddress={formatAddress}
      />
    </>
  );
};
