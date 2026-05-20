# VI History Suite Component Audit

**Assessment Date**: 2026-05-20
**Phase**: 1 - Assessment & Prerequisites
**Status**: Complete

## Executive Summary

This document provides a comprehensive audit of the `.vi-history-suite`
directory to identify MIT-compatible components that can be re-implemented in
the clean-room `vi-history` repository.

### Key Findings

| Layer | Files | LOC | MIT Reusable | Complexity |
|-------|-------|-----|--------------|------------|
| Domain | 3 | ~200 | ✅ 100% | Low |
| Services | 2 | ~260 | ⚠️ 60% | Medium |
| Git | 2 | ~260 | ✅ 100% | Low |
| Indexing | 1 | ~540 | ✅ 70% | Medium |
| UI | 2 | ~40KB | ⚠️ 40% | High |
| Reporting | 8 | ~9,500 | ✅ 80% | High |

**Overall Verdict**: ~70% of the suite's public API surface can be safely
re-implemented under MIT license through clean-room design from requirements.

---

## 1. Domain Layer (`src/domain/`)

### Files
- `viMagicCore.ts` - Core VI magic byte detection algorithm
- `viFile.ts` - Node.js filesystem operations for VI files
- `viMagic.ts` - VS Code integration layer for VI detection

### Exports

| Export | Type | MIT-Safe |
|--------|------|----------|
| `VI_MAGIC_OFFSET` | Constant | ✅ |
| `VI_MAGIC_LENGTH` | Constant | ✅ |
| `ViSignature` | Type | ✅ |
| `ViMagicOptions` | Interface | ✅ |
| `detectViSignature()` | Function | ✅ |
| `readViProbeBytesFromFsPath()` | Function | ✅ |
| `detectViSignatureFromFsPath()` | Function | ✅ |
| `readViProbeBytes()` | Function | ✅ |
| `detectViSignatureFromUri()` | Function | ✅ |
| `isLabviewViByMagic()` | Function | ✅ |

### Dependencies
- **External**: `vscode` (extension API only)
- **Node.js**: `node:fs/promises`
- **NPM**: None

### MIT Compatibility: ✅ 100%
- Pure algorithmic logic (4-line byte comparison)
- No proprietary binary format parsing
- Standard Node.js file I/O patterns

---

## 2. Services Layer (`src/services/`)

### Files
- `viHistoryModel.ts` - Data models for VI history
- `viHistoryService.ts` - Service orchestrator

### Exports

| Export | Type | MIT-Safe |
|--------|------|----------|
| `ViHistoryCommit` | Interface | ✅ |
| `ViHistorySurfaceCapabilities` | Interface | ⚠️ |
| `ViHistoryWindow` | Interface | ✅ |
| `ViHistoryViewModel` | Interface | ✅ |
| `ViHistoryModelOptions` | Interface | ✅ |
| `ViEligibilitySnapshot` | Interface | ✅ |
| `evaluateViEligibilityForFsPath()` | Function | ⚠️ |
| `loadViHistoryViewModelFromFsPath()` | Function | ⚠️ |
| `DEFAULT_MAX_HISTORY_ENTRIES` | Constant | ✅ |
| `AUTO_HISTORY_ENTRY_CEILING` | Constant | ✅ |
| `ViHistoryServiceSettings` | Interface | ✅ |
| `getViHistoryServiceSettings()` | Function | ✅ |
| `selectMostSpecificGitRepositoryRoot()` | Function | ✅ |
| `ViHistoryService` | Class | ✅ |

### Dependencies
- **External**: `vscode`
- **Node.js**: `node:path`
- **Internal**: `../domain/*`, `../git/*`, `../support/*`

### MIT Compatibility: ⚠️ 60%
- Data models and service orchestration: ✅ Fully reusable
- Comparison capabilities: ⚠️ Depends on LabVIEW-specific tooling
- Repository support classification: ⚠️ May contain proprietary patterns

---

## 3. Git Integration Layer (`src/git/`)

### Files
- `gitApi.ts` - VS Code Git extension integration
- `gitCli.ts` - Git CLI wrapper utilities

### Exports

| Export | Type | MIT-Safe |
|--------|------|----------|
| `GitRepository` | Interface | ✅ |
| `GitApi` | Interface | ✅ |
| `hasGitApiFactory()` | Function | ✅ |
| `getBuiltInGitApi()` | Function | ✅ |
| `GitHistoryEntry` | Interface | ✅ |
| `RunGitOptions` | Interface | ✅ |
| `runGit()` | Function | ✅ |
| `resolveGitTimeoutMs()` | Function | ✅ |
| `resolveGitExecutable()` | Function | ✅ |
| `getWindowsGitExecutableCandidates()` | Function | ✅ |
| `normalizeRelativeGitPath()` | Function | ✅ |
| `parseLsFilesZ()` | Function | ✅ |
| `parseCommitHashes()` | Function | ✅ |
| `parseHistoryEntries()` | Function | ✅ |
| `getRepoHead()` | Function | ✅ |
| `getRepoRoot()` | Function | ✅ |
| `getRepoRemoteUrl()` | Function | ✅ |
| `listTrackedFiles()` | Function | ✅ |
| `getFileCommitHashes()` | Function | ✅ |
| `getFileHistoryEntries()` | Function | ✅ |
| `getFileHistoryCount()` | Function | ✅ |

