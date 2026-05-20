# New Implementation Admission Units Required

**Assessment Date**: 2026-05-20
**Phase**: 1 - Assessment & Prerequisites
**Status**: Complete

## Purpose

This document identifies new Implementation Admission Units (IAUs) required to
migrate functionality from `.vi-history-suite` to `vi-history`. Each IAU
represents a bounded scope of work that requires formal admission before
implementation.

---

## Existing IAUs (Already Implemented)

The repository already has 25+ implemented IAUs covering:

| Category | Implemented IAUs |
|----------|------------------|
| Runtime Contract | `IAU-runtime-contract-proof-intake-v1` |
| Command Activation | `IAU-command-activation-manifest-contract-v1` |
| Entrypoint Shell | `IAU-command-handler-entrypoint-shell-v1` |
| Documentation | `IAU-documentation-command-panel-shell-v1` |
| CLI Bootstrap | `IAU-runtime-settings-cli-prepare-command-shell-v1` |
| Settings Write | `IAU-runtime-settings-cli-settings-write-contract-v1` |
| Validation | 15+ validation-related IAUs |
| VSIX Packaging | `IAU-extension-vsix-packaging-artifact-v1` |

---

## New IAUs Required

### Priority 1: Foundation Layer (Phase 2)

#### IAU-vi-magic-detection-v1

**Scope:** VI file magic byte detection algorithm

**Requirements Coverage:**
- VHS-REQ-095: Windows registry view observations
- VHS-REQ-096: Linux documented root observations

**Components:**
- `detectViSignature()` - Core detection algorithm
- `readViProbeBytes()` - File I/O abstraction
- `isLabviewViByMagic()` - Boolean helper

**Dependencies:** None (leaf module)

**Complexity:** Low (~100 LOC)

---

#### IAU-git-cli-wrapper-v1

**Scope:** Git CLI subprocess wrapper

**Requirements Coverage:**
- VHS-REQ-532: Selected host facts
- Git history traversal requirements

**Components:**
- `runGit()` - Process spawning wrapper
- `getRepoHead()` - HEAD resolution
- `getRepoRoot()` - Repository root detection
- `getFileHistoryEntries()` - History parsing
- `listTrackedFiles()` - File enumeration

**Dependencies:** Node.js child_process

**Complexity:** Low (~200 LOC)

---

#### IAU-vscode-git-api-v1

**Scope:** VS Code Git extension integration

**Requirements Coverage:**
- VS Code Git API documentation
- Repository lifecycle events

**Components:**
- `GitRepository` interface
- `GitApi` interface
- `getBuiltInGitApi()` - Extension discovery
- Repository state change listeners

**Dependencies:** VS Code Extension API

**Complexity:** Low (~100 LOC)

---

### Priority 2: Services Layer (Phase 2)

#### IAU-vi-history-model-v1

**Scope:** VI history data models

**Requirements Coverage:**
- VHS-REQ-543: Effective target reporting
- VHS-REQ-546: Runtime outcome facts

**Components:**
- `ViHistoryCommit` interface
- `ViHistoryWindow` interface
- `ViHistoryViewModel` interface
- `ViHistoryModelOptions` interface
- `loadViHistoryViewModelFromFsPath()` - Model factory

**Dependencies:** IAU-vi-magic-detection-v1, IAU-git-cli-wrapper-v1

**Complexity:** Medium (~200 LOC)

---

#### IAU-vi-history-service-v1

**Scope:** VI history service orchestrator

**Requirements Coverage:**
- Service layer abstraction requirements

**Components:**
- `ViHistoryService` class
- `ViHistoryServiceSettings` interface
- `getViHistoryServiceSettings()` - Configuration reader
- `selectMostSpecificGitRepositoryRoot()` - Repository resolver

**Dependencies:** IAU-vi-history-model-v1, IAU-vscode-git-api-v1

**Complexity:** Medium (~100 LOC)

---

### Priority 3: Indexing Layer (Phase 2-3)

#### IAU-vi-eligibility-indexer-v1

**Scope:** Repository eligibility indexing

**Requirements Coverage:**
- VHS-REQ-550: Mixed bitness host bundle
- Workspace scanning requirements

**Components:**
- `ViEligibilityIndexer` class
- `EligibilityDebugSnapshot` interface
- `forEachConcurrent()` - Concurrent traversal
- `resolveIndexedRepositories()` - Repository resolution
- Cache management and invalidation

**Dependencies:** IAU-vi-history-model-v1, IAU-vscode-git-api-v1

**Complexity:** Medium (~400 LOC)

---

### Priority 4: UI Layer (Phase 3)

#### IAU-history-panel-tracker-v1

**Scope:** Panel state tracking

**Requirements Coverage:**
- Panel lifecycle management
- Message dispatch patterns

**Components:**
- `HistoryPanelTracker` class
- `HistoryPanelMessage` interface
- `OpenedHistoryPanelSummary` interface
- Panel open/close tracking
- Message dispatch to active panels

**Dependencies:** None (infrastructure)

