# VI History

**VI History** is a VS Code extension for content-detected LabVIEW VI history
review in Git repositories.

## Overview

This extension enables LabVIEW developers to:

- **View VI History**: Browse the Git history of any `.vi`, `.ctl`, or `.vit`
  file with content-aware magic byte detection
- **Generate Comparison Reports**: Create structured comparison reports between
  VI versions using LabVIEW's native comparison tools
- **Configure Runtime Settings**: Use the integrated CLI to configure LabVIEW
  runtime providers (host or Docker)

## Installation

### From VSIX Artifact

Build and install the extension locally:

```bash
npm install
npm run package:vsix
# Install dist/vi-history-0.1.0.vsix in VS Code
```

### Requirements

- VS Code 1.95.0 or later
- Git installed and available in PATH
- (Optional) LabVIEW 2025+ for comparison report generation
- (Optional) Docker for containerized LabVIEW execution

## Features

### VI File Detection

The extension detects LabVIEW files by inspecting RSRC/LVIN/LVCC magic bytes,
ensuring accurate file type identification regardless of extension.

### History Panel

Right-click any `.vi`, `.ctl`, or `.vit` file and select **VI History** to
open the history panel showing all commits that modified the file.

### Comparison Reports

Select two commits in the history panel to generate a comparison report showing
the differences between VI versions.

### Runtime Settings CLI

Configure the LabVIEW runtime provider and version using the integrated CLI:

```bash
vihs --validate          # Validate current settings
vihs --provider host     # Use local LabVIEW installation
vihs --provider docker   # Use Docker container
```

## Development

### Prerequisites

- Node.js 20+
- npm 10+

### Build

```bash
npm install
npm run compile
```

### Test

```bash
npm test
```

### Package

```bash
npm run package:vsix
npm run inspect:vsix
```

## Architecture

The extension is organized into layers:

| Layer | Description |
|-------|-------------|
| `src/domain/` | VI file detection, magic byte analysis |
| `src/git/` | VS Code Git API wrapper, Git CLI operations |
| `src/services/` | History service, eligibility indexer |
| `src/reporting/` | Comparison reports, runtime locator |
| `src/ui/` | History panel, dashboard |
| `src/commands/` | Command handlers |
| `src/tooling/` | Runtime settings CLI |

## License

MIT — see [LICENSE](LICENSE)

## Governance

This repository is the MIT implementation authority for VI History.

- **Artifact-only packaging**: Local VSIX builds are enabled; Marketplace
  publication is out of scope
- **ADRs**: See `docs/decisions/` for architectural decisions
- **Integration**: See ADR-004 for full suite integration details

---

## Historical Notes

This repository was originally developed as a clean-room Spec Kit implementation
with admission-based feature gates. Per ADR-004, the production-ready
`.vi-history-suite/` codebase has been fully integrated under MIT license,
enabling the full feature set.

The following sections document the historical Spec Kit implementation phases:
implementation. Issue #120 implements and closes it through PR #121 for
T009-T016 only.
Issue #130 imports
`runtime-settings-cli-validation-host-runtime-observation-adapter-v1` and
admits
`IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1` for
T009-T016 only. Issue #130 is an admission issue and must not be reused for
implementation. Issue #132 implements and closes it through PR #133 for
T009-T016 only.
Issue #137 imports `extension-vsix-packaging-artifact-v1` and admits
`IAU-extension-vsix-packaging-artifact-v1` for local VSIX package artifact
creation and inspection only. Issue #137 is an admission issue and must not be
reused for implementation. Issue #136 implements it through PR #138.
Issue #142 imports
`runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1`
and admits
`IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1`
for T009-T016 only. Issue #142 is an admission issue and must not be reused for
implementation. Issue #144 implements and closes it through PR #145.
Issue #148 imports
`runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1`
and admits
`IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1`
for T009-T016 only. Issue #148 is an admission issue and must not be reused for
implementation. Issue #150 implements and closes it through PR #151.
Issue #154 imports
`runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1`
and admits
`IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1`
for T009-T016 only. Issue #154 is an admission issue and must not be reused for
implementation. Issue #156 implements and closes it through PR #157.

## Authority

