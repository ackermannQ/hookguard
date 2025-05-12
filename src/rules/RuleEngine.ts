import { HookInfo } from "../scanner/hookExtractor";
import { ContextMutationRule } from "./ContextMutationRule";
import { ExcessiveDependenciesRule } from "./ExcessiveDependenciesRule";
import { NoCleanupRule } from "./NoCleanupRule";
import { HookRule, RuleResult } from "./Rule";
import { UnsafeNetworkRule } from "./UnsafeNetworkRule";

const rules: HookRule[] = [
  new NoCleanupRule(),
  new UnsafeNetworkRule(),
  new ContextMutationRule(),
  new ExcessiveDependenciesRule(),
];

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
      riskScore: computeRiskScore(issues),
    };
  });
}

function computeRiskScore(issues: RuleResult[]): number {
  const weights = { info: 1, warning: 3, critical: 6 };

  if (issues.length === 0) return 0;
  return issues.reduce((sum, i) => sum + weights[i.level], 0);
}
