import { FilingStatus, TaxOutput, UserState } from './types';

interface Bracket {
  upTo: number;
  rate: number;
}

const FEDERAL_BRACKETS: Record<FilingStatus, Bracket[]> = {
  single: [
    { upTo: 11600, rate: 0.1 },
    { upTo: 47150, rate: 0.12 },
    { upTo: 100525, rate: 0.22 },
    { upTo: 191950, rate: 0.24 },
    { upTo: 243725, rate: 0.32 },
    { upTo: 609350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  married: [
    { upTo: 23200, rate: 0.1 },
    { upTo: 94300, rate: 0.12 },
    { upTo: 201050, rate: 0.22 },
    { upTo: 383900, rate: 0.24 },
    { upTo: 487450, rate: 0.32 },
    { upTo: 731200, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { upTo: 16550, rate: 0.1 },
    { upTo: 63100, rate: 0.12 },
    { upTo: 100500, rate: 0.22 },
    { upTo: 191950, rate: 0.24 },
    { upTo: 243700, rate: 0.32 },
    { upTo: 609350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
};

const CA_BRACKETS: Record<FilingStatus, Bracket[]> = {
  single: [
    { upTo: 10412, rate: 0.01 },
    { upTo: 24684, rate: 0.02 },
    { upTo: 38959, rate: 0.04 },
    { upTo: 54081, rate: 0.06 },
    { upTo: 68350, rate: 0.08 },
    { upTo: 349137, rate: 0.093 },
    { upTo: 418961, rate: 0.103 },
    { upTo: 698271, rate: 0.113 },
    { upTo: Infinity, rate: 0.123 },
  ],
  married: [
    { upTo: 20824, rate: 0.01 },
    { upTo: 49368, rate: 0.02 },
    { upTo: 77918, rate: 0.04 },
    { upTo: 108162, rate: 0.06 },
    { upTo: 136700, rate: 0.08 },
    { upTo: 698274, rate: 0.093 },
    { upTo: 837922, rate: 0.103 },
    { upTo: 1396542, rate: 0.113 },
    { upTo: Infinity, rate: 0.123 },
  ],
  head_of_household: [
    { upTo: 20839, rate: 0.01 },
    { upTo: 49371, rate: 0.02 },
    { upTo: 63644, rate: 0.04 },
    { upTo: 78765, rate: 0.06 },
    { upTo: 93037, rate: 0.08 },
    { upTo: 474824, rate: 0.093 },
    { upTo: 569790, rate: 0.103 },
    { upTo: 949649, rate: 0.113 },
    { upTo: Infinity, rate: 0.123 },
  ],
};

const FEDERAL_STD_DEDUCTION: Record<FilingStatus, number> = {
  single: 14600,
  married: 29200,
  head_of_household: 21900,
};

const CA_STD_DEDUCTION: Record<FilingStatus, number> = {
  single: 5363,
  married: 10726,
  head_of_household: 10726,
};

function computeTax(brackets: Bracket[], taxable: number): number {
  if (taxable <= 0) return 0;
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    if (taxable <= b.upTo) {
      tax += (taxable - prev) * b.rate;
      return tax;
    }
    tax += (b.upTo - prev) * b.rate;
    prev = b.upTo;
  }
  return tax;
}

export function runTaxModule(user: UserState, enabled: boolean | undefined): TaxOutput {
  const filing_status: FilingStatus = user.filing_status ?? 'single';
  const annual_income = Math.max(0, user.monthly_income * 12);

  if (!enabled) {
    return {
      enabled: false,
      annual_income,
      filing_status,
      federal_low: 0,
      federal_high: 0,
      state_low: 0,
      state_high: 0,
      total_low: 0,
      total_high: 0,
      net_annual_low: annual_income,
      net_annual_high: annual_income,
      net_monthly_low: round2(annual_income / 12),
      net_monthly_high: round2(annual_income / 12),
    };
  }

  const fedTaxable = Math.max(0, annual_income - FEDERAL_STD_DEDUCTION[filing_status]);
  const caTaxable = Math.max(0, annual_income - CA_STD_DEDUCTION[filing_status]);

  const federal = computeTax(FEDERAL_BRACKETS[filing_status], fedTaxable);
  const state = computeTax(CA_BRACKETS[filing_status], caTaxable);

  const federal_low = round2(federal * 0.9);
  const federal_high = round2(federal * 1.1);
  const state_low = round2(state * 0.9);
  const state_high = round2(state * 1.1);

  const total_low = round2(federal_low + state_low);
  const total_high = round2(federal_high + state_high);

  const net_annual_low = round2(annual_income - total_high);
  const net_annual_high = round2(annual_income - total_low);

  return {
    enabled: true,
    annual_income,
    filing_status,
    federal_low,
    federal_high,
    state_low,
    state_high,
    total_low,
    total_high,
    net_annual_low,
    net_annual_high,
    net_monthly_low: round2(net_annual_low / 12),
    net_monthly_high: round2(net_annual_high / 12),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
