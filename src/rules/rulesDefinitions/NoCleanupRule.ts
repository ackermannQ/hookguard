import { HookInfo } from "../../scanner/hookExtractor";
import { HookRule, RuleResult } from "../Rule";

/**
 * Detect useEffect hooks missing cleanup functions
 */
export class NoCleanupRule implements HookRule {
  id = "no-cleanup";
  description = "Detect useEffect hooks missing cleanup functions";

  appliesTo(hook: HookInfo): boolean {
    return hook.name === "useEffect";
  }

  evaluate(hook: HookInfo): RuleResult | null {
    if (hook.hasCleanup === false) {
      return {
        ruleId: this.id,
        level: "warning",
        message: "useEffect is missing a cleanup function",
      };
    }
    return null;
  }
}
