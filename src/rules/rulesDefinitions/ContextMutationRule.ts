import { defaultConfig } from "../../config/defaultConfig";
import { loadConfig } from "../../config/loadConfig";
import { HookInfo } from "../../scanner/hookExtractor";
import { HookRule, RuleResult } from "../Rule";

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

    const config = loadConfig();
    const suspiciousCalls = (
      config?.suspiciousCalls ||
      defaultConfig.suspiciousCalls ||
      []
    ).filter((fn) => bodyText.includes(`${fn}(`));

    if (suspiciousCalls.length > 0) {
      return {
        ruleId: this.id,
        level: "warning",
        message: `Potential context mutation via ${suspiciousCalls.join(", ")}`,
        suggestions: [
          "Consider using a context provider or a custom hook to manage context values.",
          "If you're using a context provider, make sure to update the context value only in controlled components.",
          "If you're using a custom hook, make sure to update the hook value only in controlled components.",
        ],
      };
    }

    return null;
  }
}
