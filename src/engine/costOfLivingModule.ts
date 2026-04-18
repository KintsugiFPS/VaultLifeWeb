import {
  CostOfLivingInput,
  CostOfLivingOption,
  CostOfLivingOutput,
  CostOfLivingOutputSide,
} from './types';

function scoreSide(opt: CostOfLivingOption): CostOfLivingOutputSide {
  const total_monthly = round2(opt.rent + opt.commute + opt.transport + opt.lifestyle);
  const hidden =
    ((opt.commute * 1.5 + opt.transport * 1.2 + opt.lifestyle * 1.1) /
      Math.max(1, total_monthly)) *
    100;
  return {
    ...opt,
    total_monthly,
    hidden_cost_score: round1(clamp(hidden, 0, 100)),
  };
}

export function runCostOfLivingModule(
  input: CostOfLivingInput | undefined,
): CostOfLivingOutput | null {
  if (!input) return null;
  const a = scoreSide(input.option_a);
  const b = scoreSide(input.option_b);

  let optimal: 'A' | 'B';
  const aScore = a.total_monthly + a.hidden_cost_score;
  const bScore = b.total_monthly + b.hidden_cost_score;
  optimal = aScore <= bScore ? 'A' : 'B';

  return {
    option_a: a,
    option_b: b,
    optimal,
    monthly_difference: round2(Math.abs(a.total_monthly - b.total_monthly)),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}
