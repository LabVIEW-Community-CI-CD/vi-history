# Phase 2: Foundation Migration - Implementation Plan

**Date**: 2026-05-20
**Status**: Planning
**Prerequisite**: Phase 1 Assessment ✅ Complete

## Overview

Phase 2 establishes the foundation for suite functionality migration by:
1. Adopting TypeScript build infrastructure
2. Creating IAU admission records for foundation modules
3. Re-implementing core domain, services, and git layers

---

## Governance Prerequisites

Before implementation begins, the following governance steps are required:

### Step 1: Technology Direction Decision
- [ ] Review `docs/development/phase1-assessment/technology-direction.md`
- [ ] Approve or reject TypeScript adoption
- [ ] Document decision in ADR if approved

### Step 2: IAU Admission Records
Each new feature requires formal admission per constitution Principle II:

| IAU | Import Packet Required | Spec Kit Feature |
|-----|----------------------|------------------|
| IAU-vi-magic-detection-v1 | New import or extend existing | `.specify/specs/vi-magic-detection-v1/` |
| IAU-git-cli-wrapper-v1 | New import | `.specify/specs/git-cli-wrapper-v1/` |
| IAU-vscode-git-api-v1 | New import | `.specify/specs/vscode-git-api-v1/` |
| IAU-vi-history-model-v1 | New import | `.specify/specs/vi-history-model-v1/` |
| IAU-vi-history-service-v1 | New import | `.specify/specs/vi-history-service-v1/` |
| IAU-vi-eligibility-indexer-v1 | New import | `.specify/specs/vi-eligibility-indexer-v1/` |

---

## Implementation Timeline

### Week 1-2: TypeScript Infrastructure

**Tasks:**
1. Add TypeScript to devDependencies
2. Create `tsconfig.json` with proper ES module configuration
3. Update `package.json` scripts for compilation
4. Test compilation pipeline
5. Update CI workflow for build step

**Files to Create/Modify:**
- `tsconfig.json` (new)
- `package.json` (update devDependencies and scripts)
- `.github/workflows/spec-gates.yml` (add compile step)

### Week 3-4: Foundation IAUs

**Tasks:**
1. Create admission records for each foundation IAU
2. Draft Spec Kit features (`spec.md`, `plan.md`, `tasks.md`)
3. Lock specifications before implementation

**Directories to Create:**
```
docs/requirements/imports/
├── vi-magic-detection-v1/
├── git-cli-wrapper-v1/
├── vscode-git-api-v1/
├── vi-history-model-v1/
├── vi-history-service-v1/
└── vi-eligibility-indexer-v1/

docs/requirements/admissions/
├── vi-magic-detection-v1.json
├── git-cli-wrapper-v1.json
├── vscode-git-api-v1.json
├── vi-history-model-v1.json
├── vi-history-service-v1.json
└── vi-eligibility-indexer-v1.json

.specify/specs/
├── vi-magic-detection-v1/
├── git-cli-wrapper-v1/
├── vscode-git-api-v1/
├── vi-history-model-v1/
├── vi-history-service-v1/
└── vi-eligibility-indexer-v1/
```

### Week 5-6: Domain Layer Implementation

**Tasks:**
1. Migrate existing `.mjs` files to `.ts`
2. Implement VI magic detection from specifications
3. Implement git CLI wrapper from specifications
4. Add unit tests for new modules
5. Validate clean-room boundary compliance

**Source Files:**
```
src/
├── domain/
│   ├── viMagicCore.ts       # From IAU-vi-magic-detection-v1
│   ├── viFile.ts            # From IAU-vi-magic-detection-v1
│   └── viMagic.ts           # From IAU-vi-magic-detection-v1
├── git/
│   ├── gitCli.ts            # From IAU-git-cli-wrapper-v1
│   └── gitApi.ts            # From IAU-vscode-git-api-v1
├── extension.ts             # Migrated from extension.mjs
├── runtime-settings-cli.ts  # Migrated from runtime-settings-cli.mjs
└── ...                      # Other migrated files
```

### Week 7-8: Services Layer Implementation

**Tasks:**
1. Implement VI history model from specifications
2. Implement VI history service from specifications
3. Implement eligibility indexer from specifications
4. Add unit tests for service layer
5. Integration testing with domain layer

**Source Files:**
```
src/
├── services/
│   ├── viHistoryModel.ts    # From IAU-vi-history-model-v1
│   └── viHistoryService.ts  # From IAU-vi-history-service-v1
└── indexing/
    └── viEligibilityIndexer.ts  # From IAU-vi-eligibility-indexer-v1
```

---

## Risk Management

| Risk | Mitigation |
|------|------------|
| TypeScript build breaks CI | Add compilation before test in CI |
| Module resolution issues | Use NodeNext with ES modules |
| Clean-room boundary violations | Run boundary check before each commit |
| Specification gaps | Clarify before implementation per Principle II |
| Test coverage gaps | Port existing tests alongside migration |

---

## Success Criteria

### TypeScript Infrastructure
- [ ] `npm run compile` succeeds without errors
- [ ] `npm test` passes all existing tests
- [ ] CI workflow includes build step
- [ ] No runtime regressions

### Domain Layer
- [ ] VI magic detection passes all unit tests
- [ ] Git CLI wrapper passes all unit tests
- [ ] VS Code Git API integration working
- [ ] Clean-room boundary check passes

### Services Layer
- [ ] History model correctly loads from filesystem
- [ ] History service orchestrates correctly
- [ ] Eligibility indexer scans workspaces
- [ ] All layers integrate without errors

---

## Exit Criteria for Phase 2

1. All 6 foundation IAUs admitted and implemented
2. TypeScript build infrastructure operational
3. Existing functionality preserved (no regressions)
4. All tests passing with TypeScript source
5. Clean-room boundary compliance verified

---

## Dependencies on External Decisions

- [ ] **Decision Required**: TypeScript adoption approval
- [ ] **Decision Required**: New import packet structure approval
- [ ] **Decision Required**: Spec Kit feature naming conventions

---

## Next Phase Preview

**Phase 3: Extension UI & Commands** will build upon Phase 2 foundation:
- History panel webview implementation
- Panel state tracking
- Command handler wiring with actual logic
- Context menu integrations
