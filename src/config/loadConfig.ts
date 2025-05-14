import { HookGuardConfig, defaultConfig } from "./defaultConfig";
import path from "path";
import fs from "fs";

export function loadConfig(): HookGuardConfig {
  const configPath = path.resolve("hookguard.config.ts");

  if (fs.existsSync(configPath)) {
    try {
      const config = require(configPath).default;
      return {
        ...defaultConfig,
        ...config,
        rules: {
          ...defaultConfig.rules,
          ...config.rules,
        },
      };
    } catch (err) {
      console.warn(
        "⚠️ Failed to load hookguard.config.ts. Using default config."
      );
      console.warn(err);
      return defaultConfig;
    }
  }

  return defaultConfig;
}
