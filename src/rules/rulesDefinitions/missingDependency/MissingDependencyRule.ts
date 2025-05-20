import { Node, Project, SyntaxKind } from "ts-morph";

import { HookInfo } from "../../../scanner/hookExtractor";
import { HookRule, RuleResult } from "../../Rule";
import { getExternalDependenciesFromHook } from "./globals";

/**
 * Detect useEffect, useMemo, or useCallback without dependencies
 */
export class MissingDependencyRule implements HookRule {
  id = "missing-dependency";
  description =
    "Detect useEffect, useMemo, or useCallback without dependencies";

  appliesTo(hook: HookInfo): boolean {
    return (
      (hook.name === "useEffect" ||
        hook.name === "useMemo" ||
        hook.name === "useCallback") &&
      Array.isArray(hook.dependencies)
    );
  }

  evaluate(hook: HookInfo): RuleResult | null {
    if (!hook.bodyText) return null;

    const project = new Project({ useInMemoryFileSystem: true });
    const file = project.createSourceFile("hook.tsx", hook.fullText, {
      overwrite: true,
    });

    const call = file.getFirstDescendantByKind(SyntaxKind.CallExpression);
    if (!call) return null;

    const [_, depArray] = call.getArguments();
    if (!depArray || !Node.isArrayLiteralExpression(depArray)) return null;

    const declaredDeps = new Set(
      depArray.getElements().map((el) => el.getText())
    );
    const usedDeps = getExternalDependenciesFromHook(call);

    const missing = usedDeps.filter((dep) => !declaredDeps.has(dep));
    if (missing.length === 0) return null;

    return {
      ruleId: this.id,
      message: `Possible missing dependencies: ${missing.join(", ")}`,
      level: "warning",
      suggestions: [
        "One or more variables used inside this hook are missing from the dependency array.",
        "This may cause stale closures or unpredictable behavior — add all referenced values to the dependencies.",
      ],
    };
  }
}
