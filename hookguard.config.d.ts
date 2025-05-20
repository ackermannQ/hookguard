import { HookRule, RuleResult } from "./src/rules/Rule";
import { HookInfo } from "./src/scanner/hookExtractor";
import { HookGuardConfig } from "./src/config/defaultConfig";
/**
 * Fake rule for demonstration purposes
 */
export declare class FakeRule implements HookRule {
    id: string;
    description: string;
    appliesTo(hook: HookInfo): boolean;
    evaluate(hook: HookInfo): RuleResult | null;
}
export declare const config: HookGuardConfig;
