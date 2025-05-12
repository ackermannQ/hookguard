import { HookInfo } from "../scanner/hookExtractor";
import { NoCleanupRule } from "./NoCleanupRule";
import { HookRule, RuleResult } from "./Rule";
import { UnsafeNetworkRule } from "./UnsafeNetworkRule";

const rules: HookRule[] = [new NoCleanupRule(), new UnsafeNetworkRule()];

export function evaluateHooks(
  hooks: HookInfo[]
): (HookInfo & { issues: RuleResult[] })[] {
  return hooks.map((hook) => {
    const issues = rules
      .filter((rule) => rule.appliesTo(hook))
      .map((rule) => rule.evaluate(hook))
      .filter((result): result is RuleResult => result !== null);

    return {
      ...hook,
      issues,
    };
  });
}
