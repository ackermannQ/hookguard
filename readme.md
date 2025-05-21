# 🧠 HookGuard — Auditing Hook Behavior in React Codebases

HookGuard is a powerful developer tool designed to detect unsafe, complex, or undocumented behaviors in React hooks — both built-in and custom. It helps teams maintain scalable, clean, and predictable component logic by uncovering patterns that often lead to bugs, performance issues, or architectural rot.

You can learn more about HookGuard in this [blog post](https://www.kodereview.com/hookguard/).

![HookGuard](image.png)

## 🚀 Project Objective

**Goal:** Provide visibility and control over the complexity of React components and hooks.  
HookGuard identifies:

- Hooks with uncleaned side effects ✅
- Repeated, nested, or coupled network ✅
- Shared logic with hidden state dependencies ⚙️
- Custom hooks doing more than advertised ⚙️
- Inconsistent or conditional hook usage ⚙️

---

## 🛠️ CI/CD Integration

### 🤖 GitHub Action

Create a file named `.github/workflows/hookguard.yml` with the following contents:

```yaml
name: HookGuard Routine

on:
  pull_request:
    paths:
      - "src/**"
      - "**.ts"
      - "**.tsx"

jobs:
  scan:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: 20

      - name: Install dependencies
        run: |
          corepack enable
          npm install
          npm run build

      - name: Generate report from master
        run: |
          git fetch origin master
          git reset --hard  # ← supprime les fichiers modifiés
          git switch -c master-snapshot FETCH_HEAD
          npx hookguard scan ./src
          mv $(ls -t ./data/hookguard-log-*.json | head -n1) ./data/hookguard-master.json

      - name: Restore PR branch
        run: |
          git checkout ${{ github.head_ref }}

      - name: HookGuard Scan on PR
        run: |
          npx hookguard scan ./src
          mv $(ls -t ./data/hookguard-log-*.json | head -n1) ./data/hookguard-pr.json

      - name: Generate HookGuard summary (Markdown)
        run: |
          HG_MARKDOWN=1 npx hookguard report ./data/hookguard-pr.json > hookguard-summary.md

      - name: Comment HookGuard summary on PR
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          path: hookguard-summary.md
          header: hookguard-summary

      - name: Generate HookGuard diff
        run: |
          npx hookguard diff ./data/hookguard-master.json ./data/hookguard-pr.json > hookguard-diff.md

      - name: Comment HookGuard diff on PR
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          path: hookguard-diff.md
          header: hookguard-diff
```

> If you don't want to comment on the PR you can remove the corresponding step.

## 🚀 Usage

Run `hookguard scan <directory>` to scan a directory recursively for hooks.

Run `hookguard report <reportFile>` to print a summary of the scan results.

## 🎛️ Configuration – hookguard.config.ts

You can customize HookGuard's behavior by creating a `hookguard.config.ts` file in the root of your project.

Use `hookguard init .` to generate a default configuration file.

This configuration file allows you to:

- Enable or disable specific rules
- Set thresholds to fail CI on certain risk conditions
- Define custom suspicious calls to track (e.g. setSession, setGlobalState)

🧪 Example

```ts
// hookguard.config.ts
import { HookRule, RuleResult } from "./src/rules/Rule";
import { HookInfo } from "./src/scanner/hookExtractor";
import { HookGuardConfig } from "./src/config/defaultConfig";

/**
 * Fake rule for demonstration purposes
 */
export class FakeRule implements HookRule {
  id = "fake-rule";
  description = "It's a fake rule for demonstration purposes";

  appliesTo(hook: HookInfo): boolean {
    return hook.name === "useEffect";
  }

  evaluate(hook: HookInfo): RuleResult | null {
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

export const config: HookGuardConfig = {
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
```

> If the file is missing or invalid, HookGuard will fall back to default configuration.
> You can create your own set of rules by creating new classes that implement the `HookRule` interface. Don't forget to add them to the `customRules` and `rules` objects in the configuration file.

## Rules Details

## 🧠 Rule: `missing-dependency`

Detects when variables used inside the callback of a React hook (`useEffect`, `useCallback`, `useMemo`, etc.) are **missing from the dependency array**.

### ✅ Example

```tsx
useEffect(() => {
  fetchData(query);
  console.log(user.name);
}, []);
```

➡️ Will raise:  
`Missing dependencies: query, user`

---

> **Known global objects** (e.g. `console`, `Promise`, `Math`, `setTimeout`, etc.) are ignored.

---

### 🧱 Global Identifier Filtering

To avoid false positives, HookGuard uses a built-in `IGNORED_GLOBALS` set — a comprehensive list of browser and Node.js globals (e.g. `window`, `Promise`, `JSON`, etc.).

You can see it in [`src/utils/globals.ts`](.\src\rules\rulesDefinitions\missingDependency\globals.ts).

## 📅 Development Timeline

### 🧪 Day 1: MVP & Core Engine

- [x] CLI to scan a codebase: `hookguard scan ./src`
- [x] File discovery (`.ts`, `.tsx`, `.js`, `.jsx`)
- [x] AST parsing (using `ts-morph`)
- [x] Detection of:
  - `useEffect`, `useMemo`, `useCallback`
  - Custom hooks (`use*`)
- [x] Extraction of:
  - Hook name, dependencies, contents
  - Network calls (`fetch`, `axios`, etc.)
  - Global state updates
  - Cleanup function presence
- [x] JSON report output

### 🧠 Day 2–3: Rule Engine & Scoring System

- [x] Modular rule engine (Chain of Responsibility)
- [x] Detection rules:
  - Missing cleanup
  - Conditioned hook execution
  - Unsafe network call without cancellation
  - Excessive setState or context mutation
- [x] Risk scoring system per hook
- [x] Summary dashboard per file/component

### 🔁 Day 4: CI / Git Integration

- [x] GitHub Action: run HookGuard on PRs
- [x] PR comment with summary of risks
- [x] Risk diffing: new vs. resolved hook issues
- [x] Badge for "clean hooks"
- [x] Config file support (`hookguard.config.ts`)

> _(Optional backend/database integration to persist reports per branch or commit, store diffs and long-term analytics)_

### 💡 Week 2: IntelliSense & On-the-fly Detection

- [ ] VS Code extension (or Language Server) to:
  - Highlight risky hook usage as you type
  - Auto-suggest cleanup patterns
  - Provide tooltip summaries for custom hooks
- [ ] Panel to display all faulty hooks in the project

> _(Requires bundling a local lightweight engine or pre-built ruleset into the extension)_

### 🖼️ Week 3: UI & Visualization Layer

- [ ] React web UI for browsing reports
- [ ] Hook graph: links between components and state
- [ ] Filtering by severity, module, team
- [ ] Export to Notion/Markdown/CSV
- [ ] Caching layer (Redis or local FS-based) for fast reloads and diff views
- [ ] Self-hosted UI dashboard (Docker-ready)

> _(Requires lightweight backend API to serve cache and persistent report data)_

### 📊 Week 4: Insights & Intelligence

- [ ] Time-based tracking of risk accumulation
- [ ] Suggested refactor targets (e.g. extract effect)
- [ ] Historical snapshots per branch or tag
- [ ] Visualization of "hot files"
- [ ] LLM-assisted refactoring suggestion

> _(Requires lightweight database or file-backed store for snapshots)_

---

## 🧱 Core Architecture

- **CLI**: Entry point, options parser
- **Scanner**: File system + AST parser
- **HookNode**: Internal model (hook metadata + diagnostics)
- **Rule Engine**: Modular rule executor
- **Report Formatter**: JSON builders
- **UI Frontend**: Report visualizer (optional)
- **Cache**: File-based or Redis-backed for fast repeated analysis
- **Extension SDK**: For LSP or IDE plugins

---

## ✅ Use Cases

- Audit a codebase before major refactor
- Enforce hook hygiene in a growing team
- Assist onboarding by highlighting complex logic
- Justify architectural changes with risk metrics
- Detect dangerous patterns in-flight (with IDE integration)

---

## 👥 Target Users

- React developers
- Tech leads & Staff Engineers
- Architects auditing app complexity
- QA / DevEx teams supporting frontend teams

---

## 📎 License & Contribution

MIT

---

**Created by**: quack  
**Purpose**: Reveal what’s hidden in React logic — before it hurts you in production.
