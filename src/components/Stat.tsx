import React from "react";

interface StatProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  className?: string;
}

export function Stat({
  label,
  value,
  subtext,
  icon,
  trend,
  className = "",
}: StatProps) {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      {icon && <div className="text-2xl">{icon}</div>}
      <div className="flex-1">
        <p className="text-gray-400 text-sm mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <span
              className={`text-xs font-medium ${
                trend.direction === "up" ? "text-green-400" : "text-red-400"
              }`}
            >
              {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
      </div>
    </div>
  );
}
