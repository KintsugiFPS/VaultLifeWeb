export type UserType = 'student' | 'professional' | 'other';
export type FilingStatus = 'single' | 'married' | 'head_of_household';

export type Category =
  | 'Food'
  | 'Transport'
  | 'Rent'
  | 'Shopping'
  | 'Utilities'
  | 'Subscriptions'
  | 'Education'
  | 'Other';

export interface UserState {
  user_type: UserType;
  monthly_income: number;
  filing_status?: FilingStatus;
  name?: string;
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category?: Category;
}

export interface ProcessedTransaction extends Transaction {
  normalized_merchant: string;
  category: Category;
  is_anomaly: boolean;
}

export interface Budget {
  weekly_limit?: number;
  category_limits?: Partial<Record<Category, number>>;
}

export type GoalType = 'savings_target' | 'no_spend_streak' | 'category_limit';

export interface Goal {
  id: string;
  type: GoalType;
  label: string;
  target: number;
  current?: number;
  deadline?: string;
  category?: Category;
}

export interface FafsaInput {
  cost_of_attendance: number;
  expected_family_contribution: number;
}

export interface CostOfLivingOption {
  label: string;
  rent: number;
  commute: number;
  transport: number;
  lifestyle: number;
}

export interface CostOfLivingInput {
  option_a: CostOfLivingOption;
  option_b: CostOfLivingOption;
}

export interface EngineInput {
  user_state: UserState;
  transactions: Transaction[];
  budget?: Budget;
  goals?: Goal[];
  fafsa?: FafsaInput;
  cost_of_living_comparison?: CostOfLivingInput;
  enable_tax_module?: boolean;
  avatar_prev?: AvatarSnapshot;
}

export interface SpendingAnalysis {
  total_spend: number;
  by_category: Record<string, number>;
  daily_avg: number;
  weekly_avg: number;
  daily_series: { date: string; total: number }[];
  weekly_series: { week: string; total: number }[];
  anomalies: ProcessedTransaction[];
}

export type OverspendRisk = 'low' | 'medium' | 'high';

export interface BudgetEngineOutput {
  weekly_limit: number;
  total_spent_this_week: number;
  remaining: number;
  daily_burn_rate: number;
  projected_monthly_spend: number;
  overspend_risk: OverspendRisk;
  category_status: {
    category: Category;
    limit: number;
    spent: number;
    remaining: number;
    over: boolean;
  }[];
}

export interface GoalStatus {
  id: string;
  label: string;
  type: GoalType;
  progress_pct: number;
  likelihood: number;
  required_daily_adjustment: number;
  on_track: boolean;
  days_remaining?: number;
}

export interface GoalsEngineOutput {
  goals: GoalStatus[];
  on_track_count: number;
  total_count: number;
}

export type MoodState = 'thriving' | 'stable' | 'struggling' | 'critical';

export interface AvatarSnapshot {
  level: number;
  xp: number;
  streak: number;
  overspend_count?: number;
}

export interface AvatarSystem extends AvatarSnapshot {
  mood: MoodState;
  xp_delta: number;
  level_changed: 'up' | 'down' | 'same';
}

export interface FafsaOutput {
  cost_of_attendance: number;
  expected_family_contribution: number;
  need: number;
  aid_estimate_low: number;
  aid_estimate_high: number;
  monthly_surplus_or_deficit_low: number;
  monthly_surplus_or_deficit_high: number;
}

export interface TaxOutput {
  enabled: boolean;
  annual_income: number;
  filing_status: FilingStatus;
  federal_low: number;
  federal_high: number;
  state_low: number;
  state_high: number;
  total_low: number;
  total_high: number;
  net_annual_low: number;
  net_annual_high: number;
  net_monthly_low: number;
  net_monthly_high: number;
}

export interface CostOfLivingOutputSide extends CostOfLivingOption {
  total_monthly: number;
  hidden_cost_score: number;
}

export interface CostOfLivingOutput {
  option_a: CostOfLivingOutputSide;
  option_b: CostOfLivingOutputSide;
  optimal: 'A' | 'B';
  monthly_difference: number;
}

export type AlertCode =
  | 'OVERSPEND'
  | 'CATEGORY_LIMIT_EXCEEDED'
  | 'ANOMALY_DETECTED'
  | 'GOAL_AT_RISK'
  | 'FINANCIAL_INSTABILITY';

export type Severity = 'low' | 'medium' | 'high';

export interface Alert {
  code: AlertCode;
  severity: Severity;
  message: string;
  detail?: string;
}

export type RecommendationCode =
  | 'reduce_food_spending'
  | 'reduce_category_spending'
  | 'cancel_subscription'
  | 'adjust_budget_allocation'
  | 'increase_savings_rate';

export interface Recommendation {
  code: RecommendationCode;
  label: string;
  value?: number;
  target?: string;
}

export interface EngineOutput {
  user_state: UserState;
  transactions: ProcessedTransaction[];
  spending_analysis: SpendingAnalysis;
  budget_engine: BudgetEngineOutput;
  goals_engine: GoalsEngineOutput;
  avatar_system: AvatarSystem;
  fafsa_module: FafsaOutput | null;
  tax_module: TaxOutput;
  cost_of_living_module: CostOfLivingOutput | null;
  alerts: Alert[];
  recommendations: Recommendation[];
}
