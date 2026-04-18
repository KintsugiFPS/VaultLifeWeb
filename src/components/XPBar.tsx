import React from "react";
import { ProgressBar } from "./ProgressBar";

interface XPBarProps {
  level: number;
  xp: number; // 0-100 per level
  totalXp?: number;
  showLabel?: boolean;
  className?: string;
}

export function XPBar({
  level,
  xp,
  totalXp,
  className = "",
}: XPBarProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-300">Level {level}</p>
          {totalXp !== undefined && (
            <p className="text-xs text-gray-500">{totalXp} Total XP</p>
          )}
        </div>
        <p className="text-sm font-semibold text-accent-light">{xp}/100 XP</p>
      </div>
      <ProgressBar
        value={xp}
        max={100}
        variant="accent"
        size="md"
        showLabel={false}
        animated={true}
      />
    </div>
  );
}
