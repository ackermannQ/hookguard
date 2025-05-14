import { ts } from "ts-morph";

import { HookInfo } from "../../scanner/hookExtractor";
import { HookRule, RuleResult } from "../Rule";

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
    if (!hook.bodyText || !hook.dependencies) return null;

    const usedIdentifiers = new Set<string>();

    const sourceFile = ts.createSourceFile(
      "hook.tsx",
      hook.bodyText,
      ts.ScriptTarget.Latest,
      true
    );

    function collectIdentifiers(node: ts.Node) {
      if (ts.isIdentifier(node)) {
        usedIdentifiers.add(node.text);
      }
      ts.forEachChild(node, collectIdentifiers);
    }

    collectIdentifiers(sourceFile);

    const missingDeps = Array.from(usedIdentifiers).filter(
      (id) =>
        !hook.dependencies!.includes(id) &&
        !["console", "window", "document", "fetch", "Math", "JSON"].includes(id)
    );

    if (missingDeps.length === 0) return null;

    return {
      ruleId: this.id,
      message: `Possible missing dependencies: ${missingDeps.join(", ")}`,
      level: "warning",
      suggestions: [
        "One or more variables used inside this hook are missing from the dependency array.",
        "This may cause stale closures or unpredictable behavior — add all referenced values to the dependencies.",
      ],
    };
  }
}