- Package name: `vi-history`
- Display name: `VI History`
- Publisher: `svelderrainruiz`
- Extension ID: `svelderrainruiz.vi-history`
- License: MIT
- Version: `0.1.0`
- VSIX packaging: local artifact only via `npm run package:vsix`
- Marketplace publication: out of scope for this repository

## Branch Flow

- `develop` is the integration branch for bootstrap and feature work.
- `main` is the public baseline branch.
- Feature branches target `develop` first, then `develop` promotes to `main`
  after validation is green.

## Current Status

- #1 bootstrapped the MIT Spec Kit authority.
- #2 imported `runtime-contract-host-provider-v1`.
- #3 locked the Spec Kit feature spec, plan, and tasks.
- #4 completed admitted runtime-contract IAUs through proof intake.
- #5 records the historical Marketplace-disabled posture; ADR-002 admits local
  VSIX packaging and records Marketplace publication as out of scope.
- #25 imported `installed-user-observation-public-surface-v1` as a public
  requirements/spec baseline.
- #27 implements and closes
  `IAU-installed-user-observation-model-v1`.
- Issue #30 imports `command-activation-surface-v1` as a public
  requirements/spec baseline.
- Issue #32 implements `IAU-command-activation-manifest-contract-v1` for
  T009-T012.
- Issue #36 implements and closes `IAU-command-handler-entrypoint-shell-v1` for
  T009-T011 of `command-handler-entrypoint-shell-v1`. Issue #36 must not be
  reused for new implementation.
- Issue #39 imports `installed-user-documentation-command-v1` and admits
  `IAU-documentation-command-panel-shell-v1`.
- Issue #41 implements and closes `IAU-documentation-command-panel-shell-v1`
  for T009-T011 only.
- Issue #43 imports `runtime-settings-cli-bootstrap-v1` and admits
  `IAU-runtime-settings-cli-prepare-command-shell-v1` for T009-T011 only.
- Issue #45 implements and closes
  `IAU-runtime-settings-cli-prepare-command-shell-v1` for T009-T011 only.
- Issue #47 imports `runtime-settings-cli-settings-write-v1` and admits
  `IAU-runtime-settings-cli-settings-write-contract-v1` for T009-T012 only.
  Issue #47 is an admission issue and must not be reused for implementation.
- Issue #49 implements and closes
  `IAU-runtime-settings-cli-settings-write-contract-v1` for T009-T012 only.
- Issue #51 imports `runtime-settings-cli-validation-readback-v1` and admits
  `IAU-runtime-settings-cli-validation-readback-contract-v1` for T009-T012
  only. Issue #51 is an admission issue and must not be reused for
  implementation.
- Issue #53 implements and closes
  `IAU-runtime-settings-cli-validation-readback-contract-v1` for T009-T012
  only.
- Issue #55 imports `runtime-settings-cli-validation-proof-v1` and admits
  `IAU-runtime-settings-cli-validation-proof-artifact-v1` for T009-T012 only.
  Issue #55 is an admission issue and must not be reused for implementation.
- Issue #57 implements and closes
  `IAU-runtime-settings-cli-validation-proof-artifact-v1` for T009-T012 only.
- Issue #60 imports `runtime-settings-cli-interactive-selection-v1` and admits
  `IAU-runtime-settings-cli-interactive-selection-contract-v1` for T009-T013
  only. Issue #60 is an admission issue and must not be reused for
  implementation.
- Issue #62 implements and closes
  `IAU-runtime-settings-cli-interactive-selection-contract-v1` for T009-T013
  only.
- Issue #65 imports `runtime-settings-cli-terminal-entrypoint-v1` and admits
  `IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1` for
  T009-T013 only. Issue #65 is an admission issue and must not be reused for
  implementation.
- Issue #67 implements and closes
  `IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1` for
  T009-T013 only.
- Issue #71 imports `runtime-settings-cli-terminal-prompt-loop-v1` and admits
  `IAU-runtime-settings-cli-terminal-prompt-loop-v1` for T009-T013 only.
  Issue #71 is an admission issue and must not be reused for implementation.
- Issue #73 implements and closes
  `IAU-runtime-settings-cli-terminal-prompt-loop-v1` for T009-T013 only.
