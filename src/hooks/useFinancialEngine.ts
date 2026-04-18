import { useMemo } from "react";
import { runEngine } from "@/engine";
import type { EngineInput } from "@/engine/types";

export function useFinancialEngine(input: EngineInput) {
  const output = useMemo(() => {
    try {
      return runEngine(input);
    } catch (error) {
      console.error("Engine error:", error);
      throw error;
    }
  }, [
    JSON.stringify(input.user_state),
    JSON.stringify(input.transactions),
    JSON.stringify(input.budget),
    JSON.stringify(input.goals),
    JSON.stringify(input.fafsa),
    JSON.stringify(input.cost_of_living_comparison),
    input.enable_tax_module,
    JSON.stringify(input.avatar_prev),
  ]);

  return output;
}
