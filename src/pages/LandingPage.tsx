import React from "react";
import { ShieldAlert, Orbit, Cpu, Compass, Landmark } from "lucide-react";
import { useWeb3 } from "../hooks/useWeb3";

export const LandingPage: React.FC = () => {
  const { connectWallet, isLoading } = useWeb3();

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 animate-[fadeIn_0.4s_ease-out] w-full max-w-7xl mx-auto">
      {/* Hero section */}
      <section
        className="w-full text-center my-6 md:my-12 relative flex flex-col items-center"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 top-0 flex justify-center -z-10 opacity-10 dark:opacity-20 pointer-events-none overflow-hidden">
          <Orbit className="w-64 h-64 sm:w-96 sm:h-96 text-cosmic-secondary animate-[spin_60s_linear_infinite]" />
        </div>

        <header className="max-w-2xl mx-auto mb-8 md:mb-10">
          <h2
            id="hero-heading"
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-wide text-slate-800 dark:text-white leading-tight px-2"
          >
            Forge off-chain cargo into{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cosmic-secondary to-indigo-400">
              On-Chain Wealth
            </span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-slate-400 mt-4 leading-relaxed px-4">
            Welcome to AstroForge, a next-generation decentralized space mining
            terminal. Command automated drone fleet networks, refine exotic raw
            ores, and seamlessly smelt rewards into real EVM smart contract
            token assets.
          </p>
        </header>

        {/* Connection prompt */}
        <article className="w-full max-w-md mx-auto p-5 sm:p-8 rounded-3xl border border-gray-200 bg-white dark:border-cosmic-panel dark:bg-cosmic-station shadow-neon-glow transition-all duration-300">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-cosmic-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 border border-cosmic-primary/20">
            <Orbit className="w-6 h-6 sm:w-7 sm:h-7 text-cosmic-secondary animate-pulse" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-800 dark:text-white mb-2">
            COMMENCING ORBITAL ENTRY
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-400 dark:text-slate-400 leading-relaxed mb-6 px-2">
            Access to deep-space extraction sectors requires a secure Web3
            cryptographic signature passport. Connect your command node wallet
            to synchronize.
          </p>

          <button
            onClick={() => {
              void connectWallet();
            }}
            disabled={isLoading}
            className="w-full font-heading text-xs sm:text-sm tracking-widest bg-cosmic-primary hover:bg-indigo-500 text-white py-3.5 sm:py-4 px-6 rounded-xl font-bold shadow-neon-primary hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
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

          <div className="mt-4 sm:mt-5 flex items-start gap-2.5 sm:gap-3 text-left text-[10px] sm:text-[11px] text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-cosmic-panel/40 p-3 sm:p-3.5 rounded-xl border border-gray-100 dark:border-cosmic-panel/20">
            <ShieldAlert className="w-4 h-4 text-cosmic-secondary shrink-0 mt-0.5" />
            <p className="leading-tight">
              Protected by Stateless Challenge-Response SIWE Cryptography. Your
              private master keys are never exposed to the central network node.
            </p>
          </div>
        </article>
      </section>

      {/* Features */}
      <section
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 md:mt-12 mb-10 border-t border-gray-200 dark:border-cosmic-panel/40 pt-10 md:pt-16"
        aria-label="System Capabilities"
      >
        <article className="flex gap-4 p-2 items-start">
          <div className="p-3 h-11 w-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-cosmic-primary shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-slate-200">
              Automated Drone Rigs
            </h4>
            <p className="text-xs text-gray-400 dark:text-slate-400 mt-1 leading-relaxed">
              Deploy high-yield exploration capital vessels to deep star fields
              to gather rare resources asynchronously in real-time.
            </p>
          </div>
        </article>

        <article className="flex gap-4 p-2 items-start">
          <div className="p-3 h-11 w-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cosmic-secondary shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-slate-200">
              Phaser Telemetry Grid
            </h4>
            <p className="text-xs text-gray-400 dark:text-slate-400 mt-1 leading-relaxed">
              Monitor active plasma laser extraction lines inside our highly
              responsive, hardware-accelerated 2D graphic environment.
            </p>
          </div>
        </article>

        <article className="flex gap-4 p-2 items-start">
          <div className="p-3 h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-cosmic-accent shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-slate-200">
              Decentralized Token Economy
            </h4>
            <p className="text-xs text-gray-400 dark:text-slate-400 mt-1 leading-relaxed">
              Convert raw balances directly into real tradeable ERC-20
              cryptographic tokens using verified secure admin-signed vouchers.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
};
