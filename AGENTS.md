<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->

# Repository Guidance

This repository is the MIT implementation authority for
`svelderrainruiz.vi-history` — the **VI History** VS Code extension.

## Full Suite Integration

Per `docs/decisions/ADR-004-full-suite-integration.md`, the production-ready
`.vi-history-suite/` codebase has been fully integrated into this repository
under the MIT license. The previous clean-room boundary restriction no longer
applies.

The integration enables:

- **Domain Layer**: VI file detection, magic byte detection (RSRC/LVIN/LVCC)
- **Git Integration**: VS Code Git API wrapper, Git CLI operations
- **Services**: History service, eligibility indexer, support policy
- **Reporting**: Comparison reports, runtime locator, execution planning
- **UI**: History panel, dashboard, documentation panel
- **Commands**: Open VI History, documentation, runtime settings CLI
- **Tooling**: Runtime settings CLI, live session probes

## Development Workflow

The integration branch is `develop`; feature work targets `develop` before
promotion to `main`.

VSIX packaging is authorized only as a local/CI artifact. The decision is
recorded in `docs/decisions/ADR-002-vsix-packaging-artifact-only.md` and
summarized in `docs/governance/marketplace-posture.md`. Marketplace
publication, release tokens, `vsce publish`, Open VSX publication, Marketplace
workflows, release uploads, and package registry publication are out of scope
for this repository.

Implementation for `runtime-contract-host-provider-v1` is complete through
proof intake. `installed-user-observation-public-surface-v1` is a
requirements/spec baseline with one implemented IAU:
`IAU-installed-user-observation-model-v1`. It completed only T009-T013.
`command-activation-surface-v1` implements
`IAU-command-activation-manifest-contract-v1` for T009-T012 only: manifest
activation-event contract tests, contributed command ID/title contract tests,
package identity and Marketplace-disabled contract tests, and minimal manifest
metadata.

`command-handler-entrypoint-shell-v1` implemented
`IAU-command-handler-entrypoint-shell-v1` for Issue #36 and T009-T011 only:
entrypoint shell tests and the minimum public MIT entrypoint shell.
`IAU-command-handler-entrypoint-shell-v1` is closed. Issue #36 must not be
reused for new implementation.

`installed-user-documentation-command-v1` implemented
`IAU-documentation-command-panel-shell-v1` for Issue #41 and T009-T011 only:
Open Documentation handler tests, public-safe bundled documentation contract
tests, and the minimum documentation command panel shell. Issue #41 must not be
reused for new implementation.

`runtime-settings-cli-bootstrap-v1` admits
`IAU-runtime-settings-cli-prepare-command-shell-v1` for Issue #43 and T009-T011
only. Issue #45 implements and closes it: prepare-command handler tests,
launcher materialization/recovery fact tests, and the minimum prepare-command
shell. Issue #43 and Issue #45 must not be reused for new implementation.

`runtime-settings-cli-settings-write-v1` admits
`IAU-runtime-settings-cli-settings-write-contract-v1` for Issue #47 and
T009-T012 only. Issue #47 is an admission issue; implementation must use a
separate handoff issue after the admission PR merges. Issue #49 implements and
closes it for T009-T012 only: tests for governed provider/version/bitness
settings writes, unrelated settings preservation, fail-closed unsupported target
handling, and the minimum public settings-write contract.

`vihs --validate`, runtime validation, no-argument interactive selection,
compare execution, LabVIEWCLI execution, Docker execution, live-session proof,
packaging, and Marketplace publication remain blocked.

`runtime-settings-cli-validation-readback-v1` admits
`IAU-runtime-settings-cli-validation-readback-contract-v1` for Issue #51 and
T009-T012 only. Issue #51 is an admission issue; implementation must use a
separate handoff issue after the admission PR merges. Issue #53 implements and
closes it for T009-T012 only: tests for persisted settings readback, explicit
effective target reporting, runtime outcome fact reporting without execution or
proof-out behavior, fail-closed unsupported settings handling, and the minimum
public validation readback contract.