**Complexity:** Low (~200 LOC)

---

#### IAU-history-panel-webview-v1

**Scope:** History panel webview rendering

**Requirements Coverage:**
- VS Code Webview API documentation
- UI presentation requirements

**Components:**
- `renderHistoryPanelHtml()` - HTML generation
- Panel creation and lifecycle
- Message handling from webview
- Theme-aware styling

**Dependencies:** IAU-history-panel-tracker-v1, IAU-vi-history-model-v1

**Complexity:** High (~2,000 LOC)

---

### Priority 5: Reporting Layer (Phase 4)

#### IAU-comparison-runtime-locator-v1

**Scope:** LabVIEW runtime discovery

**Requirements Coverage:**
- VHS-REQ-095: Windows registry view
- VHS-REQ-096: Linux documented root
- VHS-REQ-551: Source surface probe

**Components:**
- `locateComparisonRuntime()` - Main locator
- Platform-specific discovery (Windows, Linux, macOS)
- Registry query abstraction (Windows)
- Path validation and verification
- Version detection

**Dependencies:** IAU-vi-history-model-v1

**Complexity:** High (~2,000 LOC)

---

#### IAU-comparison-report-preflight-v1

**Scope:** Comparison preflight validation

**Requirements Coverage:**
- Runtime validation requirements
- Preflight check patterns

**Components:**
- `runComparisonReportPreflight()` - Preflight validation
- Runtime availability checks
- Permission verification
- Workspace trust validation

**Dependencies:** IAU-comparison-runtime-locator-v1

**Complexity:** Medium (~300 LOC)

---

#### IAU-comparison-report-plan-v1

**Scope:** Comparison command planning

**Requirements Coverage:**
- LabVIEW CLI command patterns
- Report generation requirements

**Components:**
- `buildComparisonReportPlan()` - Plan builder
- CLI argument composition
- Output path planning
- Artifact archival planning

**Dependencies:** IAU-comparison-runtime-locator-v1

**Complexity:** Medium (~300 LOC)

---

#### IAU-comparison-report-execution-v1

**Scope:** Comparison process execution

**Requirements Coverage:**
- Process observation requirements
- Timeout and cancellation

**Components:**
- `executeComparisonReport()` - Process runner
- Output capture and parsing
- Progress reporting
- Error handling and recovery

**Dependencies:** IAU-comparison-report-plan-v1

**Complexity:** High (~3,000 LOC)

---

#### IAU-comparison-report-action-v1

**Scope:** Comparison action orchestrator

**Requirements Coverage:**
- End-to-end comparison workflow

**Components:**
- `createComparisonReportAction()` - Action factory
- Preflight → Plan → Execute → Archive flow
- User notification
- Result presentation

**Dependencies:** All comparison IAUs

**Complexity:** High (~1,200 LOC)

---

### Priority 6: Runtime Execution Layer (Phase 6)

#### IAU-runtime-execution-host-labviewcli-v1

**Scope:** Host LabVIEWCLI execution (already imported, not implemented)

**Import Packet:** `runtime-execution-host-native-labviewcli-v1`

**Status:** Blocked - requires LabVIEW runtime availability

---

#### IAU-runtime-execution-docker-labviewcli-v1

**Scope:** Docker LabVIEWCLI execution (already imported, not implemented)

**Import Packet:** `runtime-execution-docker-labviewcli-v1`

**Status:** Blocked - requires Docker provider implementation

---

## Summary

### New IAUs by Phase

| Phase | New IAUs | Total LOC |
|-------|----------|-----------|
| Phase 2 | 6 | ~1,100 |
| Phase 3 | 2 | ~2,200 |
| Phase 4 | 5 | ~6,800 |
| Phase 6 | 2 | TBD (blocked) |
| **Total** | **15** | **~10,100** |

### Dependencies Graph

```
IAU-vi-magic-detection-v1  ←────────────────────────────────────┐
         ↓                                                      │
IAU-git-cli-wrapper-v1  ←───────────────┐                      │
         ↓                              │                      │
IAU-vscode-git-api-v1  ←────────────────┤                      │
         ↓                              │                      │
IAU-vi-history-model-v1  ←──────────────┤                      │
         ↓                              │                      │
IAU-vi-history-service-v1  ←────────────┤                      │
         ↓                              │                      │
IAU-vi-eligibility-indexer-v1           │                      │
         ↓                              │                      │
IAU-history-panel-tracker-v1            │                      │
         ↓                              │                      │
IAU-history-panel-webview-v1            │                      │
                                        │                      │
IAU-comparison-runtime-locator-v1  ←────┴──────────────────────┘
         ↓
IAU-comparison-report-preflight-v1
         ↓
IAU-comparison-report-plan-v1
         ↓
IAU-comparison-report-execution-v1
         ↓
IAU-comparison-report-action-v1
```

---

## Next Steps

1. Create import packets for new requirement slices
2. Draft Spec Kit features for each IAU
3. Establish implementation order based on dependencies
4. Begin Phase 2 with foundation IAUs
