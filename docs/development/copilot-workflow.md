# Copilot Implementation Workflow

Use this workflow when developing `svelderrainruiz/vi-history` with Copilot in
local or web mode. This repository is the public MIT implementation authority,
so Copilot must work from committed public artifacts only.

## Source Files

Read these before changing code:

- `AGENTS.md`
- `README.md`
- `docs/requirements/imports/runtime-contract-host-provider-v1/manifest.json`
- `docs/requirements/imports/runtime-contract-host-provider-v1/syrs.md`
- `docs/requirements/imports/runtime-contract-host-provider-v1/srs.md`
- `docs/requirements/imports/runtime-contract-host-provider-v1/rtm.csv`
- `docs/requirements/imports/runtime-contract-host-provider-v1/test-plan.md`
- `.specify/memory/constitution.md`
- `.specify/specs/runtime-contract-host-provider-v1/spec.md`
- `.specify/specs/runtime-contract-host-provider-v1/plan.md`
- `.specify/specs/runtime-contract-host-provider-v1/tasks.md`
- `docs/requirements/admissions/runtime-contract-host-provider-v1.json`
- `docs/requirements/admissions/runtime-contract-host-provider-v1/IAU-runtime-contract-proof-intake-v1.json`
- `docs/requirements/admissions/runtime-contract-host-provider-v1/IAU-runtime-contract-proof-intake-v1-preflight-v1.json`

## Current Status

GitHub Issue #5 closed the Marketplace publication governance decision. The
decision is recorded in
`docs/decisions/ADR-001-marketplace-publication-disabled.md`. Marketplace
publication remains disabled and no packaging or release work is admitted.

GitHub Issue #4 completed the runtime-contract implementation loop through
`IAU-runtime-contract-proof-intake-v1`. No new Copilot implementation should
start from Issue #4.

Completed units:

- `IAU-runtime-contract-explicit-compare-v1`
- `IAU-runtime-contract-runtime-facts-v1`
- `IAU-runtime-contract-provider-policy-v1`
- `IAU-runtime-contract-proof-intake-v1`

Completed runtime-contract tasks:

- `T007` through `T011`: foundational runtime contracts.
- `T012` through `T015`: explicit compare action flow.
- `T016` through `T021`: runtime facts and command planning.
- `T022` through `T025`: provider policy.
- `T026`: add tests for Linux host LabVIEW proof classification.
- `T027`: add tests rejecting Linux Docker, WSL, host-provider proof, or reports without proof packets as Windows Docker Desktop proof.
- `T028`: add tests for `vihs validate-fixture` proof JSON and issue-body generation.
- `T029`: implement proof packet writer and issue-body generation.
- `T030`: implement Windows Docker Desktop proof intake validation.

## Future Work Packet

Future Copilot work must start with a new public bridge admission record before
any code changes. A valid future work packet must name a new IAU, admitted
tasks, blocked tasks, preflight status, source files, expected write area, and
validation commands.

## Blocked Work

Do not implement these without a separate bridge admission:

- LabVIEWCLI command execution
- Docker command execution or container orchestration
- Marketplace publication or packaging
- source copying from another VI History product line

If a blocked task appears necessary, stop and open a new issue with the blocker
instead of expanding the implementation scope.

## Local Copilot Flow

1. Start from `develop`.
2. Confirm a new bridge-admitted IAU exists with preflight `status: pass`.
3. Create a feature branch for the admitted IAU.
4. Ask Copilot to plan first, without changing code. The plan must name files
   expected to change, tests to add or update, how blocked work remains blocked,
   and validation commands.
5. After the plan, ask Copilot to implement only the admitted tasks from the
   public work packet.
6. Keep implementation behavior clean-room and traceable to imported
   requirement IDs.
7. Run validation before opening a PR.

Use these checks:

```bash
npm test
npm run check
git diff --check
```

## Web Copilot Flow

Do not use Issue #4 as a new implementation packet. Use a future public issue
only after the bridge admits a new IAU. The PR must target `develop` and state
the exact admitted IAU it implements.

The PR summary should include:

- the implementation plan used before code changes
- the exact admitted IAU and completed tasks
- tests added or updated
- confirmation that execution and Marketplace work remain blocked
- validation command results

## Clarification Rule

When behavior is ambiguous, do not infer from private repositories. Open a new
public issue and wait for the public Spec Kit or admission artifacts to be
updated.
