"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { Badge } from "@/components/Badge";
import { useVaultLife } from "@/context/VaultLifeContext";
import type { Goal } from "@/types";

export default function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { financial, isLoading, updateGoal } = useVaultLife();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Goal>>({});

  if (isLoading || !financial) {
    return (
      <>
        <Navbar />
        <div className="p-8">Loading...</div>
      </>
    );
  }

  const goal = financial.goals.find((g) => g.id === id);

  if (!goal) {
    return (
      <>
        <Navbar />
        <div className="p-8">Goal not found</div>
      </>
    );
  }

  const openEdit = () => {
    setEditForm({ ...goal });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateGoal({ ...goal, ...editForm });
    setIsEditing(false);
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case "savings_target": return "🎯";
      case "no_spend_streak": return "🔥";
      case "category_limit": return "📊";
      default: return "⭐";
    }
  };

  return (
    <>
      <Navbar />
      <main className="w-full pb-12">
        <div className="p-8 max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-dark-border/30 rounded-lg transition-smooth"
            >
              ← Back
            </button>
            <SectionHeader title={goal.name} subtitle={goal.type.replace(/_/g, " ")} />
          </div>

          {/* Goal Overview */}
          <Card>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{getGoalIcon(goal.type)}</span>
                <div>
                  <h2 className="text-2xl font-bold">{goal.name}</h2>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="info">{goal.type.replace(/_/g, " ")}</Badge>
                    {goal.completed && <Badge variant="success">✓ Completed</Badge>}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Overall Progress</span>
                <span className="text-2xl font-bold text-accent-light">{goal.progress}%</span>
              </div>
              <ProgressBar
                value={goal.progress}
                max={100}
                variant={goal.progress === 100 ? "success" : goal.progress >= 75 ? "warning" : "accent"}
                showLabel={false}
              />
            </div>
          </Card>

          {/* Goal-specific details */}
          {goal.type === "savings_target" && (
            <Card>
              <SectionHeader title="Savings Details" />
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-border/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Current Savings</p>
                    <p className="text-3xl font-bold text-green-400">${goal.currentAmount?.toFixed(2) || "0.00"}</p>
                  </div>
                  <div className="bg-dark-border/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Target Amount</p>
                    <p className="text-3xl font-bold text-accent-light">${goal.targetAmount?.toFixed(2) || "0.00"}</p>
                  </div>
                </div>
                <div className="bg-dark-border/20 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Amount Remaining</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    ${((goal.targetAmount || 0) - (goal.currentAmount || 0)).toFixed(2)}
                  </p>
                </div>
                <div className="bg-dark-border/20 rounded-lg p-3">
                  <p className="text-white">Started: <span className="font-semibold">{goal.startDate}</span></p>
                </div>
                <div className="bg-accent-purple/10 border border-accent-purple/30 rounded-lg p-4">
                  <p className="text-accent-light font-semibold mb-2">💡 Tips</p>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Set up automatic transfers to reach your goal faster</li>
                    <li>• Track your savings progress weekly</li>
                    <li>• Consider high-yield savings accounts for better returns</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {goal.type === "no_spend_streak" && (
            <Card>
              <SectionHeader title="No-Spend Challenge" />
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-border/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Current Streak</p>
                    <p className="text-3xl font-bold text-orange-400">{goal.streakDays || 0} days</p>
                  </div>
                  <div className="bg-dark-border/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Target Streak</p>
                    <p className="text-3xl font-bold text-accent-light">{goal.targetDays || 0} days</p>
                  </div>
                </div>
                <div className="bg-dark-border/20 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Days Remaining</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {Math.max(0, (goal.targetDays || 0) - (goal.streakDays || 0))} days
                  </p>
                </div>
                <div className="bg-accent-purple/10 border border-accent-purple/30 rounded-lg p-4">
                  <p className="text-accent-light font-semibold mb-2">🔥 Keep the Streak Alive!</p>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Avoid all discretionary spending</li>
                    <li>• Plan meals at home instead of eating out</li>
                    <li>• Use this as an opportunity to evaluate your spending habits</li>
                    <li>• Celebrate milestones to stay motivated</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {goal.type === "category_limit" && (
            <Card>
              <SectionHeader title={`${goal.category} Category Limit`} />
              <div className="space-y-6">
                <div className="bg-dark-border/20 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Weekly Limit</p>
                  <p className="text-3xl font-bold text-accent-light">
                    ${financial.budget.find((b) => b.category === goal.category)?.weeklyLimit.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="space-y-3">
                  {financial.budgetStatus
                    .filter((bs) => bs.category === goal.category)
                    .map((status) => (
                      <div key={status.category}>
                        <div className="flex justify-between mb-2">
                          <span className="capitalize">{status.category}</span>
                          <span className="font-semibold">${status.spent.toFixed(2)}</span>
                        </div>
                        <ProgressBar
                          value={status.spent}
                          max={status.limit}
                          variant={status.status === "under" ? "accent" : status.status === "over" ? "danger" : "warning"}
                          showLabel={false}
                        />
                        <p className="text-xs text-gray-400 mt-1">${status.remaining.toFixed(2)} remaining</p>
                      </div>
                    ))}
                </div>
                <div className="bg-accent-purple/10 border border-accent-purple/30 rounded-lg p-4">
                  <p className="text-accent-light font-semibold mb-2">💳 Budget Tips</p>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Set alerts when you reach 75% of your limit</li>
                    <li>• Log transactions immediately to stay aware</li>
                    <li>• Look for alternatives to reduce spending in this category</li>
                    <li>• Review weekly to adjust future budgets</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* Edit Form */}
          {isEditing && (
            <Card className="border-accent-purple/40 bg-accent-purple/5">
              <SectionHeader title="Edit Goal" />
              <div className="space-y-5 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Goal Name</label>
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark-border/30 border border-dark-border/50 rounded-lg text-gray-200 focus:outline-none focus:border-accent-purple/50"
                  />
                </div>

                {goal.type === "savings_target" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Current Savings ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editForm.currentAmount?.toString() ?? ""}
                        onChange={(e) => setEditForm((p) => ({ ...p, currentAmount: e.target.value === "" ? undefined : parseFloat(e.target.value) }))}
                        className="w-full px-4 py-2 bg-dark-border/30 border border-dark-border/50 rounded-lg text-gray-200 focus:outline-none focus:border-accent-purple/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Target Amount ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editForm.targetAmount?.toString() ?? ""}
                        onChange={(e) => setEditForm((p) => ({ ...p, targetAmount: e.target.value === "" ? undefined : parseFloat(e.target.value) }))}
                        className="w-full px-4 py-2 bg-dark-border/30 border border-dark-border/50 rounded-lg text-gray-200 focus:outline-none focus:border-accent-purple/50"
                      />
                    </div>
                  </>
                )}

                {goal.type === "no_spend_streak" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Current Streak (days)</label>
                      <input
                        type="number"
                        min="0"
                        value={editForm.streakDays?.toString() ?? ""}
                        onChange={(e) => setEditForm((p) => ({ ...p, streakDays: e.target.value === "" ? undefined : parseInt(e.target.value) }))}
                        className="w-full px-4 py-2 bg-dark-border/30 border border-dark-border/50 rounded-lg text-gray-200 focus:outline-none focus:border-accent-purple/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Target Streak (days)</label>
                      <input
                        type="number"
                        min="1"
                        value={editForm.targetDays?.toString() ?? ""}
                        onChange={(e) => setEditForm((p) => ({ ...p, targetDays: e.target.value === "" ? undefined : parseInt(e.target.value) }))}
                        className="w-full px-4 py-2 bg-dark-border/30 border border-dark-border/50 rounded-lg text-gray-200 focus:outline-none focus:border-accent-purple/50"
                      />
                    </div>
                  </>
                )}

                {goal.type === "category_limit" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <select
                      value={editForm.category || ""}
                      onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value as any }))}
                      className="w-full px-4 py-2 bg-dark-border/30 border border-dark-border/50 rounded-lg text-gray-200 focus:outline-none focus:border-accent-purple/50"
                    >
                      {["food", "transport", "rent", "shopping", "utilities", "subscriptions", "education", "other"].map((cat) => (
                        <option key={cat} value={cat} className="bg-gray-900 capitalize">{cat}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-2 bg-accent-purple hover:bg-accent-light text-white rounded-lg font-medium transition-smooth"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-6 py-2 bg-dark-border/30 hover:bg-dark-border/50 text-gray-300 rounded-lg font-medium transition-smooth"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-dark-border/30 hover:bg-dark-border/50 text-gray-300 rounded-lg font-medium transition-smooth"
            >
              Back to Goals
            </button>
            <button
              onClick={openEdit}
              className="flex-1 px-6 py-3 bg-accent-purple hover:bg-accent-light text-white rounded-lg font-medium transition-smooth"
            >
              {isEditing ? "Editing..." : "Edit Goal"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
