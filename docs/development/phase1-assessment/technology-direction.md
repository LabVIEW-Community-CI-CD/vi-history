# Technology Direction: TypeScript Adoption

**Assessment Date**: 2026-05-20
**Phase**: 1 - Assessment & Prerequisites
**Status**: Recommendation

## Decision Required

The `vi-history` repository currently uses vanilla ES modules (`.mjs`). The
`.vi-history-suite` uses TypeScript. This document recommends adopting
TypeScript for the migration.

---

## Current State

### vi-history Repository (Current)
```
src/
├── extension.mjs           # 138 lines
├── installed-user-observation.mjs
├── runtime-contracts.mjs
├── runtime-execution-contracts.mjs
├── runtime-execution-docker.mjs
├── runtime-execution-host-native.mjs
└── runtime-settings-cli.mjs  # ~2,500 lines
```

**Characteristics:**
- No build step
- Node.js built-in test runner
- No type definitions
- Manual JSDoc annotations
- ~3,000 LOC total

### vi-history-suite (Target)
```
src/
├── domain/        # 3 files, ~200 LOC
├── services/      # 2 files, ~260 LOC
├── git/           # 2 files, ~260 LOC
├── indexing/      # 1 file, ~540 LOC
├── ui/            # 2 files, ~40KB
├── reporting/     # 8 files, ~9,500 LOC
├── cli/           # 15 files
├── commands/      # 1 file
├── tooling/       # 12 files
└── ...            # 100+ additional files
```

**Characteristics:**
- TypeScript compilation
- Vitest testing framework
- Type-safe interfaces
- ~25,000+ LOC total

---

## Option Analysis

### Option A: Maintain Vanilla JavaScript

**Migration Strategy:**
1. Keep existing `.mjs` files
2. Add JSDoc type annotations for new code
3. Use TypeScript only for type checking (`allowJs: true`)

**Pros:**
- No build step required
- Simpler CI/CD pipeline
- Smaller runtime footprint
- No migration effort for existing code

**Cons:**
- No compile-time type safety
- Limited IDE support for complex types
- JSDoc annotations verbose and incomplete
- Hard to maintain at scale (15,000+ LOC)
- Testing complex type scenarios difficult

**Effort:** Low initial, High ongoing

### Option B: Adopt TypeScript (Recommended)

**Migration Strategy:**
1. Add TypeScript to devDependencies
2. Create `tsconfig.json` with ES module output
3. Migrate existing `.mjs` → `.ts` files
4. Build to `out/` directory
5. Update package.json main entry

**Pros:**
- Compile-time type safety
- Full IDE IntelliSense
- Easier refactoring at scale
- Matches suite's architecture patterns
- Industry standard for VS Code extensions
- Better testing capabilities

**Cons:**
- Requires build step
- Larger development toolchain
- Migration effort for existing 3,000 LOC
- CI needs build validation

**Effort:** Medium initial, Low ongoing

---

## Recommendation: Option B - Adopt TypeScript

### Rationale

1. **Scale Alignment**: Target is 15,000+ LOC
2. **Pattern Matching**: Suite provides TypeScript patterns to follow
3. **VS Code Ecosystem**: Native TypeScript support
4. **Type Safety**: Critical for runtime settings CLI complexity
5. **Maintainability**: Types serve as documentation

### Implementation Plan

#### Step 1: Add TypeScript Infrastructure (Phase 2, Week 1)

```json
// package.json additions
{
  "devDependencies": {
    "typescript": "^5.9.3"
  },
  "scripts": {
    "compile": "tsc -p .",
    "watch": "tsc -p . --watch"
  }
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./out",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "declaration": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "out"]
}
```

#### Step 2: Migrate Existing Files (Phase 2, Week 2)

| File | Migration Complexity |
|------|---------------------|
| `extension.mjs` → `extension.ts` | Low |
| `runtime-settings-cli.mjs` → `runtime-settings-cli.ts` | Medium |
| `runtime-contracts.mjs` → `runtime-contracts.ts` | Low |
| `runtime-execution-*.mjs` → `*.ts` | Low |
| `installed-user-observation.mjs` → `*.ts` | Low |

#### Step 3: Update Test Infrastructure (Phase 2, Week 2)

```json
// package.json test script update
{
  "scripts": {
    "pretest": "npm run compile",
    "test": "npm run unit && npm run validate",
    "unit": "node --test out/tests/*.test.js"
  }
}
```

#### Step 4: Update CI Workflow (Phase 2, Week 2)

```yaml
# .github/workflows/spec-gates.yml
jobs:
  build:
    steps:
      - run: npm ci
      - run: npm run compile
      - run: npm test
```

#### Step 5: Migrate Tests (Phase 2, Week 3)

```
tests/
├── *.test.mjs → *.test.ts
└── (compiled to out/tests/)
```

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Build breaks CI | Medium | High | Add compile step to CI |
| Module resolution issues | Low | Medium | Use NodeNext resolution |
| Type definition gaps | Low | Low | Add @types/* as needed |
| Migration errors | Medium | Medium | Incremental migration |

---

## Success Criteria

1. [ ] All existing `.mjs` files converted to `.ts`
2. [ ] `npm run compile` succeeds without errors
3. [ ] `npm test` passes all existing tests
4. [ ] CI workflow includes build step
5. [ ] Type coverage > 80% for new code

---

## Timeline

| Week | Activity |
|------|----------|
| Week 1 | Add TypeScript infrastructure |
| Week 2 | Migrate existing files |
| Week 3 | Migrate test infrastructure |
| Week 4 | Validate and stabilize |

**Total Effort:** ~2 weeks of focused work

---

## Approval

This recommendation requires decision before Phase 2 implementation begins.

- [ ] Approved: Adopt TypeScript
- [ ] Rejected: Maintain vanilla JavaScript
- [ ] Deferred: Revisit after Phase 2 planning
