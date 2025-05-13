import { HookInfo } from "../../scanner/hookExtractor";
import { HookRule, RuleResult } from "../Rule";

/**
 * Detect useEffect network calls without cancellation
 */
export class UnsafeNetworkRule implements HookRule {
  id = "unsafe-network";
  description = "Detect useEffect network calls without cancellation";

  appliesTo(hook: HookInfo): boolean {
    return hook.name === "useEffect";
  }

  evaluate(hook: HookInfo): RuleResult | null {
    if (hook.abortPresent === false) {
      return {
        ruleId: this.id,
        level: "warning",
        message: `useEffect makes ${hook.networkCalls?.join(
          ", "
        )} call(s) but lacks cancellation logic (no AbortController or cancelToken)`,
      };
    }
    return null;
  }
}
