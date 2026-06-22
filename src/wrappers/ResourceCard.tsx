import React from "react";
import { type LucideIcon } from "lucide-react";

interface ResourceCardProps {
  label: string;
  displayValue: string;
  unit?: string;
  icon: LucideIcon;
  iconColorClass: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  label,
  displayValue,
  unit,
  icon: IconComponent,
  iconColorClass,
}) => {
  return (
    <div className="p-5 rounded-2xl border border-gray-200 dark:border-cosmic-panel bg-white dark:bg-cosmic-station shadow-sm flex items-center justify-between">
      <div>
        <span className="text-xs text-gray-400 dark:text-slate-500 font-heading tracking-wider block uppercase">
          {label}
        </span>
        <span className="text-2xl font-bold font-heading text-slate-700 dark:text-white mt-1 block">
          {displayValue}{" "}
          {unit && (
            <span className="text-xs text-gray-400 dark:text-slate-500 font-mono">
              {unit}
            </span>
          )}
        </span>
      </div>
      <div
        className={`p-3 bg-gray-50 dark:bg-cosmic-panel/40 rounded-xl border border-gray-100 dark:border-cosmic-panel/20 ${iconColorClass}`}
      >
        <IconComponent className="w-6 h-6" />
      </div>
    </div>
  );
};
