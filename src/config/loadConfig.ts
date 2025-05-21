import fs from "fs";
import path from "path";

import { defaultConfig, HookGuardConfig } from "./defaultConfig";

export function loadConfig(): HookGuardConfig {
  const configPath = path.resolve("./src/hookguard.config.ts");

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

export function copyDefaultConfig(destinationPath?: string): void {
  try {
    const sourcePath = path.resolve(
      process.cwd() + "/src/config/",
      "defaultConfig.ts"
    );

    if (!fs.existsSync(sourcePath)) {
      console.error("❌ Source config not found at:", sourcePath);
      return;
    }

    let targetPath = destinationPath
      ? path.resolve(process.cwd(), destinationPath)
      : sourcePath;

    targetPath += "/src/hookguard.config.ts";

    fs.copyFileSync(sourcePath, targetPath);

    console.log(`✅ Copied config to: ${targetPath}`);
  } catch (error: any) {
    console.error("❌ Failed to copy config:", error.message);
  }
}
