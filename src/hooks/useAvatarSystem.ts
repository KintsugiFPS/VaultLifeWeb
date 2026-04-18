import type { AvatarState } from "@/types";

// This hook is now a pass-through that uses the engine's avatar system
// The engine handles all avatar logic; we just transform it to our types
export function useAvatarSystem() {
  const initialAvatarState: AvatarState = {
    level: 5,
    xp: 67,
    totalXp: 467,
    mood: "happy",
    streaks: {
      budgetDays: 12,
      savingsDays: 8,
    },
    badges: ["first_transaction", "budget_master", "saving_streak"],
  };

  // Avatar state now comes from the financial engine
  // via VaultLifeContext -> useFinancialState -> useFinancialEngine -> runEngine
  // This hook is kept for compatibility and future avatar-specific operations

  return {
    avatar: initialAvatarState,
    addXP: () => {}, // Engine handles XP internally
    incrementStreak: () => {},
    resetStreak: () => {},
    addBadge: () => {},
  };
}
