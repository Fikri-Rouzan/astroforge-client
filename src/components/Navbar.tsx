import React, { useState } from "react";
import { Rocket, LogOut, Sun, Moon, Menu, X, Wallet } from "lucide-react";
import { useWeb3 } from "../context/Web3Context.js";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  const { walletAddress, disconnectWallet } = useWeb3();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Helper function to truncate long EVM wallet addresses
  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 dark:border-cosmic-panel dark:bg-cosmic-station/80 backdrop-blur-md sticky top-0 z-40 p-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <Rocket className="w-6 h-6 text-cosmic-secondary animate-pulse" />
            <h1 className="text-xl font-bold bg-linear-to-r from-cosmic-light-text to-cosmic-primary dark:from-white dark:to-cosmic-secondary bg-clip-text text-transparent select-none">
              ASTROFORGE
            </h1>
          </div>

          {/* Desktop controls */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-gray-300 hover:bg-gray-100 dark:border-cosmic-panel dark:hover:bg-cosmic-panel text-cosmic-light-text dark:text-slate-300 transition-all duration-200 cursor-pointer"
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

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl border border-gray-300 dark:border-cosmic-panel text-cosmic-light-text dark:text-slate-300 cursor-pointer"
              aria-label="Open navigation system"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity duration-300 md:hidden ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Mobile sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 max-w-[80vw] bg-white dark:bg-cosmic-station border-l border-gray-200 dark:border-cosmic-panel z-55 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) md:hidden ${
          isSidebarOpen ? "translate-x-0 shadow-neon-glow" : "translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div>
          <div className="flex justify-between items-center pb-6 border-b border-gray-100 dark:border-cosmic-panel/60">
            <span className="font-heading text-xs font-bold tracking-widest text-gray-400">
              COMMAND DRAWER
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-xl border border-gray-200 dark:border-cosmic-panel text-gray-500 dark:text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* System configuration */}
          <div className="mt-8 flex flex-col gap-4">
            <label className="text-[10px] font-heading text-gray-400 dark:text-slate-500 tracking-wider">
              SYSTEM CONFIG
            </label>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-cosmic-panel hover:bg-gray-50 dark:hover:bg-cosmic-panel/40 text-sm transition-colors cursor-pointer"
            >
              <span className="text-cosmic-light-text dark:text-slate-300">
                Display Theme
              </span>
              {darkMode ? (
                <div className="flex items-center gap-1 text-cosmic-accent">
                  <Sun className="w-4 h-4" />{" "}
                  <span className="text-xs">Dark</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-indigo-950">
                  <Moon className="w-4 h-4" />{" "}
                  <span className="text-xs">Light</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Wallet controls */}
        <div className="pt-6 border-t border-gray-100 dark:border-cosmic-panel/60">
          {walletAddress ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-cosmic-panel/40 border border-gray-100 dark:border-cosmic-panel/20 rounded-xl">
                <Wallet className="w-5 h-5 text-cosmic-secondary shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[10px] text-gray-400 font-heading block">
                    NODE ADDRESS
                  </span>
                  <span className="text-xs font-mono font-bold block text-cosmic-light-text dark:text-cyan-400 truncate">
                    {formatAddress(walletAddress)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center justify-center gap-2 font-heading text-xs tracking-wider bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white py-3 px-4 rounded-xl border border-rose-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                TERMINATE SESSION
              </button>
            </div>
          ) : (
            <div className="text-center p-4 bg-gray-50 dark:bg-cosmic-panel/20 rounded-xl border border-dashed border-gray-200 dark:border-cosmic-panel/40">
              <span className="text-xs text-gray-400 font-medium">
                Terminal Offline
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
