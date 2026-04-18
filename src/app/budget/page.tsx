"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { Badge } from "@/components/Badge";
import { useVaultLife } from "@/context/VaultLifeContext";

export default function BudgetPage() {
  const { financial, isLoading } = useVaultLife();
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");

  if (isLoading || !financial) {
    return (
      <>
        <Navbar />
        <div className="p-8">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="w-full pb-12">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div>
            <SectionHeader title="Budget Management" />
          </div>

          {/* Period Toggle */}
          <Card className="flex gap-4 w-fit">
            {(["weekly", "monthly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg capitalize font-medium transition-all ${
                  period === p
                    ? "bg-accent-purple/30 text-accent-light"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {p} Budget
              </button>
            ))}
          </Card>

          {/* Budget Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {financial.budgetStatus.map((budget) => {
              const budgetLimit =
                financial.budget.find((b) => b.category === budget.category)?.[
                  period === "weekly" ? "weeklyLimit" : "monthlyLimit"
                ] || budget.limit;

              const budgetSpent =
                period === "weekly"
                  ? budget.spent
                  : budget.spent * 4.33; // Rough monthly estimate

              const percentage = (budgetSpent / budgetLimit) * 100;

              return (
                <Card key={budget.category}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold capitalize text-lg">
                          {budget.category}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {period === "weekly" ? "Weekly" : "Monthly"} limit
                        </p>
                      </div>
                      <Badge
                        variant={
                          percentage < 50
                            ? "success"
                            : percentage < 80
                              ? "warning"
                              : "danger"
                        }
                        size="md"
                      >
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>

                    <ProgressBar
                      value={budgetSpent}
                      max={budgetLimit}
                      variant={
                        percentage < 50
                          ? "success"
                          : percentage < 80
                            ? "warning"
                            : "danger"
                      }
                      showLabel={false}
                    />

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Spent</span>
                        <span className="font-semibold">
                          ${budgetSpent.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Limit</span>
                        <span className="font-semibold">
                          ${budgetLimit.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Remaining</span>
                        <span className="font-semibold text-accent-light">
                          ${Math.max(0, budgetLimit - budgetSpent).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Budget Tips */}
          <Card className="border-accent-purple/30 bg-accent-purple/5">
            <SectionHeader title="💡 Budget Tips" />
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-accent-light">✓</span>
                <span className="text-gray-300">
                  Keep your spending below 80% of your budget to stay on track
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent-light">✓</span>
                <span className="text-gray-300">
                  Review your budget weekly to adjust for changing needs
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent-light">✓</span>
                <span className="text-gray-300">
                  Track unusual expenses to identify spending patterns
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </>
  );
}
