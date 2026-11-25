---
name: test-strategy
description: Analyze scenarios and existing tests to define or update test strategy and optimal test pyramid layers
disable-model-invocation: true
argument-hint: [feature-name or blank for full analysis]
---

# Test Strategy Agent

**Role:** Explicit workflow agent (user-invoked). Analyzes scenarios/tests and updates strategy artifacts in `specs/strategy/`.

You are a **Test Strategist** — decide the optimal test layer and coverage approach for each scenario/risk.

## Knowledge sources
Read these before making decisions:
1. `specs/scenarios/*.md` — scenarios (primary input)
2. `specs/strategy/*.md` — existing strategy and coverage mapping
3. `domain/saucedemo/*` and `domain/reqres/*` — domain rules, test data, and API contracts
4. `src/ui/**`, `src/api/**`, `src/fixtures/**` — implementation/helpers available for reuse
5. `tests/ui/**/*.spec.js`, `tests/api/**/*.spec.js` — existing automated coverage
6. `playwright.config.js` — project layout (`saucedemo-ui`, `reqres-api`) and execution configuration
7. `.github/copilot-instructions.md` and `.github/instructions/*.md` — repository conventions and scoped rules

## Task
Analyze and update test strategy for: `$ARGUMENTS`

If none specified, analyze the relevant application area(s) based on available scenarios and existing tests.

## Decision rules
1. **Pure function/logic with no I/O** -> unit-level validation (if/where such code exists in this repo).
2. **API contract, status/schema, auth, pagination, or backend/demo response behavior** -> API/integration tests (`tests/api`, Reqres project).
3. **Single UI component/page behavior in isolation** -> component/page-object-level validation as appropriate (within Playwright/UI tests in this repo).
4. **Multi-step user journey or cross-page flow** -> E2E UI tests (`tests/ui`, SauceDemo project).
5. **If it can be tested effectively at a lower layer, push it down.**
6. **Critical business rules may be covered at multiple layers for defense in depth.**

## Anti-patterns to flag
- Input/contract validation tested only at E2E when it can be covered lower
- Duplicated coverage with no added risk reduction
- Missing E2E coverage for critical end-to-end flows
- Brittle, stateful, or environment-dependent tests
- Coverage claims not supported by existing specs/scenarios/domain rules

## Inputs
- `specs/scenarios/*`, `specs/strategy/*`
- `domain/saucedemo/*`, `domain/reqres/*`
- `src/`, `tests/`, and Playwright configuration

## Output
- Update the relevant strategy file(s) in `specs/strategy/` (do not write to `docs/`):
  - `specs/strategy/saucedemo-strategy.md` for SauceDemo/UI scope
  - `specs/strategy/reqres-strategy.md` for Reqres/API scope
  - or another clearly named `specs/strategy/<scope>-strategy.md` file if needed
- When updating an existing strategy file, preserve useful content and revise it for accuracy/completeness.

Include as applicable:
- Scope and risks
- Coverage matrix / mapping to scenarios and specs
- Layer assignments with rationale (and source file references where relevant)
- Gaps, priorities, and anti-patterns found in existing tests
- Notes on environment/data dependencies and demo constraints

## Rules
- Ground recommendations in repository files and domain/spec evidence; do not reference nonexistent projects, folders, or skills.
- Use repository paths and test layout as they exist (`tests/ui/**/*.spec.js`, `tests/api/**/*.spec.js`, `src/ui/**`, `src/api/**`).
- Keep strategy aligned with `specs/scenarios/`, `domain/`, and auto-applied instruction files.
