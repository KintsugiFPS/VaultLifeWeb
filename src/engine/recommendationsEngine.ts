import {
  BudgetEngineOutput,
  ProcessedTransaction,
  Recommendation,
  SpendingAnalysis,
} from './types';

export function runRecommendationsEngine(
  budget: BudgetEngineOutput,
  analysis: SpendingAnalysis,
  transactions: ProcessedTransaction[],
): Recommendation[] {
  const recs: Recommendation[] = [];

  const foodSpend = analysis.by_category['Food'] || 0;
  if (analysis.total_spend > 0 && foodSpend / analysis.total_spend > 0.35) {
    const targetPct = Math.round(((foodSpend - analysis.total_spend * 0.25) / foodSpend) * 100);
    recs.push({
      code: 'reduce_food_spending',
      label: `Reduce food spending by ${targetPct}%`,
      value: targetPct,
    });
  }

  for (const c of budget.category_status) {
    if (c.over && c.category !== 'Food') {
      const pct = Math.round(((c.spent - c.limit) / Math.max(1, c.limit)) * 100);
      recs.push({
        code: 'reduce_category_spending',
        label: `Cut ${c.category} spending by ${pct}%`,
        value: pct,
        target: c.category,
      });
    }
  }

  const subs = transactions.filter((t) => t.category === 'Subscriptions');
  const bySubMerchant = new Map<string, number>();
  for (const s of subs) {
    bySubMerchant.set(s.normalized_merchant, (bySubMerchant.get(s.normalized_merchant) || 0) + s.amount);
  }
  const pricey = [...bySubMerchant.entries()].filter(([, amt]) => amt >= 20).sort((a, b) => b[1] - a[1]);
  if (pricey.length > 0) {
    const [merchant, amt] = pricey[0];
    recs.push({
      code: 'cancel_subscription',
      label: `Cancel ${merchant} ($${amt.toFixed(2)}/mo)`,
      target: merchant,
      value: Math.round(amt * 100) / 100,
    });
  }

  const severe = budget.category_status.find((c) => c.limit > 0 && c.spent > c.limit * 1.5);
  if (severe) {
    recs.push({
      code: 'adjust_budget_allocation',
      label: `Increase ${severe.category} allocation`,
      target: severe.category,
    });
  }

  if (budget.overspend_risk === 'low' && budget.remaining > budget.weekly_limit * 0.25) {
    const pct = Math.round((budget.remaining / Math.max(1, budget.weekly_limit)) * 100);
    recs.push({
      code: 'increase_savings_rate',
      label: `Boost savings by ${pct}% of budget`,
      value: pct,
    });
  }

  return recs;
}
