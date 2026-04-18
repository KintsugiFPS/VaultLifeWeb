import { runAlertsEngine } from './alertsEngine';
import { runAvatarSystem } from './avatarSystem';
import { runBudgetEngine } from './budgetEngine';
import { runCostOfLivingModule } from './costOfLivingModule';
import { runFafsaModule } from './fafsaModule';
import { runGoalsEngine } from './goalsEngine';
import { runRecommendationsEngine } from './recommendationsEngine';
import { analyzeSpending } from './spendingAnalyzer';
import { runTaxModule } from './taxModule';
import { processTransactions } from './transactionProcessor';
import { EngineInput, EngineOutput } from './types';

export function runEngine(input: EngineInput): EngineOutput {
  const processed = processTransactions(input.transactions);
  const spending = analyzeSpending(processed);
  const budget = runBudgetEngine(input.user_state, processed, spending, input.budget);
  const goals = runGoalsEngine(input.goals, spending, processed);
  const avatar = runAvatarSystem(input.avatar_prev, budget, goals);
  const fafsa = runFafsaModule(input.user_state, input.fafsa);
  const tax = runTaxModule(input.user_state, input.enable_tax_module);
  const col = runCostOfLivingModule(input.cost_of_living_comparison);
  const alerts = runAlertsEngine(budget, goals, spending, processed);
  const recommendations = runRecommendationsEngine(budget, spending, processed);

  return {
    user_state: input.user_state,
    transactions: processed,
    spending_analysis: spending,
    budget_engine: budget,
    goals_engine: goals,
    avatar_system: avatar,
    fafsa_module: fafsa,
    tax_module: tax,
    cost_of_living_module: col,
    alerts,
    recommendations,
  };
}

// Export individual modules for direct use in components
export { runFafsaModule, runTaxModule, runCostOfLivingModule };
export * from './types';
