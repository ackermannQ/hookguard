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
        suggestions: [
          "Return a cleanup function from your effect to prevent memory leaks or stale side effects.",
          "If you're using timers, event listeners, or subscriptions, make sure to clean them up when the component unmounts.",
        ],
      };
    }
    return null;
  }
}
