# Clean-Room Compliance Strategy

**Assessment Date**: 2026-05-20
**Phase**: 1 - Assessment & Prerequisites
**Status**: Complete

## Purpose

This document defines the clean-room implementation strategy for migrating
functionality from `.vi-history-suite` to the MIT `vi-history` repository.

---

## Core Principles

### Principle 1: Requirements-First Implementation

All implementation MUST originate from documented requirements:

```
docs/requirements/imports/{feature}/   ← Source of truth
  ├── manifest.json                    ← Feature metadata
  ├── syrs.md                          ← System requirements
  ├── srs.md                           ← Software requirements
  ├── rtm.csv                          ← Requirements traceability
  └── test-plan.md                     ← Verification strategy
```

**Workflow:**
1. Import requirements slice from suite's dual-authority bridge
2. Create Spec Kit feature under `.specify/specs/{feature}/`
3. Lock `spec.md`, `plan.md`, `tasks.md` before implementation
4. Implement from specs only, never from suite source code

### Principle 2: API Surface Derivation

Public API surfaces MAY be derived from requirements:
- Interface shapes: ✅ Derive from requirement behavior descriptions
- Function signatures: ✅ Derive from requirement inputs/outputs
- Implementation logic: ❌ Must be independently designed

**Example:**
```typescript
// Requirements say: "Detect VI file by reading magic bytes at offset 8"
// Derive interface from requirement, NOT from suite source:

interface ViMagicOptions {
  strictRsrcHeader?: boolean;  // From VHS-REQ-xxx about strict validation
}

function detectViSignature(
  bytes: Uint8Array,           // From requirement: input is byte array
  options?: ViMagicOptions     // From requirement: optional validation mode
): 'LVIN' | 'LVCC' | undefined // From requirement: returns signature or undefined
```

### Principle 3: Forbidden Patterns

The following patterns are PROHIBITED:

| Pattern | Reason | Enforcement |
|---------|--------|-------------|
| Direct code copying | Copyright violation | `check-clean-room-boundary.mjs` |
| Private path references | Suite-specific infrastructure | CI boundary scan |
| Suite repository references | Leaks implementation authority | CI boundary scan |
| Proprietary license markers | License incompatibility | CI boundary scan |
| Developer-specific logic | Not generalizable | Code review |

### Principle 4: Incremental Admission

Each feature requires formal admission:

```
docs/requirements/admissions/{feature}/
  ├── {feature}.json                   ← Slice admission record
  ├── {feature}.md                     ← Human-readable admission
  └── IAU-{iau-id}-v1.json            ← Implementation Admission Unit
```

---

## Component-by-Component Strategy

### Domain Layer (viMagicCore, viFile, viMagic)

**Clean-Room Strategy:** Full re-implementation from VHS-REQ-095, VHS-REQ-096

| Component | Derivation Source | Complexity |
|-----------|-------------------|------------|
| `VI_MAGIC_OFFSET` | Requirement: "offset 8" | Trivial |
| `VI_MAGIC_LENGTH` | Requirement: "4-byte signature" | Trivial |
| `detectViSignature()` | Requirement: "detect LVIN or LVCC" | Low |
| File I/O wrappers | Node.js fs/promises docs | Low |

**New IAU Required:** `IAU-vi-magic-detection-v1`

### Services Layer (viHistoryModel, viHistoryService)

**Clean-Room Strategy:** Re-implement from VHS-REQ-532, VHS-REQ-543, VHS-REQ-546

| Component | Derivation Source | Complexity |
|-----------|-------------------|------------|
| `ViHistoryCommit` | Git log output format | Low |
| `ViHistoryWindow` | Pagination requirements | Low |
| `ViHistoryViewModel` | UI data requirements | Medium |
| `ViHistoryService` | Orchestration requirements | Medium |

**New IAU Required:** `IAU-vi-history-service-model-v1`

### Git Integration Layer (gitApi, gitCli)

**Clean-Room Strategy:** Re-implement from public Git CLI documentation

| Component | Derivation Source | Complexity |
|-----------|-------------------|------------|
| `runGit()` | Node.js child_process docs | Low |
| History parsing | Git log --format documentation | Low |
| VS Code Git API | Official VS Code API docs | Low |