### Dependencies
- **External**: `vscode` (types only)
- **Node.js**: `node:child_process`, `node:fs`, `node:path`
- **NPM**: None

### MIT Compatibility: ✅ 100%
- Pure git CLI wrapper utilities
- Standard process spawning patterns
- Documented VS Code extension APIs

---

## 4. Indexing Layer (`src/indexing/`)

### Files
- `viEligibilityIndexer.ts` - Repository eligibility indexing

### Exports

| Export | Type | MIT-Safe |
|--------|------|----------|
| `ViEligibilityIndexer` | Class | ✅ |
| `EligibilityDebugSnapshot` | Interface | ✅ |
| `buildCacheKey()` | Function | ✅ |
| `contextKeysForUri()` | Function | ✅ |
| `getStrictHeaderSetting()` | Function | ✅ |
| `getConfiguredConcurrency()` | Function | ✅ |
| `forEachConcurrent()` | Function | ✅ |
| `resolveIndexedRepositories()` | Function | ✅ |
| `isRepositoryRelevantToWorkspace()` | Function | ✅ |

### Dependencies
- **External**: `vscode`
- **Node.js**: `node:path`
- **Internal**: `../git/*`, `../services/*`

### MIT Compatibility: ✅ 70%
- Core indexing algorithms: ✅ Fully reusable
- VS Code UI bindings (StatusBar, Progress): ❌ VS Code-specific
- Debounced refresh logic: ✅ Generic patterns

---

## 5. UI Layer (`src/ui/`)

### Files
- `historyPanel.ts` - HTML rendering and webview logic (~38KB)
- `historyPanelTracker.ts` - State tracking for panels (~1KB)

### Exports

| Export | Type | MIT-Safe |
|--------|------|----------|
| `HistoryPanelTracker` | Class | ✅ |
| `HistoryPanelMessage` | Interface | ✅ |
| `DashboardPanelMessage` | Interface | ✅ |
| `DocumentationPanelMessage` | Interface | ✅ |
| `HistoryPanelActionSummary` | Interface | ❌ |
| `DashboardArtifactActionSummary` | Interface | ❌ |
| `OpenedHistoryPanelSummary` | Interface | ✅ |
| `OpenedDashboardPanelSummary` | Interface | ✅ |
| `OpenedDocumentationPanelSummary` | Interface | ✅ |
| `HistoryPanelComparePreflightState` | Interface | ❌ |
| `renderHistoryPanelHtml()` | Function | ⚠️ |
| `renderHistoryReviewPacketText()` | Function | ✅ |

### Dependencies
- **External**: `vscode`
- **Node.js**: None directly
- **Internal**: `../services/*`

### MIT Compatibility: ⚠️ 40%
- State tracking patterns: ✅ Generic observer pattern
- Message protocols: ✅ Generic command dispatch
- HTML rendering: ⚠️ Contains LabVIEW-specific UI elements
- Human review surfaces: ❌ Developer-specific, not generalizable

---

## 6. Reporting Layer (`src/reporting/`)

### Files (8 total, ~9,500 LOC)
- `comparisonReportAction.ts` (1,273 LOC) - Main orchestration
- `comparisonReportExecutionPlan.ts` (120 LOC) - Execution planning
- `comparisonReportPacket.ts` (619 LOC) - State persistence
- `comparisonReportPlan.ts` (246 LOC) - Command planning
- `comparisonReportPreflight.ts` (263 LOC) - Preflight validation
- `comparisonReportRuntimeExecution.ts` (3,799 LOC) - Process execution
- `comparisonRuntimeDoctor.ts` (391 LOC) - Diagnostics
- `comparisonRuntimeLocator.ts` (2,836 LOC) - Runtime discovery

### Export Summary
- **68 exported interfaces** - Domain models, execution plans
- **60+ exported functions** - Orchestration, validation, execution

### Dependencies
- **External**: `vscode`
- **Node.js**: `node:fs/promises`, `node:path`, `node:child_process`, `node:crypto`
- **NPM**: None
- **Internal**: Domain, Git, Services modules

### MIT Compatibility: ✅ 80%
- Command planning: ✅ ~90% reusable
- Preflight validation: ✅ ~85% reusable
- Runtime locating: ✅ ~70% reusable (platform-specific patterns)
- Process observation: ✅ ~75% reusable
- Execution orchestration: ✅ ~80% reusable

---

## Feature-to-Requirements Mapping

### Already Imported Requirements Slices

