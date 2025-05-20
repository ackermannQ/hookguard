"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.FakeRule = void 0;
/**
 * Fake rule for demonstration purposes
 */
class FakeRule {
    constructor() {
        this.id = "fake-rule";
        this.description = "It's a fake rule for demonstration purposes";
    }
    appliesTo(hook) {
        return hook.name === "useEffect";
    }
    evaluate(hook) {
        return {
            ruleId: this.id,
            level: "info",
            message: "It's a useEffect hook!",
            suggestions: [
                "Write here some suggestions for ensuring the rules is respected",
            ],
        };
    }
}
exports.FakeRule = FakeRule;
exports.config = {
    customRules: { "fake-rule": new FakeRule() },
    rules: {
        "no-cleanup": true,
        "unsafe-network": true,
        "excessive-dependencies": true,
        "missing-dependency": false,
        "async-effect": false,
        "fake-rule": true,
    },
    thresholds: {
        failOnScore: undefined,
        failOnCritical: false,
    },
    suspiciousCalls: [
        "setUser",
        "setAuth",
        "setSession",
        "setTheme",
        "setLocale",
        "setLanguage",
        "setSettings",
    ],
};
