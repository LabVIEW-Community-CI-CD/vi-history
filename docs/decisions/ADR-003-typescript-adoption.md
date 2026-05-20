# ADR-003: TypeScript Adoption

**Status**: Accepted  
**Date**: 2026-05-20  
**Issue**: Phase 2 Foundation Migration

## Context

The VI History extension codebase currently uses JavaScript ESM modules (`.mjs`)
for both source files and tests. As the implementation expands to include
foundation components (VI magic detection, Git CLI wrapper, VS Code Git API
integration, VI history models, and repository eligibility indexing), the
complexity and size of the codebase will increase significantly.

TypeScript provides static type checking, improved IDE support, better
refactoring capabilities, and early error detection that will help maintain
code quality as the project scales.

The existing clean-room MIT implementation pattern and Spec Kit governance
remain unchanged by this decision.

## Decision

Adopt TypeScript 5.9+ for all source code and tests in the VI History extension.

### Migration Approach

1. **Incremental migration**: Convert existing `.mjs` files to `.ts` one at a
   time, starting with `src/extension.mjs`
2. **Module system**: Use ES2022/NodeNext for module resolution to maintain
   ESM compatibility
3. **Build output**: Compile to `out/` directory, which is already in
   `.gitignore`
4. **Test framework**: Continue using Node.js built-in test runner with
   TypeScript support

### TypeScript Configuration

- Target: ES2022
- Module: NodeNext
- Module Resolution: NodeNext
- Strict mode: Enabled
- Source maps: Enabled for debugging

### Build Scripts

- `compile`: TypeScript compilation
- `watch`: Incremental compilation for development
- `pretest`: Compile before running tests

## Consequences

### Positive

- Static type checking catches errors at compile time
- Improved IDE support with IntelliSense and refactoring tools
- Better documentation through type annotations
- Easier onboarding for new contributors
- Aligns with VS Code extension development best practices

### Negative

- Build step required before running/testing
- Additional tooling dependency (TypeScript)
- Initial migration effort for existing code

### Migration Impact

- 7 source files to migrate (`src/*.mjs`)
- 30 test files to migrate (`tests/*.test.mjs`)
- CI workflow update to include build step
- `package.json` script updates

## Alternatives Considered

**Stay with JavaScript ESM**: Rejected. As the codebase grows with foundation
IAUs, the lack of static typing increases maintenance burden and bug risk.

**Use JSDoc type annotations only**: Rejected. While JSDoc provides some type
checking, it lacks the full power of TypeScript's type system and requires
more verbose annotations.

**Gradual typing with `allowJs`**: Considered as fallback. Could be used during
migration but full TypeScript adoption is preferred.
