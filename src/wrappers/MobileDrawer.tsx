import React from "react";
import { X, Sun, Moon, Wallet, LogOut } from "lucide-react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  walletAddress: string | null;
  onDisconnect: () => void;
  formatAddress: (address: string) => string;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  darkMode,
  setDarkMode,
  walletAddress,
  onDisconnect,
  formatAddress,
}) => {
  return (
    <>
      {/* Background backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity duration-300 md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 max-w-[80vw] bg-white dark:bg-cosmic-station border-l border-gray-200 dark:border-cosmic-panel z-55 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0 shadow-neon-glow" : "translate-x-full"
        }`}
      >
        {/* Drawer content */}
        <div>
          <div className="flex justify-between items-center pb-6 border-b border-gray-100 dark:border-cosmic-panel/60">
            <span className="font-heading text-xs font-bold tracking-widest text-gray-400">
              COMMAND DRAWER
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-gray-200 dark:border-cosmic-panel text-gray-500 dark:text-slate-400 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* System configuration */}
          <div className="mt-8 flex flex-col gap-4">
            <label className="text-[10px] font-heading text-gray-400 dark:text-slate-500 tracking-wider uppercase">
              System Config
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

        {/* Wallet connection */}
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
                onClick={onDisconnect}
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
