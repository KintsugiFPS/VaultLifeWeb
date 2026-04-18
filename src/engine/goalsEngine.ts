import {
  Goal,
  GoalsEngineOutput,
  GoalStatus,
  ProcessedTransaction,
  SpendingAnalysis,
} from './types';

export function runGoalsEngine(
  goals: Goal[] | undefined,
  analysis: SpendingAnalysis,
  transactions: ProcessedTransaction[],
): GoalsEngineOutput {
  const list = goals ?? [];
  const statuses: GoalStatus[] = list.map((g) => evaluateGoal(g, analysis, transactions));
  return {
    goals: statuses,
    on_track_count: statuses.filter((s) => s.on_track).length,
    total_count: statuses.length,
  };
}

function evaluateGoal(
  goal: Goal,
  analysis: SpendingAnalysis,
  _transactions: ProcessedTransaction[],
): GoalStatus {
  switch (goal.type) {
    case 'savings_target':
      return evaluateSavings(goal, analysis);
    case 'no_spend_streak':
      return evaluateNoSpend(goal, analysis);
    case 'category_limit':
      return evaluateCategoryLimit(goal, analysis);
  }
}

function daysUntil(deadline?: string): number | undefined {
  if (!deadline) return undefined;
  const d = new Date(deadline);
  if (isNaN(d.getTime())) return undefined;
  const diff = (d.getTime() - Date.now()) / 86400000;
  return Math.max(0, Math.round(diff));
}

function evaluateSavings(goal: Goal, analysis: SpendingAnalysis): GoalStatus {
  const current = goal.current ?? 0;
  const progress_pct = clamp((current / goal.target) * 100, 0, 100);
  const days_remaining = daysUntil(goal.deadline) ?? 30;
  const needed = Math.max(0, goal.target - current);
  const required_daily_adjustment = days_remaining > 0 ? round2(needed / days_remaining) : 0;

  const dailyFree = Math.max(0, -analysis.daily_avg + required_daily_adjustment);
  const likelihood = clamp(progress_pct / 100 + (needed <= 0 ? 0.5 : -dailyFree * 0.001), 0, 1);

  return {
    id: goal.id,
    label: goal.label,
    type: goal.type,
    progress_pct: round1(progress_pct),
    likelihood: round2(likelihood),
    required_daily_adjustment,
    on_track: progress_pct >= expectedProgress(days_remaining, goal.deadline),
    days_remaining,
  };
}

function evaluateNoSpend(goal: Goal, analysis: SpendingAnalysis): GoalStatus {
  const targetDays = goal.target;
  const recentDays = analysis.daily_series.slice(-targetDays);
  const zeroDays = recentDays.filter((d) => d.total === 0).length;
  const progress_pct = targetDays > 0 ? clamp((zeroDays / targetDays) * 100, 0, 100) : 0;
  const likelihood = clamp(zeroDays / Math.max(1, targetDays), 0, 1);
  return {
    id: goal.id,
    label: goal.label,
    type: goal.type,
    progress_pct: round1(progress_pct),
    likelihood: round2(likelihood),
    required_daily_adjustment: 0,
    on_track: zeroDays >= Math.ceil(targetDays * 0.7),
  };
}

function evaluateCategoryLimit(goal: Goal, analysis: SpendingAnalysis): GoalStatus {
  const cat = goal.category ?? 'Other';
  const spent = analysis.by_category[cat] || 0;
  const progress_pct = goal.target > 0 ? clamp((spent / goal.target) * 100, 0, 100) : 0;
  const on_track = spent <= goal.target;
  const required_daily_adjustment = round2(Math.max(0, spent - goal.target) / 7);
  const likelihood = clamp(1 - spent / (goal.target || 1), 0, 1);
  return {
    id: goal.id,
    label: goal.label,
    type: goal.type,
    progress_pct: round1(progress_pct),
    likelihood: round2(likelihood),
    required_daily_adjustment,
    on_track,
  };
}

function expectedProgress(days_remaining: number, deadline?: string): number {
  if (!deadline) return 50;
  const total = 30;
  const elapsed = Math.max(0, total - days_remaining);
  return clamp((elapsed / total) * 100, 0, 100);
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