- Issue #77 imports `runtime-settings-cli-terminal-io-adapter-v1` and admits
  `IAU-runtime-settings-cli-terminal-io-adapter-v1` for T009-T014 only.
  Issue #77 is an admission issue and must not be reused for implementation.
- Issue #79 implements and closes
  `IAU-runtime-settings-cli-terminal-io-adapter-v1` for T009-T014 only.
- Issue #81 imports `runtime-settings-cli-validation-proof-out-v1` and admits
  `IAU-runtime-settings-cli-validation-proof-out-v1` for T009-T014 only.
  Issue #81 is an admission issue and must not be reused for implementation.
- Issue #83 implements and closes
  `IAU-runtime-settings-cli-validation-proof-out-v1` for T009-T014 only.
- Issue #85 imports
  `runtime-settings-cli-validation-proof-out-file-emission-v1` and admits
  `IAU-runtime-settings-cli-validation-proof-out-file-emission-v1` for
  T009-T016 only. Issue #85 is an admission issue and must not be reused for
  implementation.
- Issue #87 implements and closes
  `IAU-runtime-settings-cli-validation-proof-out-file-emission-v1` for
  T009-T016 only.
- Issue #89 imports `runtime-settings-cli-validation-runtime-outcome-v1` and
  admits `IAU-runtime-settings-cli-validation-runtime-outcome-v1` for
  T009-T016 only. Issue #89 is an admission issue and must not be reused for
  implementation.
- Issue #91 implements and closes
  `IAU-runtime-settings-cli-validation-runtime-outcome-v1` for T009-T016 only.
- Issue #93 imports `runtime-settings-cli-validation-command-contract-v1` and
  admits `IAU-runtime-settings-cli-validation-command-contract-v1` for
  T009-T018 only. Issue #93 is an admission issue and must not be reused for
  implementation.
- Issue #95 implements and closes
  `IAU-runtime-settings-cli-validation-command-contract-v1` through PR #96 for
  T009-T018 only.
- Issue #99 imports `runtime-settings-cli-validation-plan-only-v1` and admits
  `IAU-runtime-settings-cli-validation-plan-only-v1` for T009-T016 only.
  Issue #99 is an admission issue and must not be reused for implementation.
- Issue #101 implements and closes
  `IAU-runtime-settings-cli-validation-plan-only-v1` for T009-T016 only.
  Issue #102 and PR #103 repair and close the final plan-only
  command-contract behavior.
- Issue #106 imports
  `runtime-settings-cli-validation-host-runtime-preflight-v1` and admits
  `IAU-runtime-settings-cli-validation-host-runtime-preflight-v1` for
  T009-T016 only. Issue #106 is an admission issue and must not be reused for
  implementation.
- Issue #108 implements and closes
  `IAU-runtime-settings-cli-validation-host-runtime-preflight-v1` through PR
  #109 for T009-T016 only.
- Issue #112 imports
  `runtime-settings-cli-validation-host-preflight-command-composition-v1` and
  admits
  `IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1`
  for T009-T016 only. Issue #112 is an admission issue and must not be reused
  for implementation.
- Issue #114 implements and closes
  `IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1`
  through PR #115 for T009-T016 only.
- Issue #118 imports
  `runtime-settings-cli-validation-host-runtime-discovery-v1` and admits
  `IAU-runtime-settings-cli-validation-host-runtime-discovery-v1` for
  T009-T016 only. Issue #118 is an admission issue and must not be reused for
  implementation.
- Issue #120 implements and closes
  `IAU-runtime-settings-cli-validation-host-runtime-discovery-v1` through PR
  #121 for T009-T016 only.
- Issue #130 imports
  `runtime-settings-cli-validation-host-runtime-observation-adapter-v1` and
  admits
  `IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1` for
  T009-T016 only. Issue #130 is an admission issue and must not be reused for
  implementation.
- Issue #132 implements and closes
  `IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1`
  through PR #133 for T009-T016 only.
- Issue #137 imports `extension-vsix-packaging-artifact-v1` and admits
  `IAU-extension-vsix-packaging-artifact-v1` for local VSIX package artifact
  creation and inspection only. Issue #137 is an admission issue and must not
  be reused for implementation.
