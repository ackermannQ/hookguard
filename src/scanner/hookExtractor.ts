import { Project, SyntaxKind } from "ts-morph";

import { BuiltInHooks, HookWithDependency } from "../rules/HookType";

/**
 * Hook information extracted from a file
 */
export interface HookInfo {
  /**
   * Name of the hook
   */
  name: string;

  /**
   * Type of the hook (builtin, custom, library)
   */
  type: "builtin" | "custom" | "library";

  /**
   * Whether the hook has a cleanup function
   */
  hasCleanup?: boolean;

  /**
   * List of dependencies
   */
  dependencies?: string[];

  /**
   * Path to the file containing the hook
   */
  filePath: string;
  /**
   * Body of the hook
   */
  bodyText?: string;

  /**
   * List of network calls
   */
  networkCalls?: string[]; // ["fetch", "axios"]

  /**
   * Whether the hook makes network calls with an abort controller
   */
  abortPresent?: boolean; // found AbortController or .abort()
}

const importMap = new Map<string, string>();

/**
 * Extracts hooks from a file
 * @param filePath Path to file to extract hooks from
 * @returns List of hooks
 */
export function extractHooksFromFile(filePath: string): HookInfo[] {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);
  const hooks: HookInfo[] = [];

  sourceFile.getImportDeclarations().forEach((decl) => {
    const moduleName = decl.getModuleSpecifierValue();
    decl.getNamedImports().forEach((named) => {
      const name = named.getName();
      importMap.set(name, moduleName);
    });
  });

  sourceFile.forEachDescendant((node) => {
    if (node.getKind() === SyntaxKind.CallExpression) {
      const expr = node.asKind(SyntaxKind.CallExpression);
      const exprText = expr?.getExpression().getText();

      if (!expr || !exprText) return;

      const isHook = /^use[A-Z]/.test(exprText);
      if (isHook) {
        let type: HookInfo["type"];

        if (BuiltInHooks.includes(exprText)) {
          type = "builtin";
        } else if (importMap.has(exprText)) {
          type = "library";
        } else {
          type = "custom";
        }

        const hook: HookInfo = {
          name: exprText,
          type,
          filePath,
        };

        // useEffect specific logic
        if (exprText === "useEffect") {
          const arg = expr.getArguments()[0];
          if (arg && arg.getKind() === SyntaxKind.ArrowFunction) {
            const body = arg.getLastChildByKind(SyntaxKind.Block);

            // Cleanup
            const returnStmt = arg
              .getLastChildByKind(SyntaxKind.Block)
              ?.getDescendantsOfKind(SyntaxKind.ReturnStatement);
            hook.hasCleanup = returnStmt && returnStmt.length > 0;

            // Check for network calls
            if (body) {
              hook.bodyText = body.getText();
              const calls = body.getDescendantsOfKind(
                SyntaxKind.CallExpression
              );
              const networkCalls: string[] = [];

              for (const call of calls) {
                const callName = call.getExpression().getText();
                if (
                  ["fetch"].includes(callName) ||
                  callName.includes("axios")
                ) {
                  networkCalls.push(callName);
                }
              }

              if (networkCalls.length > 0) {
                hook.networkCalls = networkCalls;
              }

              // Abort presence
              const abortLike = body
                .getDescendants()
                .some(
                  (n) =>
                    n.getText().includes("AbortController") ||
                    n.getText().includes(".abort") ||
                    n.getText().includes("cancelToken")
                );
              if (abortLike) {
                hook.abortPresent = true;
              } else if (networkCalls.length > 0) {
                hook.abortPresent = false;
              }
            }
          }
        }

        // extract dependencies array
        if (HookWithDependency.includes(exprText)) {
          const args = expr.getArguments();
          const deps = args[1];
          if (deps && deps.getKind() === SyntaxKind.ArrayLiteralExpression) {
            const depsArray = deps
              .getText()
              .slice(1, -1)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            hook.dependencies = depsArray;
          }
        }

        hooks.push(hook);
      }
    }
  });

  return hooks;
}
