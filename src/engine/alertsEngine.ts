import {
  Alert,
  BudgetEngineOutput,
  GoalsEngineOutput,
  ProcessedTransaction,
  SpendingAnalysis,
} from './types';

export function runAlertsEngine(
  budget: BudgetEngineOutput,
  goals: GoalsEngineOutput,
  analysis: SpendingAnalysis,
  _transactions: ProcessedTransaction[],
): Alert[] {
  const alerts: Alert[] = [];

  if (budget.remaining < 0) {
    alerts.push({
      code: 'OVERSPEND',
      severity: 'high',
      message: 'Weekly budget exceeded',
      detail: `Remaining: $${budget.remaining.toFixed(2)}`,
    });
  } else if (budget.overspend_risk === 'high') {
    alerts.push({
      code: 'OVERSPEND',
      severity: 'medium',
      message: 'High overspend risk this month',
      detail: `Projected $${budget.projected_monthly_spend.toFixed(2)}`,
    });
  }

  for (const c of budget.category_status) {
    if (c.over) {
      alerts.push({
        code: 'CATEGORY_LIMIT_EXCEEDED',
        severity: 'medium',
        message: `${c.category} limit exceeded`,
        detail: `Spent $${c.spent.toFixed(2)} of $${c.limit.toFixed(2)}`,
      });
    }
  }

  for (const a of analysis.anomalies) {
    alerts.push({
      code: 'ANOMALY_DETECTED',
      severity: 'low',
      message: `Unusual ${a.category} transaction`,
      detail: `${a.normalized_merchant}: $${a.amount.toFixed(2)}`,
    });
  }

  for (const g of goals.goals) {
    if (!g.on_track && g.likelihood < 0.4) {
      alerts.push({
        code: 'GOAL_AT_RISK',
        severity: 'medium',
        message: `Goal at risk: ${g.label}`,
        detail: `Likelihood ${Math.round(g.likelihood * 100)}%`,
      });
    }
  }

  if (budget.overspend_risk === 'high' && goals.total_count > 0 && goals.on_track_count === 0) {
    alerts.push({
      code: 'FINANCIAL_INSTABILITY',
      severity: 'high',
      message: 'Financial instability detected',
      detail: 'High risk with no goals on track',
    });
  }

  return alerts;
}