- Issue #136 implements `IAU-extension-vsix-packaging-artifact-v1` through PR
  #138.
- Issue #142 imports
  `runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1`
  and admits
  `IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1`
  for T009-T016 only. Issue #142 is an admission issue and must not be reused
  for implementation.
- Issue #144 implements and closes
  `IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1`
  through PR #145 for T009-T016 only.
- Issue #148 imports
  `runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1`
  and admits
  `IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1`
  for T009-T016 only. Issue #148 is an admission issue and must not be reused
  for implementation.
- Issue #150 implements and closes
  `IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1`
  through PR #151 for T009-T016 only.
- Issue #154 imports
  `runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1`
  and admits
  `IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1`
  for T009-T016 only. Issue #154 is an admission issue and must not be reused
  for implementation.
- Issue #156 implements and closes
  `IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1`
  through PR #157 for T009-T016 only.

The current admission ledgers are:

- `docs/requirements/admissions/runtime-contract-host-provider-v1.json`
- `docs/requirements/admissions/installed-user-observation-public-surface-v1.json`
- `docs/requirements/admissions/command-activation-surface-v1.json`
- `docs/requirements/admissions/command-handler-entrypoint-shell-v1.json`
- `docs/requirements/admissions/installed-user-documentation-command-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-bootstrap-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-settings-write-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-validation-readback-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-validation-proof-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-interactive-selection-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-terminal-entrypoint-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-terminal-prompt-loop-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-terminal-io-adapter-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-validation-proof-out-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-validation-proof-out-file-emission-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-validation-runtime-outcome-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-validation-command-contract-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-validation-plan-only-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-validation-host-runtime-preflight-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-validation-host-preflight-command-composition-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-validation-host-runtime-discovery-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-validation-host-runtime-observation-adapter-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1.json`
- `docs/requirements/admissions/runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1.json`
- `docs/requirements/admissions/extension-vsix-packaging-artifact-v1.json`

Current Implementation Admission Unit:
`none`.

Issue #154 admission temporarily sets the current IAU to
`IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1`.
Issue #156 and PR #157 completed it. Before Issue #154 admission, the source
acquisition closeout recorded:

Current Implementation Admission Unit:
`none`.

Issue #148 admission temporarily sets the current IAU to
`IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1`.
Issue #150 and PR #151 completed it. Before Issue #148 admission, the source
adapter closeout recorded:

Current Implementation Admission Unit:
`none`.

Issue #142 admission temporarily set the current IAU to
`IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1`.
Issue #144 and PR #145 completed it. Before Issue #142 admission, the VSIX
packaging closeout recorded:

Current Implementation Admission Unit:
`none`.

Issue #130 admission temporarily set the current IAU to
`IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1`.
Issue #132 and PR #133 completed it. Before Issue #130 admission, the host
runtime discovery closeout recorded:

Current Implementation Admission Unit:
`none`.

Issue #118 admission temporarily set the current IAU to
`IAU-runtime-settings-cli-validation-host-runtime-discovery-v1`; Issue #120 and
PR #121 completed it. Before Issue #118 admission, the host preflight
command-composition closeout recorded:

Current Implementation Admission Unit:
`none`.

Issue #112 admission temporarily sets the current IAU to
`IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1`.
Issue #114 and PR #115 completed it. Before Issue #112 admission, the host
runtime preflight closeout recorded:

Current Implementation Admission Unit:
`none`.

Issue #106 admission temporarily set the current IAU to
`IAU-runtime-settings-cli-validation-host-runtime-preflight-v1`; Issue #108 and
PR #109 completed it. Before Issue #106 admission, the plan-only closeout also
recorded:

Current Implementation Admission Unit:
`none`.