**New IAU Required:** `IAU-git-integration-layer-v1`

### Indexing Layer (viEligibilityIndexer)

**Clean-Room Strategy:** Re-implement from VHS-REQ-550 and generic patterns

| Component | Derivation Source | Complexity |
|-----------|-------------------|------------|
| Concurrent traversal | Generic async pattern | Medium |
| Cache management | Standard caching patterns | Medium |
| VS Code event binding | VS Code API documentation | Low |

**New IAU Required:** `IAU-vi-eligibility-indexer-v1`

### UI Layer (historyPanel, historyPanelTracker)

**Clean-Room Strategy:** Re-implement from VS Code Webview API docs

| Component | Derivation Source | Complexity |
|-----------|-------------------|------------|
| Panel tracker | Generic observer pattern | Low |
| Message protocol | VS Code postMessage API | Low |
| HTML rendering | Standard webview patterns | High |

**New IAU Required:** `IAU-history-panel-webview-v1`

### Reporting Layer

**Clean-Room Strategy:** Re-implement from VHS-REQ-095, VHS-REQ-096, VHS-REQ-551

| Component | Derivation Source | Complexity |
|-----------|-------------------|------------|
| Runtime locator | Platform documentation (Registry, paths) | High |
| Command planning | LabVIEW CLI public documentation | Medium |
| Process execution | Node.js child_process patterns | High |
| Preflight validation | Requirements specifications | Medium |

**New IAUs Required:**
- `IAU-comparison-runtime-locator-v1`
- `IAU-comparison-report-action-v1`
- `IAU-comparison-report-execution-v1`

---

## Verification Strategy

### CI Boundary Checks

The existing `scripts/check-clean-room-boundary.mjs` enforces:

```javascript
const forbidden = [
  "/" + "home/" + "sergio",           // Private paths
  ".co" + "dex",                       // Private tooling
  "repo-" + "standards-review",        // Private evidence
  "project-" + "access-token",         // Credentials
  "vi-history-suite" + ".git"          // Suite repository
];
```

### Pre-Commit Validation

```bash
npm run validate
# Runs:
# 1. npm run unit                      - Test compliance
# 2. node scripts/validate-spec-kit-imports.mjs - Spec Kit validation
# 3. node scripts/check-clean-room-boundary.mjs - Boundary scan
```

### Code Review Gates

Pull requests MUST verify:
1. [ ] No direct suite source code copying
2. [ ] Implementation matches locked specs
3. [ ] New code passes boundary scan
4. [ ] Requirement traceability maintained

---

## Risk Mitigation

### Risk 1: Accidental Code Copying

**Mitigation:**
- CI boundary scan on every commit
- Required code review for all PRs
- Clear documentation of forbidden patterns

### Risk 2: API Surface Drift

**Mitigation:**
- Lock specs before implementation
- Version all requirement imports
- Maintain RTM (Requirements Traceability Matrix)

### Risk 3: License Incompatibility

**Mitigation:**
- All implementation under MIT license
- No external dependencies with incompatible licenses
- Document all third-party patterns used

---

## Timeline Integration

| Phase | Clean-Room Activities | Duration |
|-------|----------------------|----------|
| Phase 1 | Audit complete, strategy documented | ✅ Complete |
| Phase 2 | Create IAUs for domain/services/git | 2-3 weeks |
| Phase 2 | Re-implement from requirements | 4-6 weeks |
| Phase 3 | Create IAUs for UI components | 2 weeks |
| Phase 3 | Re-implement webview surfaces | 4-6 weeks |
| Phase 4-5 | Create IAUs for reporting/CLI | 2-3 weeks |
| Phase 4-5 | Re-implement from requirements | 6-8 weeks |
| Phase 7 | Validation and documentation | Ongoing |

---

## Approval

This strategy aligns with:
- `.specify/memory/constitution.md` - Core principles I-V
- `docs/governance/marketplace-posture.md` - VSIX-only scope
- `docs/decisions/ADR-001-marketplace-publication-disabled.md`
- `docs/decisions/ADR-002-vsix-packaging-artifact-only.md`
