import React from "react";

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  variant?: "success" | "warning" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  variant = "accent",
  size = "md",
  showLabel = false,
  animated = true,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const sizes = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  const variants = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
    accent: "bg-accent-purple",
  };

  return (
    <div className={className}>
      <div className={`w-full bg-dark-border rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${variants[variant]} ${sizes[size]} rounded-full transition-all duration-500 ${
            animated ? "ease-out" : ""
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-400 mt-1">
          {Math.round(percentage)}%
        </p>
      )}
    </div>
  );
}
