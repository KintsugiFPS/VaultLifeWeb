import { FafsaInput, FafsaOutput, UserState } from './types';

export function runFafsaModule(
  user: UserState,
  input: FafsaInput | undefined,
): FafsaOutput | null {
  if (user.user_type !== 'student' || !input) return null;

  const need = Math.max(0, input.cost_of_attendance - input.expected_family_contribution);
  const aid_low = round2(need * 0.6);
  const aid_high = round2(need * 0.9);

  const annualIncome = user.monthly_income * 12;
  const totalResourcesLow = annualIncome + aid_low;
  const totalResourcesHigh = annualIncome + aid_high;

  const monthlyCoa = input.cost_of_attendance / 12;
  const monthly_low = round2(totalResourcesLow / 12 - monthlyCoa);
  const monthly_high = round2(totalResourcesHigh / 12 - monthlyCoa);

  return {
    cost_of_attendance: input.cost_of_attendance,
    expected_family_contribution: input.expected_family_contribution,
    need: round2(need),
    aid_estimate_low: aid_low,
    aid_estimate_high: aid_high,
    monthly_surplus_or_deficit_low: monthly_low,
    monthly_surplus_or_deficit_high: monthly_high,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
