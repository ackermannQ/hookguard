import { loadConfig } from "../config/loadConfig";
import { HookInfo } from "../scanner/hookExtractor";
import { HookRule, RuleResult } from "./Rule";
import { ContextMutationRule } from "./rulesDefinitions/ContextMutationRule";
import { ExcessiveDependenciesRule } from "./rulesDefinitions/ExcessiveDependenciesRule";
import { MissingDependencyRule } from "./rulesDefinitions/missingDependency/MissingDependencyRule";
import { NoCleanupRule } from "./rulesDefinitions/NoCleanupRule";
import { UnsafeNetworkRule } from "./rulesDefinitions/UnsafeNetworkRule";

const config = loadConfig();

const rules: HookRule[] = [
  ...(config.customRules ? Object.values(config.customRules) : []),
  new NoCleanupRule(),
  new UnsafeNetworkRule(),
  new ContextMutationRule(),
  new ExcessiveDependenciesRule(),
  new MissingDependencyRule(),
];

/**
 * Evaluates all rules against a list of hooks
 * @param hooks List of hooks to evaluate
 */
export function evaluateHooks(
  hooks: HookInfo[]
): (HookInfo & { issues: RuleResult[] })[] {
  const enabledRules = rules.filter(
    (rule) => config?.rules?.[rule?.id] === true
  );
  return hooks.map((hook) => {
    const issues = enabledRules
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

/**
 * Computes a risk score based on the severity of issues
 * @param issues List of issues to score
 * @returns Risk score
 */
export function computeRiskScore(issues: RuleResult[]): number {
  const weights = { info: 1, warning: 3, critical: 6 };

  if (issues.length === 0) return 0;
  return issues.reduce((sum, i) => sum + weights[i.level], 0);
}
