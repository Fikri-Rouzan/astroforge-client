import React from "react";
import { ShieldAlert, Orbit } from "lucide-react";
import { useWeb3 } from "../context/Web3Context.js";

export const LoginScreen: React.FC = () => {
  const { connectWallet, isLoading } = useWeb3();

  return (
    <div className="min-h-[calc(screen-100px)] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center relative">
        <div className="absolute inset-0 -top-20 flex justify-center -z-10 opacity-20 dark:opacity-30 pointer-events-none">
          <Orbit className="w-72 h-72 text-cosmic-secondary animate-[spin_40s_linear_infinite]" />
        </div>

        <div className="p-8 rounded-3xl border border-gray-200 bg-white dark:border-cosmic-panel dark:bg-cosmic-station shadow-neon-glow transition-all duration-300">
          <div className="w-16 h-16 bg-cosmic-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-cosmic-primary/20">
            <Orbit className="w-8 h-8 text-cosmic-secondary animate-pulse" />
          </div>

          <h2 className="text-2xl font-bold font-heading tracking-wide mb-3 text-cosmic-light-text dark:text-white">
            COMMENCING ORBITAL ENTRY
          </h2>

          <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-8">
            Access to the AstroForge automated mining rigs requires a valid
            dynamic Web3 cryptographic signature passport. Connect your command
            node wallet to establish terminal synchronization.
          </p>

          {/* Web3 action call trigger */}
          <button
            onClick={() => {
              void connectWallet();
            }}
            disabled={isLoading}
            className="w-full font-heading text-sm tracking-widest bg-cosmic-primary hover:bg-indigo-500 text-white py-4 px-6 rounded-xl font-bold shadow-neon-primary hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>SIGNING CHALLENGE...</span>
              </div>
            ) : (
              "CONNECT COMMAND WALLET"
            )}
          </button>

          <div className="mt-6 flex items-center gap-2 justify-center text-xs text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-cosmic-panel/40 p-3 rounded-xl border border-gray-100 dark:border-cosmic-panel/20">
            <ShieldAlert className="w-4 h-4 text-cosmic-secondary shrink-0" />
            <span className="text-left leading-tight">
              Protected by Stateless Challenge-Response SIWE Cryptography. Your
              private keys are never exposed.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
