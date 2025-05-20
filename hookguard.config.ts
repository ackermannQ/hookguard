import { HookGuardConfig } from "./src/config/defaultConfig";
import { HookRule, RuleResult } from "./src/rules/Rule";
import { HookInfo } from "./src/scanner/hookExtractor";

/**
 * Fake rule for demonstration purposes
 */
export class FakeRule implements HookRule {
  id = "fake-rule";
  description = "It's a fake rule for demonstration purposes";

  appliesTo(hook: HookInfo): boolean {
    return hook.name === "useEffect";
  }

  evaluate(hook: HookInfo): RuleResult | null {
    return {
      ruleId: this.id,
      level: "info",
      message: "It's a useEffect hook!",
      suggestions: [
        "Write here some suggestions for ensuring the rules is respected",
      ],
    };
  }
}

export const config: HookGuardConfig = {
  customRules: { "fake-rule": new FakeRule() },
  rules: {
    "no-cleanup": true,
    "unsafe-network": true,
    "excessive-dependencies": true,
    "missing-dependency": true,
    "async-effect": false,
    "fake-rule": true,
  },
  thresholds: {
    failOnScore: undefined,
    failOnCritical: false,
  },
  suspiciousCalls: [
    "setUser",
    "setAuth",
    "setSession",
    "setTheme",
    "setLocale",
    "setLanguage",
    "setSettings",
  ],
};