The completed observation model scope is T009-T013. The command activation
manifest contract implements only T009-T012. The command handler entrypoint shell
implements T009-T011 in
`.specify/specs/command-handler-entrypoint-shell-v1/tasks.md`. The installed
user documentation command implements only T009-T011 in
`.specify/specs/installed-user-documentation-command-v1/tasks.md`. The runtime
settings CLI bootstrap implements only T009-T011 in
`.specify/specs/runtime-settings-cli-bootstrap-v1/tasks.md`: prepare-command
handler tests, launcher materialization/recovery fact tests, and the minimum
prepare-command shell. The runtime settings CLI settings-write IAU implements only
T009-T012 in
`.specify/specs/runtime-settings-cli-settings-write-v1/tasks.md`: tests for
provider/version/bitness settings mutation, preservation of unrelated settings,
fail-closed unsupported target handling, and the minimum settings-write
contract. `vihs --validate`, runtime validation, no-argument interactive
selection, compare execution, execution engines, live-session proof, packaging,
and Marketplace work remain blocked.
The runtime settings CLI validation readback IAU implements only T009-T012 in
`.specify/specs/runtime-settings-cli-validation-readback-v1/tasks.md`: tests
for persisted settings readback, explicit effective target reporting, runtime
outcome fact reporting without execution/proof-out behavior, fail-closed
unsupported settings handling, and the minimum validation readback contract.
No-argument interactive selection, proof-out file generation, compare
execution, execution engines, live-session proof, packaging, and Marketplace
work remain blocked.
The runtime settings CLI validation proof IAU implements only T009-T012 in
`.specify/specs/runtime-settings-cli-validation-proof-v1/tasks.md`: tests for
structured proof JSON, secret-like environment redaction, deterministic MIT
issue-body content, and the minimum validation proof artifact contract.
No-argument interactive selection, compare execution, execution engines,
live-session proof, packaging, and Marketplace work remain blocked.
The runtime settings CLI interactive selection IAU implements only T009-T013 in
`.specify/specs/runtime-settings-cli-interactive-selection-v1/tasks.md`: tests
for default settings seeding, confirmation validation handoff, guided host
selection, latest supported NI LabVIEW Docker image selection with no
user-facing Docker bitness choice, and the minimum pure selection state
contract. The current governed Docker Linux default maps to the LabVIEW 2026
image family and is 64-bit-only by image/platform. Terminal prompt loops,
compare execution, LabVIEWCLI execution, Docker execution, proof-out
expansion, live-session proof, packaging, and Marketplace work remain blocked.
The runtime settings CLI terminal entrypoint IAU implements only T009-T013 in
`.specify/specs/runtime-settings-cli-terminal-entrypoint-v1/tasks.md`: tests
for materialized bare `vihs` entrypoint facts, user-scoped terminal admission,
runtime lookup/recovery facts, stale or missing launcher guidance, and the
minimum pure materialized-entrypoint contract. Raw prompt loops, compare
execution, LabVIEWCLI execution, Docker execution, proof-out expansion,
live-session proof, Windows PowerShell Marketplace bootstrap, packaging, and
Marketplace work remain blocked.
The runtime settings CLI terminal prompt-loop IAU implements only T009-T013 in
`.specify/specs/runtime-settings-cli-terminal-prompt-loop-v1/tasks.md`: tests
for deterministic no-argument `vihs` prompt transcript/state behavior,
Enter-through confirmation, guided host selection, latest supported NI LabVIEW
Docker image selection with no user-facing Docker bitness choice, and the
minimum pure prompt-loop contract. The current governed Docker Linux default
maps to the LabVIEW 2026 image family and is 64-bit-only by image/platform.
OS-specific raw terminal I/O drivers, compare execution, LabVIEWCLI execution,
Docker execution, proof-out expansion, live-session proof, Windows PowerShell
Marketplace bootstrap, packaging, and Marketplace work remain blocked.
The runtime settings CLI terminal I/O adapter IAU implements only T009-T014 in
`.specify/specs/runtime-settings-cli-terminal-io-adapter-v1/tasks.md`: tests
for Enter confirmation adaptation, guided host terminal selection, Docker
latest supported NI LabVIEW image-family selection with no Docker bitness
prompt, non-TTY copyable guidance, unsupported input/EOF/cancel fail-closed
behavior, and the minimum pure terminal session/input adapter contract.
Compare execution, LabVIEWCLI execution, Docker execution or orchestration,
proof-out expansion, live-session proof, package/bin publication,
launcher/profile mutation, Marketplace work, and source copying remain blocked.
The runtime settings CLI validation proof-out adapter IAU implements only
T009-T014 in
`.specify/specs/runtime-settings-cli-validation-proof-out-v1/tasks.md`: tests
for `--proof-out <dir>` request facts, deterministic proof JSON and issue
Markdown from the already admitted proof-artifact contract, missing
validation/proof facts fail-closed behavior, unsupported proof-out target
fail-closed behavior, non-interactive guidance, and the minimum pure proof-out
adapter contract. Issue #83 implements and closes the handoff. Runtime
validation execution, compare execution, LabVIEWCLI execution, Docker
execution, live terminal proof, package/bin publication, launcher/profile
mutation, Marketplace work, and source copying remain blocked.
The runtime settings CLI validation proof-out file-emission IAU implements
only T009-T016 in
`.specify/specs/runtime-settings-cli-validation-proof-out-file-emission-v1/tasks.md`:
tests for successful two-file emission, deterministic file content, created
output directory, missing or unready adapter failure, unsupported target
failure, I/O failure reporting, no hidden partial success, blocked side
effects, and the minimum pure file-emission adapter around ready proof-out
adapter facts. Issue #87 implements and closes the handoff. Runtime validation
execution, new validation fact generation, compare execution, LabVIEWCLI
execution, Docker execution, live terminal proof, package/bin publication,
launcher/profile mutation, Marketplace work, and source copying remain
blocked.
`runtime-settings-cli-validation-runtime-outcome-v1` admits
`IAU-runtime-settings-cli-validation-runtime-outcome-v1` for Issue #89 and
T009-T016 only. Issue #89 is an admission issue and must not be reused for
implementation. Issue #91 implements and closes pure runtime outcome fact
shaping from supplied public-safe runtime selection facts through
`createRuntimeSettingsValidationRuntimeOutcome(input = {})` for T009-T016 only.
Runtime validation execution, runtime locator invocation, compare execution,
LabVIEWCLI execution, Docker execution or orchestration, live terminal proof,
package/bin publication, launcher/profile mutation, release automation,
Marketplace work, and source copying remain blocked.
`runtime-settings-cli-validation-command-contract-v1` admits
`IAU-runtime-settings-cli-validation-command-contract-v1` for Issue #93 and
T009-T018 only. Issue #93 is an admission issue and must not be reused for
implementation. Issue #95 implements and closes it through PR #96 for
T009-T018 only. It implements only the pure
`createRuntimeSettingsValidationCommandResult(input = {})` contract for
`vihs --validate` and optional `--proof-out <dir>` composition through the
already admitted proof-out file-emission contract.
Runtime validation execution, validation fact generation beyond supplied
runtime outcome fact shaping, compare execution, LabVIEWCLI execution, Docker
execution, raw terminal process wiring, and source copying remain blocked.
`validate-plan-only` remained blocked for that IAU and is admitted separately
below.

