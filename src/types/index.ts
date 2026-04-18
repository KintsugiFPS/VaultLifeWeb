// Transaction types
export type TransactionCategory =
  | "food"
  | "transport"
  | "rent"
  | "shopping"
  | "utilities"
  | "subscriptions"
  | "education"
  | "other";

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: TransactionCategory;
  merchant: string;
  description: string;
  date: string; // ISO date string
  timestamp: number; // Unix timestamp
  isAnomaly: boolean;
}

// Budget types
export interface BudgetLimit {
  category: TransactionCategory;
  weeklyLimit: number;
  monthlyLimit: number;
}

export interface BudgetStatus {
  category: TransactionCategory;
  spent: number;
  limit: number;
  remaining: number;
  percentageUsed: number;
  status: "under" | "warning" | "over";
}

// Goals types
export type GoalType = "savings_target" | "no_spend_streak" | "category_limit";

export interface Goal {
  id: string;
  userId: string;
  name: string;
  type: GoalType;
  targetAmount?: number;
  currentAmount?: number;
  category?: TransactionCategory;
  streakDays?: number;
  targetDays?: number;
  startDate: string;
  createdAt: string;
  progress: number; // 0-100
  completed: boolean;
}

// Avatar types
export interface AvatarState {
  level: number;
  xp: number; // 0-100 per level
  totalXp: number;
  mood: "happy" | "neutral" | "stressed" | "excited";
  streaks: {
    budgetDays: number;
    savingsDays: number;
  };
  badges: string[];
}

// User types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  userType: "student" | "professional" | "general";
  createdAt: string;
  avatar: AvatarState;
}

// Financial state types
export interface FinancialState {
  userId: string;
  transactions: Transaction[];
  budget: BudgetLimit[];
  budgetStatus: BudgetStatus[];
  goals: Goal[];
  avatar: AvatarState;
  spending: {
    thisWeek: number;
    thisMonth: number;
    dailyAverage: number;
    trends: Record<TransactionCategory, number>;
  };
  alerts: string[];
  recommendations: string[];
}

// UI Context types
export interface VaultLifeContextType {
  user: UserProfile | null;
  financial: FinancialState | null;
  isLoading: boolean;
  error: string | null;
  updateTransaction: (transaction: Transaction) => void;
  updateBudget: (budget: BudgetLimit) => void;
  updateGoal: (goal: Goal) => void;
}
