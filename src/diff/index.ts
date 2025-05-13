import fs from "fs";

interface RuleIssue {
  ruleId: string;
  level: "info" | "warning" | "critical";
}

interface HookReport {
  filePath: string;
  name: string;
  issues: RuleIssue[];
}

type HookGuardReport = HookReport[];

/**
 * Compares two HookGuard reports and prints a diff
 * @param oldPath Old report path
 * @param newPath New report path
 */
export default function diffReports(oldPath: string, newPath: string): void {
  const oldData: HookGuardReport = JSON.parse(
    fs.readFileSync(oldPath, "utf-8")
  );
  const newData: HookGuardReport = JSON.parse(
    fs.readFileSync(newPath, "utf-8")
  );

  const oldKeys = new Set<string>();
  const newKeys = new Set<string>();

  for (const hook of oldData) {
    for (const issue of hook.issues) {
      oldKeys.add(generateKey(hook, issue));
    }
  }

  for (const hook of newData) {
    for (const issue of hook.issues) {
      newKeys.add(generateKey(hook, issue));
    }
  }

  const added = [...newKeys].filter((k) => !oldKeys.has(k));
  const resolved = [...oldKeys].filter((k) => !newKeys.has(k));
  const persistent = [...newKeys].filter((k) => oldKeys.has(k));

  console.log("## ♻️ Hook Risk Diff");

  if (added.length) {
    console.log("\n### 🔥 New Issues Introduced");
    added.forEach((k) => console.log("- " + k));
  }

  if (resolved.length) {
    console.log("\n### ✅ Issues Resolved");
    resolved.forEach((k) => console.log("- " + k));
  }

  if (persistent.length && !added.length && !resolved.length) {
    console.log("\nNo changes detected. Risks are stable.");
  }
}

function generateKey(hook: HookReport, issue: RuleIssue): string {
  return `${hook.filePath}::${hook.name}::${issue.ruleId}`;
}
