#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs";
import path from "path";
import { evaluateHooks } from "../rules/RuleEngine";
import fileScanner from "../scanner/fileScanner";
import { HookInfo } from "../scanner/hookExtractor";
import { summarizeReport } from "../report/summary";

const program = new Command();

program
  .name("hookguard")
  .command("scan <directory path>")
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
  .command("report <reportFile path>")
  .description("Print summary from report file")
  .action((reportFile: string) => {
    summarizeReport(reportFile);
  });

program.parse(process.argv);
