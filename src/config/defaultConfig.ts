export interface HookGuardConfig {
  rules: Record<string, boolean>;
  thresholds?: ThresholdConfig;
  suspiciousCalls?: string[];
}

type ThresholdConfig = {
  failOnScore?: number;
  failOnCritical?: boolean;
};

export const defaultConfig: HookGuardConfig = {
  rules: {
    "no-cleanup": true,
    "unsafe-network": true,
    "excessive-dependencies": true,
  },
  thresholds: {
    failOnScore: undefined,
    failOnCritical: false,
  },
  suspiciousCalls: [],
};
