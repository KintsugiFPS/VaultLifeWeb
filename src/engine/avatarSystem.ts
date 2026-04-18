import {
  AvatarSnapshot,
  AvatarSystem,
  BudgetEngineOutput,
  GoalsEngineOutput,
  MoodState,
} from './types';

export function runAvatarSystem(
  prev: AvatarSnapshot | undefined,
  budget: BudgetEngineOutput,
  goals: GoalsEngineOutput,
): AvatarSystem {
  const base: AvatarSnapshot = prev ?? { level: 1, xp: 0, streak: 0, overspend_count: 0 };
  let { level, xp, streak } = base;
  let overspend_count = base.overspend_count ?? 0;

  const underBudget = budget.remaining >= 0 && budget.overspend_risk !== 'high';
  const overBudget = budget.remaining < 0 || budget.overspend_risk === 'high';

  let xp_delta = 0;
  if (underBudget) xp_delta += 15;
  if (overBudget) xp_delta -= 10;
  if (goals.total_count > 0 && goals.on_track_count === goals.total_count) xp_delta += 10;

  if (overBudget) {
    overspend_count += 1;
    streak = 0;
  } else {
    overspend_count = 0;
    if (goals.total_count > 0 && goals.on_track_count === goals.total_count) streak += 1;
  }

  let newXp = xp + xp_delta;
  let newLevel = level;
  let level_changed: 'up' | 'down' | 'same' = 'same';

  while (newXp >= 100) {
    newXp -= 100;
    newLevel += 1;
    level_changed = 'up';
  }

  if (newXp < 0) {
    if (newLevel > 1 && overspend_count >= 2) {
      newLevel -= 1;
      newXp = 50;
      level_changed = 'down';
      overspend_count = 0;
    } else {
      newXp = 0;
    }
  }

  const mood = computeMood(budget, goals);

  return {
    level: newLevel,
    xp: Math.max(0, Math.min(100, Math.round(newXp))),
    streak,
    overspend_count,
    mood,
    xp_delta,
    level_changed,
  };
}

function computeMood(budget: BudgetEngineOutput, goals: GoalsEngineOutput): MoodState {
  const risk = budget.overspend_risk;
  const goalRatio = goals.total_count > 0 ? goals.on_track_count / goals.total_count : 1;

  if (risk === 'high' && goalRatio < 0.3) return 'critical';
  if (risk === 'high' || goalRatio < 0.4) return 'struggling';
  if (risk === 'medium' || goalRatio < 0.75) return 'stable';
  return 'thriving';
}
