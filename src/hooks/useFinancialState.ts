import { useState, useEffect } from "react";
import { useFinancialEngine } from "./useFinancialEngine";
import type { EngineInput, Transaction as EngineTransaction } from "@/engine/types";
import type { FinancialState, Transaction } from "@/types";

const initialTestTransactions: EngineTransaction[] = [
  { id: "1", date: "2025-04-15", merchant: "Starbucks Store #123", amount: 5.50, category: "Food" },
  { id: "2", date: "2025-04-14", merchant: "Uber *trip", amount: 18.75, category: "Transport" },
  { id: "3", date: "2025-04-14", merchant: "Walmart Supercenter", amount: 52.30, category: "Shopping" },
  { id: "4", date: "2025-04-13", merchant: "McDonald's #456", amount: 12.99, category: "Food" },
  { id: "5", date: "2025-04-13", merchant: "Netflix.com", amount: 15.99, category: "Subscriptions" },
  { id: "6", date: "2025-04-12", merchant: "Shell Oil #789", amount: 45.00, category: "Transport" },
  { id: "7", date: "2025-04-12", merchant: "Amazon.com", amount: 89.99, category: "Shopping" },
  { id: "8", date: "2025-04-11", merchant: "Spotify USA", amount: 11.99, category: "Subscriptions" },
  { id: "9", date: "2025-04-11", merchant: "Whole Foods Market", amount: 78.45, category: "Food" },
  { id: "10", date: "2025-04-10", merchant: "PG&E", amount: 125.00, category: "Utilities" },
  { id: "11", date: "2025-04-10", merchant: "Chipotle #234", amount: 14.50, category: "Food" },
  { id: "12", date: "2025-04-09", merchant: "Lyft ride", amount: 22.40, category: "Transport" },
  { id: "13", date: "2025-04-09", merchant: "Apple.com/bill", amount: 9.99, category: "Subscriptions" },
  { id: "14", date: "2025-04-08", merchant: "Target T-2341", amount: 65.75, category: "Shopping" },
  { id: "15", date: "2025-04-08", merchant: "Uber Eats", amount: 28.50, category: "Food" },
];

export function useFinancialState() {
  const [transactions, setTransactions] = useState<EngineTransaction[]>(initialTestTransactions);
  const [state, setState] = useState<FinancialState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const addTransaction = (newTransaction: Transaction) => {
    const engineTx: EngineTransaction = {
      id: newTransaction.id,
      date: newTransaction.date,
      merchant: newTransaction.merchant,
      amount: newTransaction.amount,
      category: (newTransaction.category.charAt(0).toUpperCase() + newTransaction.category.slice(1)) as EngineTransaction["category"],
    };
    setTransactions((prev) => [engineTx, ...prev]);
  };

  const engineInput: EngineInput = {
    user_state: {
      user_type: "student",
      monthly_income: 4500,
      name: "Alex",
    },
    transactions: transactions,
    budget: {
      weekly_limit: 1125,
      category_limits: {
        Food: 300,
        Transport: 150,
        Rent: 1200,
        Shopping: 300,
        Utilities: 100,
        Subscriptions: 100,
        Education: 50,
        Other: 100,
      },
    },
    goals: [
      {
        id: "goal1",
        type: "savings_target",
        label: "Save $5000 for emergency fund",
        target: 5000,
        current: 3200,
        deadline: "2025-12-31",
      },
      {
        id: "goal2",
        type: "no_spend_streak",
        label: "30-day no-spend challenge",
        target: 30,
      },
      {
        id: "goal3",
        type: "category_limit",
        label: "Keep shopping under $300/week",
        target: 300,
        category: "Shopping",
      },
    ],
    enable_tax_module: true,
    avatar_prev: {
      level: 5,
      xp: 67,
      streak: 12,
      overspend_count: 0,
    },
  };

  const engineOutput = useFinancialEngine(engineInput);

  useEffect(() => {
    if (engineOutput) {
      const financialState: FinancialState = {
        userId: "user123",
        transactions: engineOutput.transactions.map((t) => ({
          id: t.id,
          userId: "user123",
          amount: t.amount,
          category: t.category.toLowerCase() as any,
          merchant: t.normalized_merchant,
          description: t.merchant,
          date: t.date,
          timestamp: new Date(t.date).getTime(),
          isAnomaly: t.is_anomaly,
        })),
        budget: engineInput.budget?.category_limits
          ? Object.entries(engineInput.budget.category_limits).map(([cat, limit]) => ({
              category: cat.toLowerCase() as any,
              weeklyLimit: limit,
              monthlyLimit: limit * 4,
            }))
          : [],
        budgetStatus: engineOutput.budget_engine.category_status.map((cs) => ({
          category: cs.category.toLowerCase() as any,
          spent: cs.spent,
          limit: cs.limit,
          remaining: cs.remaining,
          percentageUsed: cs.limit > 0 ? (cs.spent / cs.limit) * 100 : 0,
          status: cs.over ? "over" : cs.spent / cs.limit > 0.75 ? "warning" : "under",
        })),
        goals: engineOutput.goals_engine.goals.map((g) => ({
          id: g.id,
          userId: "user123",
          name: g.label,
          type: g.type as any,
          targetAmount: g.type === "savings_target" ? 5000 : undefined,
          currentAmount: g.type === "savings_target" ? 3200 : undefined,
          streakDays: g.type === "no_spend_streak" ? 15 : undefined,
          targetDays: g.type === "no_spend_streak" ? 30 : undefined,
          category: g.type === "category_limit" ? "shopping" : undefined,
          startDate: "2025-01-01",
          createdAt: "2025-01-01",
          progress: g.progress_pct,
          completed: g.progress_pct === 100,
        })),
        avatar: {
          level: engineOutput.avatar_system.level,
          xp: engineOutput.avatar_system.xp,
          totalXp: engineOutput.avatar_system.level * 100 + engineOutput.avatar_system.xp,
          mood: engineOutput.avatar_system.mood as any,
          streaks: {
            budgetDays: engineOutput.avatar_system.streak,
            savingsDays: 8,
          },
          badges: ["first_transaction", "budget_master"],
        },
        spending: {
          thisWeek: engineOutput.spending_analysis.weekly_avg,
          thisMonth: engineOutput.spending_analysis.total_spend,
          dailyAverage: engineOutput.spending_analysis.daily_avg,
          trends: engineOutput.spending_analysis.by_category as any,
        },
        alerts: engineOutput.alerts.map((a) => a.message),
        recommendations: engineOutput.recommendations.map((r) => r.label),
      };
      setState(financialState);
      setIsLoading(false);
    }
  }, [engineOutput]);

  const updateGoal = (updatedGoal: import("@/types").Goal) => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        goals: prev.goals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)),
      };
    });
  };

  return { state, isLoading, addTransaction, updateGoal };
}
