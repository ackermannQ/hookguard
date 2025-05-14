import { summarizeReport } from "./summary";
import fs from "fs";
import path from "path";

jest.mock("fs");
jest.mock("../config/loadConfig", () => ({
  loadConfig: jest.fn(() => ({
    rules: {},
    thresholds: {},
    suspiciousCalls: [],
  })),
}));
jest.mock("../misc/easterEgg", () => ({
  printEasterEgg: jest.fn(),
}));

describe("summarizeReport", () => {
  const mockJsonPath = path.resolve("test-report.json");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display clean files in markdown mode", () => {
    process.env.HG_MARKDOWN = "1";

    const report = [
      {
        name: "useEffect",
        filePath: "src/App.tsx",
        riskScore: 0,
        issues: [],
      },
    ];

    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(report));

    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    summarizeReport(mockJsonPath);

    expect(consoleLogSpy).toHaveBeenCalledWith("📁 `src/App.tsx`");
    expect(consoleLogSpy).toHaveBeenCalledWith("   ✅ No issues found\n");
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "\n## 🧼 Clean Hooks (No issues found)"
    );
    expect(consoleLogSpy).toHaveBeenCalledWith("- `src/App.tsx`");
  });

  it("should trigger threshold failure on critical issue", () => {
    process.env.HG_MARKDOWN = "1";

    const report = [
      {
        name: "useEffect",
        filePath: "src/Bad.tsx",
        riskScore: 8,
        issues: [{ ruleId: "no-cleanup", level: "critical" }],
      },
    ];

    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(report));

    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit");
    });

    const { loadConfig } = require("../config/loadConfig");
    loadConfig.mockReturnValue({
      rules: {},
      thresholds: { failOnCritical: true },
      suspiciousCalls: [],
    });

    expect(() => summarizeReport(mockJsonPath)).toThrow("process.exit");
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("should trigger threshold failure on score above threshold", () => {
    const report = [
      {
        name: "useEffect",
        filePath: "src/Bad.tsx",
        riskScore: 8,
        issues: [{ ruleId: "no-cleanup", level: "critical" }],
      },
    ];

    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(report));

    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit");
    });

    const { loadConfig } = require("../config/loadConfig");
    loadConfig.mockReturnValue({
      rules: {},
      thresholds: { failOnScore: 1 },
      suspiciousCalls: [],
    });

    expect(() => summarizeReport(mockJsonPath)).toThrow("process.exit");
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
