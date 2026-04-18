"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { Badge } from "@/components/Badge";
import { useVaultLife } from "@/context/VaultLifeContext";

export default function GoalsPage() {
  const router = useRouter();
  const { financial, isLoading } = useVaultLife();

  if (isLoading || !financial) {
    return (
      <>
        <Navbar />
        <div className="p-8">Loading...</div>
      </>
    );
  }

  const getGoalIcon = (type: string) => {
    switch (type) {
      case "savings_target":
        return "🎯";
      case "no_spend_streak":
        return "🔥";
      case "category_limit":
        return "📊";
      default:
        return "⭐";
    }
  };

  return (
    <>
      <Navbar />
      <main className="w-full pb-12">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div>
            <SectionHeader
              title="Financial Goals"
              subtitle="Track and achieve your financial milestones"
            />
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {financial.goals.map((goal) => (
              <Card key={goal.id} className="flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getGoalIcon(goal.type)}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{goal.name}</h3>
                      <Badge variant="info" size="sm">
                        {goal.type.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </div>
                  {goal.completed && (
                    <Badge variant="success" size="sm">
                      ✓ Completed
                    </Badge>
                  )}
                </div>

                <div className="space-y-3 flex-1">
                  <ProgressBar
                    value={goal.progress}
                    max={100}
                    variant={
                      goal.progress === 100
                        ? "success"
                        : goal.progress >= 75
                          ? "warning"
                          : "accent"
                    }
                    showLabel={true}
                  />

                  {goal.type === "savings_target" && (
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current</span>
                        <span className="font-semibold">
                          ${goal.currentAmount?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Target</span>
                        <span className="font-semibold text-accent-light">
                          ${goal.targetAmount?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {goal.type === "no_spend_streak" && (
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Streak</span>
                        <span className="font-semibold">
                          {goal.streakDays} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Target Streak</span>
                        <span className="font-semibold text-accent-light">
                          {goal.targetDays} days
                        </span>
                      </div>
                    </div>
                  )}

                  {goal.type === "category_limit" && (
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category</span>
                        <span className="font-semibold capitalize">
                          {goal.category}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => router.push(`/goals/${goal.id}`)}
                  className="mt-4 w-full py-2 rounded-lg bg-accent-purple/20 hover:bg-accent-purple/30 text-accent-light transition-smooth font-medium text-sm"
                >
                  View Details
                </button>
              </Card>
            ))}
          </div>

          {/* Add Goal CTA */}
          <Card className="border-accent-purple/30 bg-accent-purple/5 text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Ready for a new goal?</h3>
            <p className="text-gray-400 mb-4">
              Set specific financial goals to stay motivated and track progress
            </p>
            <button className="px-6 py-2 bg-accent-purple hover:bg-accent-light text-white rounded-lg font-medium transition-smooth">
              + Add New Goal
            </button>
          </Card>

          {/* Goal Stats */}
          <Card>
            <SectionHeader title="Goal Stats" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-accent-light">
                  {financial.goals.length}
                </p>
                <p className="text-xs text-gray-400">Active Goals</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {financial.goals.filter((g) => g.completed).length}
                </p>
                <p className="text-xs text-gray-400">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {Math.round(
                    financial.goals.reduce((sum, g) => sum + g.progress, 0) /
                      financial.goals.length
                  )}
                  %
                </p>
                <p className="text-xs text-gray-400">Avg Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">
                  $
                  {financial.goals
                    .reduce((sum, g) => sum + (g.currentAmount || 0), 0)
                    .toFixed(0)}
                </p>
                <p className="text-xs text-gray-400">Total Saved</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
