import { HookRule } from "../rules/Rule";

export interface HookGuardConfig {
  rules: Record<string, boolean>;
  thresholds?: ThresholdConfig;
  suspiciousCalls?: string[];
  customRules?: Record<string, HookRule>;
}

type ThresholdConfig = {
  failOnScore?: number;
  failOnCritical?: boolean;
};

export const defaultConfig: HookGuardConfig = {
  customRules: {},
  rules: {
    "no-cleanup": true,
    "unsafe-network": true,
    "excessive-dependencies": true,
    "missing-dependency": true,
    "async-effect": true,
  },
  thresholds: {
    failOnScore: undefined,
    failOnCritical: false,
  },
  suspiciousCalls: [
    // generics
    "setState",
    "setValue",
    "setData",
    "setContext",

    // frequently used
    "setUser",
    "setAuth",
    "setSession",
    "setTheme",
    "setLocale",
    "setLanguage",
    "setSettings",
    "setConfig",
    "setPermissions",
    "setProfile",

    // redux/zustand/atoms
    "dispatch",
    "updateStore",
    "setAtom",
    "useSetRecoilState",
    "useStore.setState",
    "store.setState",
    "setGlobalState",
  ],
};
