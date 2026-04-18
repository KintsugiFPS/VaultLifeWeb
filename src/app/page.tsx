"use client";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { Stat } from "@/components/Stat";
import { LevelCard } from "@/components/LevelCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Badge } from "@/components/Badge";
import { useVaultLife } from "@/context/VaultLifeContext";

export default function DashboardPage() {
  const { financial, isLoading, avatar } = useVaultLife();

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="p-8 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-dark-card rounded-lg w-1/3"></div>
            <div className="h-64 bg-dark-card rounded-lg"></div>
          </div>
        </div>
      </>
    );
  }

  if (!financial) {
    return (
      <>
        <Navbar />
        <div className="p-8 max-w-7xl mx-auto">
          <p className="text-gray-400">Error loading financial data</p>
        </div>
      </>
    );
  }

  const weeklyBudgetTotal = financial.budget.reduce(
    (sum, b) => sum + b.weeklyLimit,
    0
  );
  const weeklySpent = financial.spending.thisWeek;
  const weeklyRemaining = weeklyBudgetTotal - weeklySpent;
  const weeklyPercentage = (weeklySpent / weeklyBudgetTotal) * 100;

  return (
    <>
      <Navbar />
      <main className="w-full pb-12">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div>
            <SectionHeader
              title="Dashboard"
              subtitle={new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            />
          </div>

          {/* Avatar & Level Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LevelCard
              level={avatar.level}
              xp={avatar.xp}
              totalXp={avatar.totalXp}
              mood={avatar.mood}
              budgetStreak={avatar.streaks.budgetDays}
              savingsStreak={avatar.streaks.savingsDays}
              className="md:col-span-2"
            />

            {/* Quick Stats */}
            <Card className="flex flex-col justify-between">
              <div className="space-y-4">
                <Stat
                  label="Net Worth"
                  value="$12,450"
                  icon="💎"
                  trend={{ value: 8, direction: "up" }}
                />
                <Stat
                  label="Savings Rate"
                  value="32%"
                  icon="📈"
                  trend={{ value: 5, direction: "up" }}
                />
              </div>
            </Card>
          </div>

          {/* Weekly Budget Status */}
          <Card>
            <SectionHeader
              title="Weekly Budget Status"
              subtitle={`${weeklyPercentage.toFixed(1)}% of budget used`}
            />
            <div className="space-y-2 mb-4">
              <ProgressBar
                value={weeklySpent}
                max={weeklyBudgetTotal}
                variant={
                  weeklyPercentage > 90
                    ? "danger"
                    : weeklyPercentage > 75
                      ? "warning"
                      : "success"
                }
                showLabel={false}
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>
                  ${weeklySpent.toFixed(2)} of ${weeklyBudgetTotal.toFixed(2)}
                </span>
                <span className="text-accent-light font-semibold">
                  ${weeklyRemaining.toFixed(2)} remaining
                </span>
              </div>
            </div>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <SectionHeader title="Category Breakdown" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {financial.budgetStatus.slice(0, 4).map((budget) => (
                <div key={budget.category}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium capitalize">
                      {budget.category}
                    </span>
                    <Badge
                      variant={
                        budget.status === "under"
                          ? "success"
                          : budget.status === "warning"
                            ? "warning"
                            : "danger"
                      }
                      size="sm"
                    >
                      {budget.percentageUsed}%
                    </Badge>
                  </div>
                  <ProgressBar
                    value={budget.spent}
                    max={budget.limit}
                    variant={
                      budget.status === "under"
                        ? "success"
                        : budget.status === "warning"
                          ? "warning"
                          : "danger"
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ${budget.spent.toFixed(2)} of ${budget.limit.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Alerts */}
          {financial.alerts.length > 0 && (
            <Card className="border-yellow-500/30 bg-yellow-500/5">
              <SectionHeader title="Alerts" />
              <div className="space-y-2">
                {financial.alerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-3 p-2">
                    <span className="text-yellow-400">⚠️</span>
                    <p className="text-sm text-gray-300">{alert}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recent Transactions */}
          <Card>
            <SectionHeader title="Recent Transactions" />
            <div className="space-y-3">
              {financial.transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-dark-border/20 hover:bg-dark-border/40 transition-smooth"
                >
                  <div className="flex-1">
                    <p className="font-medium">{transaction.merchant}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {transaction.category}
                    </p>
                  </div>
                  <p className="font-semibold text-accent-light">
                    ${transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