`runtime-settings-cli-validation-plan-only-v1` admits
`IAU-runtime-settings-cli-validation-plan-only-v1` for Issue #99 and
T009-T016 only. Issue #99 is an admission issue and must not be reused for
implementation. Issue #101 implements and closes it for T009-T016 only. Issue
#102 and PR #103 repair and close the final plan-only command-contract
behavior. The implemented IAU is a pure `validate-plan-only` branch over
`createRuntimeSettingsValidationCommandResult(input = {})` that returns
deterministic proof-out target and artifact planning facts without calling the
proof-out file-emission writer or writing files. The proof-out file-emission
writer and file writes for plan-only, runtime locator invocation, OS
inspection, private path discovery, runtime validation execution, compare
execution, LabVIEWCLI execution, Docker execution or orchestration, raw
terminal process wiring, live terminal proof, package/bin publication,
launcher/profile mutation, release automation, Marketplace work, and source
copying remain blocked.

`runtime-settings-cli-validation-host-runtime-preflight-v1` implements
`IAU-runtime-settings-cli-validation-host-runtime-preflight-v1` for Issue #106
and implementation handoff Issue #108 through PR #109 for T009-T016 only.
Issue #106 is an admission issue and must not be reused for implementation.
The implemented IAU is a pure
`createRuntimeSettingsValidationHostRuntimePreflight(input = {})` adapter over
supplied public-safe host candidate facts. It may produce deterministic
runtime selection facts for the existing validation runtime outcome, readback,
proof artifact, proof-out adapter, file-emission, validation command, and
`validate-plan-only` contracts. OS scanning, filesystem walking, registry
probing, PATH probing, environment probing, private path discovery, runtime
locator invocation, runtime validation execution, compare execution,
LabVIEWCLI execution, Docker execution or orchestration, raw terminal process
wiring, live terminal proof, file writes from the host preflight adapter,
package/bin publication, launcher/profile mutation, release automation,
Marketplace work, and source copying remain blocked.