No-argument interactive selection, proof-out file generation, compare
execution, LabVIEWCLI execution, Docker execution, live-session proof,
packaging, and Marketplace publication remain blocked.

`runtime-settings-cli-validation-proof-v1` admits
`IAU-runtime-settings-cli-validation-proof-artifact-v1` for Issue #55 and
T009-T012 only. Issue #55 is an admission issue; implementation must use a
separate handoff issue after the admission PR merges. Issue #57 implements and
closes it for T009-T012 only: tests for pure validation proof JSON,
secret-like environment redaction, deterministic MIT issue-body content, and
the minimum validation proof artifact contract from supplied validation facts.

No-argument interactive selection, compare execution, LabVIEWCLI execution,
Docker execution, live-session proof, packaging, and Marketplace publication
remain blocked.

`runtime-settings-cli-interactive-selection-v1` admits
`IAU-runtime-settings-cli-interactive-selection-contract-v1` for Issue #60 and
T009-T013 only. Issue #60 is an admission issue and must not be reused for
implementation. Issue #62 implements and closes the pure selection-state
contract: default seeding, current bundle reporting, Enter-through
confirmation, guided host selection, latest supported NI LabVIEW Docker image
selection with no user-facing Docker bitness choice, and validation readback
handoff facts. Docker remains 64-bit-only by image/platform; host LabVIEW
bitness remains a host-provider concern.

`runtime-settings-cli-terminal-entrypoint-v1` admits
`IAU-runtime-settings-cli-terminal-entrypoint-materialization-v1` for Issue #65
and T009-T013 only. Issue #65 is an admission issue and must not be reused for
implementation. Issue #67 implements and closes the materialized-entrypoint
contract for T009-T013 only.

`runtime-settings-cli-terminal-prompt-loop-v1` admits
`IAU-runtime-settings-cli-terminal-prompt-loop-v1` for Issue #71 and T009-T013
only. Issue #71 is an admission issue and must not be reused for
implementation. Issue #73 implements and closes the pure prompt
transcript/state contract for T009-T013 only. Issue #75 clarifies that Docker
provider selection means the latest supported NI LabVIEW Docker image family,
currently the LabVIEW 2026 Linux image family, with no separate Docker bitness
choice exposed to users.

`runtime-settings-cli-terminal-io-adapter-v1` admits
`IAU-runtime-settings-cli-terminal-io-adapter-v1` for Issue #77 and T009-T014
only. Issue #77 is an admission issue and must not be reused for
implementation. Issue #79 implements and closes the pure terminal session/input
adapter for T009-T014 only: Enter confirmation adaptation, guided host
selection adaptation, Docker latest supported NI LabVIEW image-family selection
with no Docker bitness prompt, non-TTY copyable guidance, unsupported
input/EOF/cancel fail-closed behavior, and validation handoff facts.

`runtime-settings-cli-validation-proof-out-v1` admits
`IAU-runtime-settings-cli-validation-proof-out-v1` for Issue #81 and
T009-T014 only. Issue #81 is an admission issue and must not be reused for
implementation. Issue #83 implements and closes the pure proof-out request,
target, artifact, non-interactive guidance, and blocked-side-effect facts over
the already admitted validation readback and validation proof-artifact
contracts for T009-T014 only.

`runtime-settings-cli-validation-proof-out-file-emission-v1` admits
`IAU-runtime-settings-cli-validation-proof-out-file-emission-v1` for Issue #85
and T009-T016 only. Issue #85 is an admission issue and must not be reused for
implementation. Issue #87 implements and closes the file-emission contract for
T009-T016 only: writing exactly
`vihs-validation-proof.json` and `vihs-validation-issue.md` from ready
proof-out adapter facts, creating the supported target directory when safe, and
returning deterministic write-result facts.

Compare execution, LabVIEWCLI execution, Docker execution or orchestration,
runtime validation execution, new validation fact generation, live-session
proof, package/bin publication, launcher/profile mutation, packaging, and
Marketplace publication remain blocked.

