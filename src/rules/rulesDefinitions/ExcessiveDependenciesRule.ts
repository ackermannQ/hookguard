import { HookInfo } from "../../scanner/hookExtractor";
import { HookWithDependency } from "../HookType";
import { HookRule, RuleResult } from "../Rule";

/**
 * Detect hooks with excessive dependencies
 */
export class ExcessiveDependenciesRule implements HookRule {
  id = "excessive-dependencies";
  description = "Detect hooks with excessive dependencies";

  appliesTo(hook: HookInfo): boolean {
    return (
      HookWithDependency.includes(hook.name) && Array.isArray(hook.dependencies)
    );
  }

  evaluate(hook: HookInfo): RuleResult | null {
    if ((hook?.dependencies?.length || 0) >= 6) {
      return {
        ruleId: this.id,
        level: "info",
        message: `Hook has ${hook?.dependencies?.length} dependencies — consider simplifying`,
      };
    }
    return null;
  }
}