`runtime-settings-cli-validation-host-preflight-command-composition-v1` admits
`IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1` for
Issue #112 and T009-T016 only. Issue #112 is an admission issue and must not be
reused for implementation. Issue #114 implements and closes it through PR #115
for T009-T016 only. The implemented IAU is a pure command-composition unit so
`createRuntimeSettingsValidationCommandResult(input = {})` can consume ready
host preflight facts or supplied public-safe host selection/candidate facts
through `createRuntimeSettingsValidationHostRuntimePreflight(input = {})`
without redesigning runtime outcome, readback, proof artifact, proof-out,
file-emission, validation command, or `validate-plan-only` output shapes. OS
scanning, filesystem walking, registry probing, PATH probing, environment
probing, private path discovery, runtime locator invocation, runtime validation
execution, compare execution, LabVIEWCLI execution, Docker execution or
orchestration, raw terminal process wiring, live terminal proof, file writes
from the host preflight adapter, package/bin publication, launcher/profile
mutation, release automation, Marketplace work, and source copying remain
blocked.

`runtime-settings-cli-validation-host-runtime-discovery-v1` admits
`IAU-runtime-settings-cli-validation-host-runtime-discovery-v1` for Issue #118
and T009-T016 only. Issue #118 is an admission issue and must not be reused for
implementation. Issue #120 implements and closes it through PR #121 for
T009-T016 only. The implemented IAU is a bounded
`createRuntimeSettingsValidationHostRuntimeDiscovery(input = {})` facts
contract over public-safe selected host facts and bounded discovery
observations. It may derive public-safe host candidate facts for
`createRuntimeSettingsValidationHostRuntimePreflight(input = {})` and the
existing validation command chain without changing runtime outcome, readback,
proof artifact, proof-out, file-emission, validation command, or
`validate-plan-only` output shapes. Raw private path disclosure, arbitrary
filesystem walking, PATH probing, environment probing, existing compare
runtime locator reuse, runtime validation execution, compare execution,
LabVIEWCLI execution, Docker execution or orchestration, raw terminal process
wiring, live terminal proof, file writes, package/bin publication,
launcher/profile mutation, release automation, Marketplace work, and source
copying remain blocked.

`runtime-settings-cli-validation-host-runtime-observation-adapter-v1`
implements
`IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1` for
Issue #132 and T009-T016 only. Issue #130 is an admission issue and must not
be reused for implementation. The implemented IAU is a pure
`createRuntimeSettingsValidationHostRuntimeObservation(input = {})` facts
contract over public-safe selected host facts and supplied bounded observation
dependencies. It may derive public-safe observation facts for
`createRuntimeSettingsValidationHostRuntimeDiscovery(input = {})` and the
existing validation command chain without changing runtime outcome, readback,
proof artifact, proof-out, file-emission, validation command,
`validate-plan-only`, host runtime preflight, host preflight command
composition, or host runtime discovery output shapes. Raw private path
disclosure, raw registry output retention, arbitrary filesystem walking beyond
the admitted bounded observation policy, PATH probing, environment probing,
existing compare runtime locator reuse, runtime validation execution, compare
execution, LabVIEWCLI execution, Docker execution or orchestration, raw
terminal process wiring, live terminal proof, proof-out expansion, file writes,
package/bin publication, launcher/profile mutation, release automation,
Marketplace work, and source copying remain blocked.

`runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1`
implements
`IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1`
for Issue #144 and T009-T016 only. Issue #142 is an admission issue and must
not be reused for implementation. Issue #144 implements and closes it through
PR #145 for T009-T016 only. The implemented IAU is a bounded
`createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter(input =
{})` facts contract over public-safe selected host facts and supplied bounded
source facts. It may derive public-safe observation dependency facts for
`createRuntimeSettingsValidationHostRuntimeObservation(input = {})` and the
existing validation command chain without changing runtime outcome, readback,
proof artifact, proof-out, file-emission, validation command,
`validate-plan-only`, host runtime preflight, host preflight command
composition, host runtime discovery, or host runtime observation output shapes.
Raw private path disclosure, raw registry output retention, arbitrary
filesystem walking, PATH probing, environment probing, existing compare runtime
locator reuse, runtime validation execution, compare execution, LabVIEWCLI
execution, Docker execution or orchestration, raw terminal process wiring, live
terminal proof, proof-out expansion, file writes from a source or observation
adapter, package/bin publication, launcher/profile mutation, VSIX packaging
changes, release automation, Marketplace work, and source copying remain
blocked.

`runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1`
implements
`IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1`
for Issue #150 and T009-T016 only. Issue #148 is an admission issue and must
not be reused for implementation. Issue #150 implements and closes it through
PR #151. The implemented IAU is a bounded
`createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition(input =
{})` facts contract over public-safe selected host facts and supplied bounded
native host acquisition dependency facts. It may derive public-safe source
facts for
`createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter(input = {})`
and the existing validation command chain without changing runtime outcome,
readback, proof artifact, proof-out, file-emission, validation command,
`validate-plan-only`, host runtime preflight, host preflight command
composition, host runtime discovery, host runtime observation, or source
adapter output shapes. Raw private path disclosure, raw registry output
retention, arbitrary filesystem walking, broad PATH probing, environment
probing, existing compare runtime locator reuse, runtime validation execution,
compare execution, LabVIEWCLI execution, Docker execution or orchestration, raw
terminal process wiring, live terminal proof, proof-out expansion, file writes
from source, observation, discovery, or preflight adapters, package/bin
publication, launcher/profile mutation, VSIX packaging changes, release
automation, Marketplace work, Docker source discovery, and source copying
remain blocked.

`runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1`
implements
`IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1`
for Issue #156 and T009-T016 only. Issue #154 is an admission issue and must
not be reused for implementation. Issue #156 implements and closes it through
PR #157. The implemented IAU is a bounded
`createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition(input =
{})` facts contract over public-safe selected host facts and supplied governed
native acquisition dependency observations. It may derive acquisition
dependency facts for
`createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition(input =
{})` and the existing validation command chain without changing runtime
outcome, readback, proof artifact, proof-out, file-emission, validation
command, `validate-plan-only`, host runtime preflight, host preflight command
composition, host runtime discovery, host runtime observation, source adapter,
or source-acquisition output shapes. Raw private path disclosure, raw registry
output retention, arbitrary filesystem walking, broad PATH probing,
environment probing, existing compare runtime locator reuse, runtime validation
execution, compare execution, LabVIEWCLI execution, Docker execution or
orchestration, Docker image inspection, container source discovery, raw
terminal process wiring, live terminal proof, proof-out expansion, file writes,
package/bin publication, launcher/profile mutation, VSIX packaging changes,
release automation, Marketplace work, Docker source discovery, and source
copying remain blocked.

`extension-vsix-packaging-artifact-v1` implements
`IAU-extension-vsix-packaging-artifact-v1` for local VSIX package artifact
creation and inspection only. It adds `npm run package:vsix`,
`npm run inspect:vsix`, and `.vscodeignore` package boundaries for
`dist/vi-history-0.1.0.vsix`. Marketplace publication, release tokens,
`vsce publish`, Open VSX publication, release uploads, package registry
publication, runtime validation execution, compare execution, LabVIEWCLI
execution, Docker execution, launcher/profile mutation, release automation,
and source copying remain out of scope.

The Marketplace posture is recorded in
`docs/decisions/ADR-001-marketplace-publication-disabled.md`, superseded in
part by `docs/decisions/ADR-002-vsix-packaging-artifact-only.md`, and
summarized in `docs/governance/marketplace-posture.md`.

Current Implementation Admission Unit:
`none`.

## Validation

Run:

```bash
npm test
```

The current gates validate import packet shape, Spec Kit artifact presence,
package identity, admission state, redaction, traceability, and the clean-room
boundary.
