// Core evaluation engine
export { evaluateHooks } from "./rules/RuleEngine";

// Hook extraction
export { extractHooksFromFile, type HookInfo } from "./scanner/hookExtractor";
export { fileScanner } from "./scanner/fileScanner";

// Config handling
export { loadConfig } from "./config/loadConfig";
export { defineHookGuardConfig } from "./config/defineHookGuardConfig";
export { defaultConfig } from "./config/defaultConfig";
export type { HookGuardConfig } from "./config/defaultConfig";

// Rules & results
export type { RuleResult } from "./rules/Rule";
export { summarizeReport } from "./report/summary"; // Optional if reused

// Optional utils (for debug or UI)
export { computeRiskScore } from "./rules/RuleEngine";
