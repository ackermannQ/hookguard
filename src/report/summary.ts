import fs from "fs";
import path from "path";

import { loadConfig } from "../config/loadConfig";
import { printEasterEgg } from "../misc/easterEgg";
import { RuleResult } from "../rules/Rule";

interface HookReport {
  name: string;
  filePath: string;
  riskScore: number;
  issues: RuleResult[];
}

type SummaryStats = {
  hooks: number;
  score: number;
  info: number;
  warning: number;
  critical: number;
  suggestions: string[];
  rules: Set<string>;
};

function summarizeReport(filePath: string) {
  const data: HookReport[] = JSON.parse(
    fs.readFileSync(path.resolve(filePath), "utf-8")
  );

  const summary = new Map<string, SummaryStats>();

  buildSummarySet(summary, data);

  const markdownMode = process.env.HG_MARKDOWN === "1";
  const cleanFiles: string[] = [];

  for (const [file, stats] of summary.entries()) {
    const header = markdownMode
      ? `📁 \`${file}\``
      : color(`📁 ${file}`, "\x1b[34m");

    console.log(header);

    if (stats.score === 0) {
      const cleanLine = markdownMode
        ? `   ✅ No issues found\n`
        : color(`   ✅ No issues found\n`, "\x1b[32m");
      console.log(cleanLine);
      cleanFiles.push(file);
    } else {
      displayHookWithIssues(stats, markdownMode);
    }

    const config = loadConfig();
    if (config?.thresholds?.failOnCritical && stats.critical > 0) {
      console.error("Threshold reached: Critical issues found");
      process.exit(1);
    }

    if (
      config?.thresholds?.failOnScore &&
      stats.score > config.thresholds.failOnScore
    ) {
      console.error("Threshold reached: Score exceeded");
      process.exit(1);
    }
  }

  if (markdownMode && cleanFiles.length > 0) {
    console.log("\n## 🧼 Clean Hooks (No issues found)");
    cleanFiles.sort().forEach((file) => {
      console.log(`- \`${file}\``);
    });
  }

  easterEgg(
    markdownMode,
    Array.from(summary.values()).reduce((acc, s) => acc + s.score, 0)
  );
}

if (require.main === module) {
  const input = process.argv[2];
  if (!input) {
    console.error("Usage: hookguard-summary <report.json>");
    process.exit(1);
  }
  summarizeReport(input);
}

function buildSummarySet(
  summary: Map<string, SummaryStats>,
  data: HookReport[]
) {
  for (const hook of data) {
    const stats = summary.get(hook.filePath) || {
      hooks: 0,
      score: 0,
      info: 0,
      warning: 0,
      critical: 0,
      suggestions: [],
      rules: new Set<string>(),
    };

    stats.hooks += 1;
    stats.score += hook.riskScore;

    for (const issue of hook.issues) {
      stats[issue.level] += 1;
      stats.rules.add(issue.ruleId);

      stats.suggestions.push(...issue.suggestions);
    }

    summary.set(hook.filePath, stats);
  }
}

function displayHookWithIssues(stats: SummaryStats, markdownMode: boolean) {
  let line = `   🔢 Hooks: ${stats.hooks}     🔥 Score: ${stats.score}     `;

  if (stats.critical) {
    line += markdownMode
      ? `🛑 Critical: ${stats.critical}  `
      : color(`🛑 Critical: ${stats.critical}  `, "\x1b[31m");
  }

  if (stats.warning) {
    line += markdownMode
      ? `⚠️  Warnings: ${stats.warning}  `
      : color(`⚠️  Warnings: ${stats.warning}  `, "\x1b[33m");
  }

  if (stats.info) {
    line += markdownMode
      ? `ℹ️  Info: ${stats.info}  `
      : color(`ℹ️  Info: ${stats.info}  `, "\x1b[90m");
  }

  console.log(line);

  const rulesLine = `   🧩 Rules: [${Array.from(stats.rules)
    .sort()
    .join(", ")}]\n`;

  console.log(markdownMode ? rulesLine : color(rulesLine, "\x1b[36m"));

  if (stats.rules.size > 0) {
    console.log("   💡 Suggestions:");
    stats.suggestions.forEach((suggestion) => {
      console.log(
        markdownMode
          ? `   - ${suggestion}`
          : color(`   - ${suggestion}`, "\x1b[35m")
      );
    });
  }
}

function color(text: string, colorCode: string) {
  return `${colorCode}${text}\x1b[0m`;
}

function easterEgg(markdownMode: boolean, totalScore: number) {
  if (markdownMode && totalScore === 0) {
    printEasterEgg();
  }
}

export { summarizeReport };
