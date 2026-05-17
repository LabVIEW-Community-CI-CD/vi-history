# ADR-001: Marketplace Publication Disabled

**Status**: Accepted  
**Date**: 2026-05-17  
**Issue**: [#5](https://github.com/LabVIEW-Community-CI-CD/vi-history/issues/5)

## Context

The `svelderrainruiz.vi-history` extension identity is modeled in this
repository for future compatibility, including publisher metadata, extension ID,
and version. The `runtime-contract-host-provider-v1` slice completed all
admitted tasks (T007–T030) and the implementation loop closed under Issue #4.

Before any Marketplace publication can occur, the following conditions must be
met:

- A release channel must be explicitly admitted through the bridge governance
  process.
- Package publishing credentials and release tooling must be introduced through
  a separate, governed admission.
- Any packaging or release scripts must pass a redaction scan and be reviewed
  for public-safety before commit.

None of these conditions are currently met. No Marketplace publication work has
been admitted, planned, or scoped.

## Decision

Marketplace publication remains **disabled** for the `svelderrainruiz.vi-history`
extension. No packaging, publishing, or Marketplace release work is admitted at
this time.

This decision governs all existing admission records, Spec Kit artifacts, and
repository guidance files that carry the notation
`"marketplacePublication": "disabled-until-later-adr"`. That notation is now
resolved by this ADR.

## Consequences

- All existing IAU records and the top-level admission record remain valid with
  the Marketplace field resolving to this ADR.
- `AGENTS.md`, `docs/development/copilot-workflow.md`, and the constitution
  continue to block packaging and Marketplace work.
- A future ADR or bridge admission record must explicitly supersede this
  decision before any Marketplace work is started.
- Implementation work targeting execution (LabVIEWCLI commands, Docker
  orchestration) and release (packaging, Marketplace publication) remains
  blocked until separately admitted.

## Alternatives Considered

**Enable Marketplace immediately**: Rejected. Release credentials, packaging
tooling, and a governed release channel are not yet in place. Premature
publication would expose an incomplete extension and violate the clean-room
boundary.

**Defer the decision without documentation**: Rejected. Existing admission
records reference an ADR that was not yet written. Recording this decision
closes that reference and makes the governance posture explicit.
