import React from "react";
import { Badge } from "./Badge";

interface StreakBadgeProps {
  count: number;
  type?: "budget" | "savings" | "generic";
  className?: string;
}

const typeConfig = {
  budget: { emoji: "💰", label: "Budget Streak" },
  savings: { emoji: "📈", label: "Savings Streak" },
  generic: { emoji: "🔥", label: "Streak" },
};

export function StreakBadge({
  count,
  type = "generic",
  className = "",
}: StreakBadgeProps) {
  const config = typeConfig[type];

  return (
    <Badge variant="success" size="md" className={className}>
      <span className="text-lg mr-1">{config.emoji}</span>
      <span className="font-bold">{count}</span>
      <span className="ml-1 text-xs opacity-80">day{count !== 1 ? "s" : ""}</span>
    </Badge>
  );
}
