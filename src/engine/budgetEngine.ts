import {
  Budget,
  BudgetEngineOutput,
  Category,
  OverspendRisk,
  ProcessedTransaction,
  SpendingAnalysis,
  UserState,
} from './types';

const ALL_CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Rent',
  'Shopping',
  'Utilities',
  'Subscriptions',
  'Education',
  'Other',
];

export function runBudgetEngine(
  user: UserState,
  _transactions: ProcessedTransaction[],
  analysis: SpendingAnalysis,
  budget: Budget | undefined,
): BudgetEngineOutput {
  const weekly_limit =
    budget?.weekly_limit ?? Math.max(0, Math.round((user.monthly_income / 4) * 100) / 100);

  const total_spent_this_week = round2(analysis.weekly_avg || analysis.total_spend);
  const remaining = round2(weekly_limit - total_spent_this_week);

  const daysObserved = Math.max(1, analysis.daily_series.length);
  const daily_burn_rate = round2(analysis.total_spend / daysObserved);
  const projected_monthly_spend = round2(daily_burn_rate * 30);

  const monthly_limit = weekly_limit * 4;
  let overspend_risk: OverspendRisk = 'low';
  if (monthly_limit > 0) {
    const ratio = projected_monthly_spend / monthly_limit;
    if (ratio >= 1.1) overspend_risk = 'high';
    else if (ratio >= 0.85) overspend_risk = 'medium';
  }

  const catSpent = analysis.by_category;
  const category_status = ALL_CATEGORIES.map((cat) => {
    const limit = budget?.category_limits?.[cat] ?? 0;
    const spent = round2(catSpent[cat] || 0);
    return {
      category: cat,
      limit,
      spent,
      remaining: round2(limit - spent),
      over: limit > 0 && spent > limit,
    };
  });

  return {
    weekly_limit,
    total_spent_this_week,
    remaining,
    daily_burn_rate,
    projected_monthly_spend,
    overspend_risk,
    category_status,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
