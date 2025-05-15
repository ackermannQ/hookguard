import fs from "fs";
import path from "path";

import { defaultConfig, HookGuardConfig } from "./defaultConfig";

export function loadConfig(): HookGuardConfig {
  const configPath = path.resolve("hookguard.config.ts");

  if (fs.existsSync(path.resolve(configPath))) {
    try {
      const config = require(configPath).config;
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
