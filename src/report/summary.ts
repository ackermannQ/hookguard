import fs from "fs";
import path from "path";
import { RuleResult } from "../rules/Rule";

interface HookReport {
  name: string;
  filePath: string;
  riskScore: number;
  issues: RuleResult[];
}

function summarizeReport(filePath: string) {
  const data: HookReport[] = JSON.parse(
    fs.readFileSync(path.resolve(filePath), "utf-8")
  );

  const summary = new Map<
    string,
    {
      hooks: number;
      score: number;
      info: number;
      warning: number;
      critical: number;
      rules: Set<string>;
    }
  >();

  for (const hook of data) {
    const stats = summary.get(hook.filePath) || {
      hooks: 0,
      score: 0,
      info: 0,
      warning: 0,
      critical: 0,
      rules: new Set<string>(),
    };

    stats.hooks += 1;
    stats.score += hook.riskScore;

    for (const issue of hook.issues) {
      stats[issue.level] += 1;
      stats.rules.add(issue.ruleId);
    }

    summary.set(hook.filePath, stats);
  }

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
    }
  }

  color(`🧼 Clean Hooks (No issues found)\n`, "\x1b[34m");
  color(cleanFiles.sort().join("\n"), "\x1b[34m");
  color;

  if (markdownMode && cleanFiles.length > 0) {
    console.log("\n## 🧼 Clean Hooks (No issues found)");
    cleanFiles.sort().forEach((file) => {
      console.log(`- \`${file}\``);
    });
  }
}

if (require.main === module) {
  const input = process.argv[2];
  if (!input) {
    console.error("Usage: hookguard-summary <report.json>");
    process.exit(1);
  }
  summarizeReport(input);
}

function color(text: string, colorCode: string) {
  return `${colorCode}${text}\x1b[0m`;
}

export { summarizeReport };
