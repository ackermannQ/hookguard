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
        suggestions: [
          "Avoid calling fetch or other network requests directly inside an effect.",
          "Wrap your network calls in a dedicated function or hook to handle loading, cancellation, and errors properly.",
          "You might consider using a library like SWR or React Query for safer and more declarative data fetching.",
        ],
      };
    }
    return null;
  }
}
