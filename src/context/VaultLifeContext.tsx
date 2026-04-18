"use client";

import React, { createContext, useContext } from "react";
import { useFinancialState } from "@/hooks/useFinancialState";
import type { FinancialState, AvatarState, Transaction, Goal } from "@/types";

interface VaultLifeContextType {
  financial: FinancialState | null;
  isLoading: boolean;
  avatar: AvatarState;
  addXP: (amount: number) => void;
  incrementStreak: (type: "budget" | "savings") => void;
  addTransaction: (transaction: Transaction) => void;
  updateGoal: (goal: Goal) => void;
}

const VaultLifeContext = createContext<VaultLifeContextType | undefined>(
  undefined
);

export function VaultLifeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state: financial, isLoading, addTransaction, updateGoal } = useFinancialState();

  const value: VaultLifeContextType = {
    financial,
    isLoading,
    avatar: financial?.avatar || {
      level: 1,
      xp: 0,
      totalXp: 0,
      mood: "neutral",
      streaks: {
        budgetDays: 0,
        savingsDays: 0,
      },
      badges: [],
    },
    addXP: () => {},
    incrementStreak: () => {},
    addTransaction,
    updateGoal,
  };

  return (
    <VaultLifeContext.Provider value={value}>
      {children}
    </VaultLifeContext.Provider>
  );
}

export function useVaultLife() {
  const context = useContext(VaultLifeContext);
  if (!context) {
    throw new Error("useVaultLife must be used within VaultLifeProvider");
  }
  return context;
}