| Suite Feature | Imported Slice | Status |
|---------------|----------------|--------|
| VI magic detection | `runtime-contract-host-provider-v1` | ✅ Implemented |
| Command activation | `command-activation-surface-v1` | ✅ Implemented |
| Entrypoint shell | `command-handler-entrypoint-shell-v1` | ✅ Implemented |
| Documentation command | `installed-user-documentation-command-v1` | ✅ Implemented |
| Settings CLI bootstrap | `runtime-settings-cli-bootstrap-v1` | ✅ Implemented |
| Settings write | `runtime-settings-cli-settings-write-v1` | ✅ Implemented |
| Validation readback | `runtime-settings-cli-validation-readback-v1` | ✅ Implemented |
| Validation proof | `runtime-settings-cli-validation-proof-v1` | ✅ Implemented |
| Interactive selection | `runtime-settings-cli-interactive-selection-v1` | ✅ Implemented |
| Terminal entrypoint | `runtime-settings-cli-terminal-entrypoint-v1` | ✅ Implemented |
| Terminal prompt loop | `runtime-settings-cli-terminal-prompt-loop-v1` | ✅ Implemented |
| Terminal IO adapter | `runtime-settings-cli-terminal-io-adapter-v1` | ✅ Implemented |
| Proof-out | `runtime-settings-cli-validation-proof-out-v1` | ✅ Implemented |
| File emission | `runtime-settings-cli-validation-proof-out-file-emission-v1` | ✅ Implemented |
| Runtime outcome | `runtime-settings-cli-validation-runtime-outcome-v1` | ✅ Implemented |
| Command contract | `runtime-settings-cli-validation-command-contract-v1` | ✅ Implemented |
| Plan-only | `runtime-settings-cli-validation-plan-only-v1` | ✅ Implemented |
| Host preflight | `runtime-settings-cli-validation-host-runtime-preflight-v1` | ✅ Implemented |
| Preflight composition | `runtime-settings-cli-validation-host-preflight-command-composition-v1` | ✅ Implemented |
| Host discovery | `runtime-settings-cli-validation-host-runtime-discovery-v1` | ✅ Implemented |
| Observation adapter | `runtime-settings-cli-validation-host-runtime-observation-adapter-v1` | ✅ Implemented |
| Source adapter | `runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1` | ✅ Implemented |
| Source acquisition | `runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1` | ✅ Implemented |
| Native acquisition | `runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1` | ✅ Implemented |
| VSIX packaging | `extension-vsix-packaging-artifact-v1` | ✅ Implemented |

### Suite Features Requiring New IAUs

| Suite Feature | Proposed IAU | Priority |
|---------------|--------------|----------|
| VI history service | `vi-history-service-model-v1` | High |
| VI eligibility indexer | `vi-eligibility-indexer-v1` | High |
| History panel UI | `history-panel-webview-v1` | High |
| Git integration | `git-integration-layer-v1` | High |
| Panel tracker | `panel-state-tracker-v1` | Medium |
| Comparison runtime locator | `comparison-runtime-locator-v1` | Medium |
| Comparison report action | `comparison-report-action-v1` | Medium |
| Report execution | `comparison-report-execution-v1` | Low |
| Runtime doctor | `comparison-runtime-doctor-v1` | Low |

---

## Clean-Room Compliance Strategy

### Principle I: No Direct Code Copying

All re-implementation MUST follow clean-room design:
1. Read requirements from `docs/requirements/imports/`
2. Create specs in `.specify/specs/`
3. Implement from specifications only
4. Validate against imported test plans

### Principle II: Public API Surface Only

Re-implementation targets exported public APIs only:
- Interfaces and type definitions: ✅ Safe to model
- Function signatures: ✅ Safe to implement
- Implementation details: ❌ Must be independently derived

### Principle III: Dependency Isolation

Suite components with proprietary dependencies require abstraction:
- LabVIEW CLI execution: Abstract behind provider interface
- VS Code-specific bindings: Abstract for testability
- Platform-specific paths: Documented discovery patterns

---

## Technology Direction Recommendation

### Option A: Maintain Vanilla JavaScript (Current)
**Pros:**
- No build step required
- Simpler CI/CD pipeline
- Smaller runtime footprint

**Cons:**
- No type safety
- Less IDE support
- Harder to maintain large codebase

### Option B: Adopt TypeScript
**Pros:**
- Type safety across ~15,000 LOC
- Better IDE support (IntelliSense)
- Easier refactoring
- Matches suite's architecture

**Cons:**
- Requires build step
- Larger development toolchain
- Migration effort

### Recommendation: **Option B - Adopt TypeScript**

Rationale:
1. Suite provides TypeScript patterns to follow
2. Type safety critical for ~70% re-implementation scope
3. VS Code extension ecosystem is TypeScript-native
4. Existing test infrastructure supports TypeScript (Node.js test runner works)

---

## Next Steps

1. **Create IAU admission records** for new features (Phase 2 prerequisite)
2. **Establish TypeScript build pipeline** in vi-history repository
3. **Begin foundation migration** starting with domain layer
4. **Port test infrastructure** from suite patterns
