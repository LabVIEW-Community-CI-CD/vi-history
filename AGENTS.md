<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->

# Repository Guidance

This repository is the MIT clean-room Spec Kit implementation authority for
`svelderrainruiz.vi-history`.

Use imported requirements under `docs/requirements/imports/` and Spec Kit
artifacts as the authority for feature work. Do not copy implementation source,
private evidence, local control-plane scripts, or credential handling from any
other VI History product line.

The integration branch is `develop`; feature work targets `develop` before
promotion to `main`.

Marketplace publication is disabled. The governing decision is recorded in
`docs/decisions/ADR-001-marketplace-publication-disabled.md` (closed under
Issue #5). A future ADR or bridge admission must explicitly supersede that
decision before any Marketplace work is started.

Implementation for `runtime-contract-host-provider-v1` is complete. All admitted
tasks (T007–T030) were implemented and closed under Issue #4. No current
Implementation Admission Unit is active. Future implementation work requires a
new bridge admission record before code changes begin.

For Copilot local or web implementation work, read
`docs/development/copilot-workflow.md` before changing code. It names the
current public source files, admitted task scope, blocked scope, and validation
commands.

When running generated Spec Kit helpers from a governed `codex/...` branch, set
both environment variables so branch validation resolves the pinned feature:

```bash
SPECIFY_FEATURE=001-runtime-contract-host-provider-v1 \
SPECIFY_FEATURE_DIRECTORY=.specify/specs/runtime-contract-host-provider-v1 \
.specify/scripts/bash/check-prerequisites.sh --json --paths-only
```
