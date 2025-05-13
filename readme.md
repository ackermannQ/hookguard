# 🧠 HookGuard — Auditing Hook Behavior in React Codebases

HookGuard is a powerful developer tool designed to detect unsafe, complex, or undocumented behaviors in React hooks — both built-in and custom. It helps teams maintain scalable, clean, and predictable component logic by uncovering patterns that often lead to bugs, performance issues, or architectural rot.

---

## 🚀 Project Objective

**Goal:** Provide visibility and control over the complexity of React components and hooks.  
HookGuard identifies:

- Hooks with uncleaned side effects
- Repeated, nested, or coupled network calls
- Shared logic with hidden state dependencies
- Custom hooks doing more than advertised
- Inconsistent or conditional hook usage

---

## 📅 Development Timeline

### 🧪 Week 1: MVP & Core Engine

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

### 🧠 Week 2–3: Rule Engine & Scoring System

- [x] Modular rule engine (Chain of Responsibility)
- [x] Detection rules:
  - Missing cleanup
  - Conditioned hook execution
  - Unsafe network call without cancellation
  - Excessive setState or context mutation
- [x] Risk scoring system per hook
- [ ] Summary dashboard per file/component
- [ ] Basic file-based caching of scan results (for performance)

### 🔁 Week 4: CI / Git Integration

- [ ] GitHub Action: run HookGuard on PRs
- [ ] PR comment with summary of risks
- [ ] Risk diffing: new vs. resolved hook issues
- [ ] Badge for "clean hooks"
- [ ] Config file support (`hookguard.config.ts`)

> _(Optional backend/database integration to persist reports per branch or commit, store diffs and long-term analytics)_

### 🖼️ Week 5–6: UI & Visualization Layer

- [ ] React web UI for browsing reports
- [ ] Hook graph: links between components and state
- [ ] Filtering by severity, module, team
- [ ] Export to Notion/Markdown/CSV
- [ ] Caching layer (Redis or local FS-based) for fast reloads and diff views

> _(Requires lightweight backend API to serve cache and persistent report data)_

### 💡 Week 7–8: IntelliSense & On-the-fly Detection

- [ ] VS Code extension (or Language Server) to:
  - Highlight risky hook usage as you type
  - Auto-suggest cleanup patterns
  - Provide tooltip summaries for custom hooks
- [ ] Optional integration with ESLint for live feedback

> _(Requires bundling a local lightweight engine or pre-built ruleset into the extension)_

### 📊 Week 9–10: Insights & Intelligence

- [ ] Time-based tracking of risk accumulation
- [ ] Suggested refactor targets (e.g. extract effect)
- [ ] Historical snapshots per branch or tag
- [ ] Visualization of "hot files"

> _(Requires lightweight database or file-backed store for snapshots)_

### 🌐 Week 11–12: Framework Extension & Custom Rules

- [ ] Support for Vue 3 `setup()` + Composition API
- [ ] Plugin system for custom rules
- [ ] LLM-assisted refactoring suggestion
- [ ] Community rule library
- [ ] Self-hosted UI dashboard (Docker-ready)

---

## 🧱 Core Architecture

- **CLI**: Entry point, options parser
- **Scanner**: File system + AST parser
- **HookNode**: Internal model (hook metadata + diagnostics)
- **Rule Engine**: Modular rule executor
- **Report Formatter**: Markdown/JSON builders
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
