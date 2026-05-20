# Packaging And Marketplace Posture

## Decision

`svelderrainruiz/vi-history` admits local VSIX artifact packaging only.
Marketplace publication is out of scope for this repository.

Formal ADRs:

- `docs/decisions/ADR-001-marketplace-publication-disabled.md`
- `docs/decisions/ADR-002-vsix-packaging-artifact-only.md`
- `docs/decisions/ADR-004-full-suite-integration.md`

This MIT repository may keep extension identity metadata for compatibility, but
it must not add Marketplace publication, release tokens, `vsce publish`, Open
VSX publication, Marketplace workflows, release uploads, or package registry
publication.

Local artifact packaging is admitted through
`extension-vsix-packaging-artifact-v1` and creates
`dist/vi-history-0.1.0.vsix`.

## Full Suite Integration

Per ADR-004, the production-ready `.vi-history-suite/` codebase has been fully
integrated into this repository. This enables:

| Feature | Status | Notes |
|---------|--------|-------|
| LabVIEWCLI execution | **ENABLED** | Self-hosted runner required |
| Docker execution | **ENABLED** | Linux CI runner |
| Compare execution | **ENABLED** | Requires runtime |
| Local VSIX packaging | **ENABLED** | `npm run package:vsix` |

The following remain blocked:

| Feature | Status | Reason |
|---------|--------|--------|
| Marketplace publication | **BLOCKED** | ADR-001, ADR-002 |
| `vsce publish` | **BLOCKED** | No publication tokens |
| Open VSX publication | **BLOCKED** | Out of scope |
| Release automation | **BLOCKED** | No release credentials |
| Package registry publication | **BLOCKED** | Out of scope |

## Rationale

- The repository needs installable artifact validation without owning a
  publication channel.
- `svelderrainruiz/vi-history-suite` remains the Marketplace-continuity
  authority for the existing public extension line.
- Keeping this repository MIT, public, and Spec Kit-first is compatible with a
  local VSIX artifact and incompatible with hidden publication credentials.

## Boundaries

- `npm run package:vsix` may create a local `.vsix` artifact.
- `npm run inspect:vsix` must verify package contents.
- Publication commands and credentials remain out of scope.

No Marketplace publication workflow is admitted.
