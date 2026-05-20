# ADR-004: Full Suite Integration

**Status**: Accepted
**Date**: 2026-05-20
**Issue**: Full Integration of .vi-history-suite

## Context

The VI History extension has been developed in two parallel tracks:

1. **`.vi-history-suite/`**: A production-ready implementation with full feature
   coverage including VI file detection, Git integration, history panels,
   comparison reports, runtime settings CLI, benchmarking, and more. This
   codebase was developed under a proprietary license with private CI/CD
   infrastructure (GitLab, Vagrant).

2. **`vi-history` (MIT repository)**: A clean-room MIT implementation authority
   using Spec Kit governance. This repository has focused on contract-first
   development with admission-based feature gates and formal requirements
   documentation.

The clean-room boundary restriction that prevented copying implementation source
from `.vi-history-suite` has been lifted. The decision has been made to perform
a full integration of the production-ready suite into the MIT repository while:

- Converting all code to MIT license
- Adapting private infrastructure for GitHub/MIT context
- Maintaining artifact-only packaging posture (no Marketplace publication)
- Enabling previously blocked features (LabVIEWCLI, Docker, comparison execution)

## Decision

Perform a full integration of `.vi-history-suite` into the MIT `vi-history`
repository, dissolving the clean-room boundary.

### Integration Scope

The following components are integrated:

| Layer | Components |
|-------|------------|
| Domain | VI file detection, magic byte detection |
| Git | VS Code Git API wrapper, Git CLI operations |
| Services | History service, eligibility indexer |
| Reporting | Comparison reports, runtime locator |
| UI | History panel, dashboard |
| Commands | Open VI History command |
| Tooling | Runtime settings CLI, live session probes |
| Benchmark | Status indicator, benchmark runners (optional) |
| Harness | Smoke tests, decision records (optional) |

### Excluded from Integration

The following remain out of scope:

- **Private CI/CD**: GitLab pipelines, Vagrant infrastructure, private runners
- **Marketplace publication**: `vsce publish`, release tokens, Open VSX
- **Private release automation**: Release ledgers, publication scripts
- **Credential handling**: GitLab tokens, private registry credentials

### Artifact-Only Posture

Per ADR-002, this repository admits local VSIX artifact packaging only.
Marketplace publication remains blocked. The integrated codebase enables:

- Local VSIX packaging (`npm run package:vsix`)
- LabVIEWCLI execution on self-hosted runners
- Docker execution for Linux CI
- Comparison report generation

## Consequences

### Positive

- Production-ready VI History features available under MIT license
- Full test coverage from suite transferred
- Enables LabVIEWCLI and Docker execution
- Single codebase for ongoing development
- Community contributions possible under MIT

### Negative

- Large one-time migration effort
- Clean-room contract tests may need reconciliation with suite tests
- Some suite tests specific to private infrastructure must be excluded

### Migration Impact

- ~43 source files to copy and adapt
- ~45 test files to copy and adapt
- Package.json dependencies to merge
- CI workflows to update for new test infrastructure
- Documentation to update for new scope

## Alternatives Considered

**Maintain parallel codebases**: Rejected. The clean-room approach served its
purpose during initial development but is no longer needed. Maintaining two
codebases increases maintenance burden.

**Partial integration**: Considered but rejected. The components are
interdependent; partial integration would require significant interface
adaptation work without delivering full value.

**Archive suite, continue clean-room**: Rejected. The clean-room boundary
restriction has been lifted, making full integration the preferred path.
