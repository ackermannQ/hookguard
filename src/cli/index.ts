#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { evaluateHooks } from "../rules/RuleEngine";
import fileScanner from "../scanner/fileScanner";
import { HookInfo } from "../scanner/hookExtractor";
import { summarizeReport } from "../report/summary";
import { program } from "commander";
import { version } from "./../../package.json";
import { printHeader } from "../misc/hookWisdom";
import diffReports from "../diff";
import { copyDefaultConfig } from "../config/loadConfig";

program
  .name("hookguard")
  .description("Scan React files for unsafe or complex hook usage")
  .version(version);

printHeader(version);

program
  .command("scan")
  .argument("<directory>")
  .description("Scan React files for unsafe or complex hook usage")
  .action((directory: string) => {
    const rawHooks: HookInfo[] = [];
    const absDir = path.resolve(directory);

    fileScanner().scanDirectory(absDir, rawHooks);

    const results = evaluateHooks(rawHooks);
    const logsDir = path.resolve("data");
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

    const outputPath = path.join(logsDir, `hookguard-log-${Date.now()}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`✅ Analysis complete. Results saved to ${outputPath}`);
  });

program
  .command("report")
  .argument("<reportFile>")
  .description("Print summary from report file")
  .action((reportFile: string) => {
    summarizeReport(reportFile);
  });

program
  .command("diff <oldReportPath> <newReportPath>")
  .description("Compare two HookGuard reports and show new/resolved issues")
  .action((oldReportPath: string, newReportPath: string) => {
    diffReports(oldReportPath, newReportPath);
  });

program
  .command("init [currentDir]")
  .description("Initialize default hookguard.config.ts")
  .action(copyDefaultConfig);

program.showHelpAfterError();
program.parse(process.argv);
