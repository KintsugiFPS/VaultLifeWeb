import { ProcessedTransaction, SpendingAnalysis } from './types';

function isoWeekKey(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.slice(0, 7);
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

export function analyzeSpending(transactions: ProcessedTransaction[]): SpendingAnalysis {
  if (transactions.length === 0) {
    return {
      total_spend: 0,
      by_category: {},
      daily_avg: 0,
      weekly_avg: 0,
      daily_series: [],
      weekly_series: [],
      anomalies: [],
    };
  }

  const total = transactions.reduce((s, t) => s + t.amount, 0);

  const by_category: Record<string, number> = {};
  for (const t of transactions) {
    by_category[t.category] = (by_category[t.category] || 0) + t.amount;
  }

  const dailyMap = new Map<string, number>();
  const weeklyMap = new Map<string, number>();
  for (const t of transactions) {
    const dayKey = t.date.slice(0, 10);
    dailyMap.set(dayKey, (dailyMap.get(dayKey) || 0) + t.amount);
    const wkKey = isoWeekKey(t.date);
    weeklyMap.set(wkKey, (weeklyMap.get(wkKey) || 0) + t.amount);
  }

  const daily_series = [...dailyMap.entries()]
    .map(([date, totalAmt]) => ({ date, total: round2(totalAmt) }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const weekly_series = [...weeklyMap.entries()]
    .map(([week, totalAmt]) => ({ week, total: round2(totalAmt) }))
    .sort((a, b) => a.week.localeCompare(b.week));

  const daily_avg = daily_series.length ? total / daily_series.length : 0;
  const weekly_avg = weekly_series.length ? total / weekly_series.length : 0;

  return {
    total_spend: round2(total),
    by_category: Object.fromEntries(
      Object.entries(by_category).map(([k, v]) => [k, round2(v)]),
    ),
    daily_avg: round2(daily_avg),
    weekly_avg: round2(weekly_avg),
    daily_series,
    weekly_series,
    anomalies: transactions.filter((t) => t.is_anomaly),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
