import { HookInfo } from "../scanner/hookExtractor";

export interface RuleResult {
  level: "info" | "warning" | "critical";
  message: string;
  ruleId: string;
  suggestions: string[];
}

/**
 * A hook rule that can be applied to a HookInfo
 */
export interface HookRule {
  /**
   * A unique identifier for the rule
   */
  id: string;

  /**
   * A short description of the rule
   */
  description: string;

  /**
   * Determines if the rule applies to a given hook
   * @param hook The hook to evaluate
   */
  appliesTo(hook: HookInfo): boolean;

  /**
   * Evaluates the hook and returns a RuleResult if applicable
   * @param hook The hook to evaluate
   */
  evaluate(hook: HookInfo): RuleResult | null;
}
