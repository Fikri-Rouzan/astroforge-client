import React from "react";
import { Orbit, ShieldCheck } from "lucide-react";

export const LoadingOverlay: React.FC = () => {
  return (
    <div
      className="fixed inset-0 bg-cosmic-void z-50 flex flex-col justify-center items-center p-4 transition-colors duration-300"
      role="alert"
      aria-busy="true"
    >
      <div className="relative flex justify-center items-center mb-6">
        {/* Animated cosmic orbit background rings */}
        <Orbit className="w-24 h-24 text-cosmic-primary animate-[spin_4s_linear_infinite] opacity-40 absolute" />
        <Orbit className="w-16 h-16 text-cosmic-secondary animate-[spin_8s_linear_infinite_reverse] opacity-60 absolute" />

        {/* Loading indicator */}
        <div className="w-10 h-10 bg-cosmic-panel/40 border border-cosmic-secondary/30 rounded-xl flex items-center justify-center shadow-neon-glow">
          <ShieldCheck className="w-5 h-5 text-cyan-400 animate-pulse" />
        </div>
      </div>

      {/* Loading message */}
      <div className="text-center">
        <h3 className="font-heading text-xs tracking-widest font-bold text-slate-200 uppercase animate-pulse">
          Synchronizing Command Link
        </h3>
        <p className="font-mono text-[10px] text-gray-500 dark:text-slate-500 mt-2 tracking-wider">
          Please wait while we establish a secure connection to your cosmic
          terminal.
        </p>
      </div>
    </div>
  );
};