`runtime-settings-cli-validation-runtime-outcome-v1` admits
`IAU-runtime-settings-cli-validation-runtime-outcome-v1` for Issue #89 and
T009-T016 only. Issue #89 is an admission issue and must not be reused for
implementation. Issue #91 implements and closes pure runtime outcome fact
shaping from supplied public-safe selection facts for T009-T016 only. Runtime
validation execution, runtime locator invocation, compare execution, LabVIEWCLI
execution, Docker execution or orchestration, live-session proof, package/bin
publication, launcher/profile mutation, release automation, Marketplace
publication, and source copying remain blocked.

`runtime-settings-cli-validation-command-contract-v1` admits
`IAU-runtime-settings-cli-validation-command-contract-v1` for Issue #93 and
T009-T018 only. Issue #93 is an admission issue and must not be reused for
implementation. Issue #95 implements and closes it through PR #96 for
T009-T018 only. The implemented IAU is a pure
`createRuntimeSettingsValidationCommandResult(input = {})` command-result
contract for `vihs --validate` and optional `--proof-out <dir>` composition
through the already admitted file-emission contract. OS inspection, runtime
locator invocation, private path discovery, runtime validation execution,
compare execution, LabVIEWCLI execution, Docker execution or orchestration,
raw terminal process wiring, live-session proof, package/bin publication,
launcher/profile mutation, release automation, Marketplace publication,
and source copying remain blocked. `validate-plan-only` remained blocked for
that IAU and is admitted separately below.

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
terminal process wiring, live-session proof, package/bin publication,
launcher/profile mutation, release automation, Marketplace publication, and
source copying remain blocked.

`runtime-settings-cli-validation-host-runtime-preflight-v1` implements
`IAU-runtime-settings-cli-validation-host-runtime-preflight-v1` for Issue #106
and T009-T016 only. Issue #106 is an admission issue and must not be reused
for implementation. Issue #108 implements and closes it through PR #109 for
T009-T016 only. The implemented IAU is a pure
`createRuntimeSettingsValidationHostRuntimePreflight(input = {})` adapter over
supplied public-safe host candidate facts. It may compose with the existing
runtime outcome, readback, proof artifact, proof-out adapter, file-emission,
validation command, and `validate-plan-only` contracts without changing their
output shapes. OS scanning, filesystem walking, registry probing, PATH
probing, environment probing, private path discovery, runtime locator
invocation, runtime validation execution, compare execution, LabVIEWCLI
execution, Docker execution or orchestration, raw terminal process wiring,
live-session proof, file writes from the host preflight adapter, package/bin
publication, launcher/profile mutation, release automation, Marketplace
publication, and source copying remain blocked.

`runtime-settings-cli-validation-host-preflight-command-composition-v1` admits
`IAU-runtime-settings-cli-validation-host-preflight-command-composition-v1` for
Issue #112 and T009-T016 only. Issue #112 is an admission issue and must not be
reused for implementation. Issue #114 implements and closes it through PR #115
for T009-T016 only. The implemented IAU is a pure
`createRuntimeSettingsValidationCommandResult(input = {})` composition branch
over ready host preflight facts or supplied public-safe host
selection/candidate facts. OS scanning, filesystem walking, registry probing,
PATH probing, environment probing, private path discovery, runtime locator
invocation, runtime validation execution, compare execution, LabVIEWCLI
execution, Docker execution or orchestration, raw terminal process wiring,
live-session proof, file writes from the host preflight adapter, package/bin
publication, launcher/profile mutation, release automation, Marketplace
publication, and source copying remain blocked.

