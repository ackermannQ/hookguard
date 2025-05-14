import fs from "fs";
import path from "path";

import { extractHooksFromFile, HookInfo } from "./hookExtractor";

/**
 * Scans a directory recursively for hooks
 * @param dirPath Path to directory to scan
 * @param results List of hooks to append results to
 * @returns Scanner object
 */
export default function fileScanner() {
  function scanDirectory(dirPath: string, results: HookInfo[]) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        scanDirectory(fullPath, results);
      } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        try {
          const hooks = extractHooksFromFile(fullPath);
          results.push(...hooks);
        } catch (e) {
          console.warn(`⚠️ Skipped ${fullPath} due to parse error.`);
          console.warn(`Error: ${e}`);
        }
      }
    }
  }
  return { scanDirectory };
}

export { fileScanner };
