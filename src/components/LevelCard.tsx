import React from "react";
import { Card } from "./Card";
import { Avatar } from "./Avatar";
import { XPBar } from "./XPBar";
import { StreakBadge } from "./StreakBadge";

interface LevelCardProps {
  level: number;
  xp: number;
  totalXp: number;
  mood: "happy" | "neutral" | "stressed" | "excited";
  budgetStreak: number;
  savingsStreak: number;
  className?: string;
}

export function LevelCard({
  level,
  xp,
  totalXp,
  mood,
  budgetStreak,
  savingsStreak,
  className = "",
}: LevelCardProps) {
  return (
    <Card className={`flex flex-col items-center text-center ${className}`}>
      <Avatar mood={mood} size="lg" className="mb-4" />
      <XPBar level={level} xp={xp} totalXp={totalXp} showLabel={true} />
      <div className="flex gap-2 mt-6">
        <StreakBadge count={budgetStreak} type="budget" />
        <StreakBadge count={savingsStreak} type="savings" />
      </div>
    </Card>
  );
}