`runtime-settings-cli-validation-host-runtime-discovery-v1` admits
`IAU-runtime-settings-cli-validation-host-runtime-discovery-v1` for Issue #118
and T009-T016 only. Issue #118 is an admission issue and must not be reused for
implementation. Issue #120 implements and closes it through PR #121 for
T009-T016 only. The implemented IAU is a bounded
`createRuntimeSettingsValidationHostRuntimeDiscovery(input = {})` facts
contract over public-safe selected host facts and bounded discovery
observations. It may derive public-safe host candidate facts for
`createRuntimeSettingsValidationHostRuntimePreflight(input = {})` and the
existing validation command chain without changing output shapes. Raw private
path disclosure, arbitrary filesystem walking, PATH probing, environment
probing, existing compare runtime locator reuse, runtime validation execution,
compare execution, LabVIEWCLI execution, Docker execution or orchestration,
raw terminal process wiring, live-session proof, file writes, package/bin
publication, launcher/profile mutation, release automation, Marketplace
publication, and source copying remain blocked.

`runtime-settings-cli-validation-host-runtime-observation-adapter-v1`
implements
`IAU-runtime-settings-cli-validation-host-runtime-observation-adapter-v1` for
Issue #130 and T009-T016 only. Issue #130 is an admission issue and must not be
reused for implementation. Issue #132 implements and closes it through PR #133
for T009-T016 only. The implemented IAU is a pure
`createRuntimeSettingsValidationHostRuntimeObservation(input = {})` facts
contract over public-safe selected host facts and supplied bounded observation
dependencies. It may derive public-safe observation facts for
`createRuntimeSettingsValidationHostRuntimeDiscovery(input = {})` and the
existing validation command chain without changing output shapes. Raw private
path disclosure, raw registry output retention, arbitrary filesystem walking
beyond the admitted bounded observation policy, PATH probing, environment
probing, existing compare runtime locator reuse, runtime validation execution,
compare execution, LabVIEWCLI execution, Docker execution or orchestration,
raw terminal process wiring, live-session proof, proof-out expansion, file
writes, package/bin publication, launcher/profile mutation, release
automation, Marketplace publication, and source copying remain blocked.

`extension-vsix-packaging-artifact-v1` implements
`IAU-extension-vsix-packaging-artifact-v1` for local VSIX package artifact
creation and inspection only. Issue #137 is the admission issue and must not be
reused for implementation. Issue #136 is the implementation handoff issue. It
is implemented through PR #138 and may create `dist/vi-history-0.1.0.vsix`.
Marketplace publication, release tokens, `vsce publish`, Open VSX publication,
release uploads, package registry publication, runtime validation execution,
compare execution, LabVIEWCLI execution, Docker execution, launcher/profile
mutation, release automation, and source copying remain out of scope.

`runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1`
implements
`IAU-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1`
for Issue #144 and T009-T016 only. Issue #142 is an admission issue and must not
be reused for implementation. Issue #144 implements and closes it through PR
#145 for T009-T016 only. The implemented IAU is a bounded
`createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter(input =
{})` facts contract over public-safe selected host facts and supplied bounded
source facts. It may derive public-safe observation dependency facts for
`createRuntimeSettingsValidationHostRuntimeObservation(input = {})` and the
existing validation command chain without changing output shapes. Raw private
path disclosure, raw registry output retention, arbitrary filesystem walking,
PATH probing, environment probing, existing compare runtime locator reuse,
runtime validation execution, compare execution, LabVIEWCLI execution, Docker
execution or orchestration, raw terminal process wiring, live proof, proof-out
expansion, file writes from a source or observation adapter, package/bin
publication, launcher/profile mutation, VSIX packaging changes, release
automation, Marketplace publication, and source copying remain blocked.

`runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1`
implements
`IAU-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1`
for Issue #148 and T009-T016 only. Issue #148 is an admission issue and must
not be reused for implementation. Issue #150 implements and closes it through
PR #151 for T009-T016 only. The implemented IAU is a bounded
`createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition(input =
{})` facts contract over public-safe selected host facts and supplied bounded
native host acquisition dependency facts. It may derive public-safe source
facts for
`createRuntimeSettingsValidationHostRuntimeObservationSourceAdapter(input = {})`
and the existing validation command chain without changing output shapes. Raw
private path disclosure, raw registry output retention, arbitrary filesystem
walking, broad PATH probing, environment probing, existing compare runtime
locator reuse, runtime validation execution, compare execution, LabVIEWCLI
execution, Docker execution or orchestration, raw terminal process wiring,
live proof, proof-out expansion, file writes from source, observation,
discovery, or preflight adapters, package/bin publication, launcher/profile
mutation, VSIX packaging changes, release automation, Marketplace publication,
Docker source discovery, and source copying remain blocked.

`runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1`
implements
`IAU-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1`
for Issue #154 and T009-T016 only. Issue #154 is an admission issue and must
not be reused for implementation. Issue #156 implements and closes it through
PR #157 for T009-T016 only. The implemented IAU is a bounded
`createRuntimeSettingsValidationHostRuntimeObservationNativeSourceAcquisition(input =
{})` facts contract over public-safe selected host facts and supplied governed
native acquisition dependency observations. It may derive acquisition
dependency facts for
`createRuntimeSettingsValidationHostRuntimeObservationSourceAcquisition(input =
{})` and the existing validation command chain without changing output shapes.
Raw private path disclosure, raw registry output retention, arbitrary
filesystem walking, broad PATH probing, environment probing, existing compare
runtime locator reuse, runtime validation execution, compare execution,
LabVIEWCLI execution, Docker execution or orchestration, Docker image
inspection, container source discovery, raw terminal process wiring, live
proof, proof-out expansion, file writes from source, observation, discovery,
preflight, source-acquisition, or native-source adapters, package/bin
publication, launcher/profile mutation, VSIX packaging changes, release
automation, Marketplace publication, Docker source discovery, and source
copying remain blocked.

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

For Copilot local or web implementation work, read
`docs/development/copilot-workflow.md` before changing code. It explains that
future work must start from a new public bridge admission record.

When running generated Spec Kit helpers from a governed `codex/...` branch, set
both environment variables so branch validation resolves the pinned feature:

```bash
SPECIFY_FEATURE=025-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1 \
SPECIFY_FEATURE_DIRECTORY=.specify/specs/runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1 \
.specify/scripts/bash/check-prerequisites.sh --json --paths-only
```

The current host runtime observation native source acquisition feature uses
`025-runtime-settings-cli-validation-host-runtime-observation-native-source-acquisition-v1`.
The previous host runtime observation source acquisition feature used
`024-runtime-settings-cli-validation-host-runtime-observation-source-acquisition-v1`.
The previous host runtime observation source adapter feature used
`023-runtime-settings-cli-validation-host-runtime-observation-source-adapter-v1`.
The previous VSIX packaging feature used
`022-extension-vsix-packaging-artifact-v1`.
The previous host runtime observation adapter feature used
`021-runtime-settings-cli-validation-host-runtime-observation-adapter-v1`.
The previous host runtime discovery feature used
`021-runtime-settings-cli-validation-host-runtime-discovery-v1`.
The previous host preflight command-composition feature used
`020-runtime-settings-cli-validation-host-preflight-command-composition-v1`.
The previous host runtime preflight feature used
`019-runtime-settings-cli-validation-host-runtime-preflight-v1`.
The previous plan-only feature used
`018-runtime-settings-cli-validation-plan-only-v1`.

## CI Workflows

The repository uses GitHub Actions for CI/CD:

- `.github/workflows/spec-gates.yml` — standard CI validation running on
  `ubuntu-latest`. Runs `npm test` for unit tests and boundary checks.

- `.github/workflows/integration-tests.yml` — integration tests including
  LabVIEW-dependent tests. Unit tests run on `ubuntu-latest`; LabVIEW
  integration tests run on `self-hosted-windows-labview` runner.

### Self-Hosted Runner

The `self-hosted-windows-labview` runner label designates a Windows runner with
LabVIEW 2026 installed. This runner enables integration tests that require
LabVIEWCLI execution. See `docs/development/self-hosted-runner-setup.md` for
provisioning details.

LabVIEW integration tests are gated to `main` branch or manual workflow dispatch
to avoid running on every PR until the runner is provisioned.
