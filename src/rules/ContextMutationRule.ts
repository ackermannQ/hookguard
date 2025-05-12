import { HookInfo } from "../scanner/hookExtractor";
import { HookRule, RuleResult } from "./Rule";

/**
 * Detects state-setting calls that are likely modifying context values
 */
export class ContextMutationRule implements HookRule {
  id = "context-mutation";
  description =
    "Detects state-setting calls that are likely modifying context values";

  appliesTo(hook: HookInfo): boolean {
    return hook.type !== "library"; // assume custom or builtin only
  }

  evaluate(hook: HookInfo): RuleResult | null {
    const bodyText = hook.bodyText || "";

    const suspiciousCalls = [
      "setUser",
      "setAuth",
      "setTheme",
      "setContext",
      "setState",
    ].filter((fn) => bodyText.includes(`${fn}(`));

    if (suspiciousCalls.length > 0) {
      return {
        ruleId: this.id,
        level: "warning",
        message: `Potential context mutation via ${suspiciousCalls.join(", ")}`,
      };
    }

    return null;
  }
}
