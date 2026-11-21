# Plan: Build the @knix/utils development logger

This plan builds `@knix/utils/log` and its opt-in `@knix/utils/log/global` entry, the first real code in `@knix/utils`, together with the build, test and CI pattern later `@knix/*` entry points inherit. The design is ruled in [the PRD](../../knowledge/roadmap/utils-log-entry-point.prd.md), which closes [the slice](../../knowledge/roadmap/utils-log-entry-point.md). This plan restates none of it: each task names the PRD sections it implements, and the PRD's `## Acceptance criteria` are the done-signals.

**Class:** plan
**Date:** 2026-11-20
**Scope:** `packages/utils/` (manifest, source, tests, configs, README), the root `package.json` scripts and lockfile, a new root `ai.config.jsonc` (the test gate's docs scope) and its lock, and `.github/workflows/ci.yml`.
**Prerequisite:** knowledge/roadmap/utils-log-entry-point.prd.md
**Status:** Ready to execute
**Verified:** 2026-11-21 — 12 cold checks folded (3 refuted and corrected, 2 inferred and settled by task steps); the fifth reconciliation audit returned HONORED.

**Amended:** 2026-11-21 by my Question 70 A (decision log "Caller prefix is the same in every engine"): no class from the stack; the `_` strip moves to Task 2.

## Starting position

- **Empty package:** `packages/utils/` holds only `package.json`.
  - **It has:** `private: true`, `0.0.0`, `"type": "module"` and `publishConfig.access: "public"`.
  - **It lacks:** `exports`, scripts and dependencies.
- **No toolchain:** no package or the root declares TypeScript, a tsconfig, a test runner or a `.github/` directory.
  - **Root:** the only dev dependency is `@changesets/cli` 3.0.3.
  - **Root scripts:** `changeset`, `check:law-links`, `version-packages` and `release`.
- **Pre-commit hooks pick up root scripts:** two hooks run the root `test` and `typecheck` scripts against the commit tree.
  - **Missing script:** each skips silently (`missing_script_fails: false`).
  - **Consequence:** once Task 1 adds those root scripts, every later commit runs them, docs-only commits included, unless a scope says otherwise.
- **Ignore rules:** `.gitignore` already ignores `dist/` and `coverage/`.
- **Local runtime:** Node 26.8.1 and npm 11.19.0.
  - **Registry:** `typescript` 6.0.3, `vitest` 5.1.1, `@vitest/browser-playwright` 5.1.1, `playwright` 1.65.1 and `vite` 8.3.8.
  - **Peers:** `vitest` 5.1.1 peers `@types/node` `^22.0.0 || >=24.0.0`, and accepts Node `^22.12.0 || ^24.0.0 || >=26.0.0`.

## Tasks

1. **Toolchain and the caller prefix**
   - **Package** (PRD "Package and build" criteria; decision log "@knix/utils drops private with the logger"):
     - **Manifest fields:** remove `private`, keep `0.0.0`, set `files` to `dist`, and list only the built global entry in `sideEffects`.
     - **Exports:** exactly `./log` and `./log/global` into `dist/`, each with `types` and `import` conditions.
     - **Scripts:** `build`, `typecheck`, `test` (build, then `vitest run --project node`; Task 5 imports the built package) and `test:browser` (`vitest run --project browser`).
     - **Dev dependencies,** pinned exact in `packages/utils`: `typescript` 6.0.3, `vite` 8.3.8, `vitest` 5.1.1, `@vitest/browser-playwright` 5.1.1, `playwright` 1.65.1, `@types/node` newest 24.x.
     - **Root scripts:** `build`, `typecheck`, `test` and `test:browser`, each running the workspace script with `--workspaces --if-present`.
   - **Setup and configs** (decision log "Where knix's tests run"):
     - **Install:** `npm install`, then `npx playwright install chromium firefox webkit`, a machine-level browser cache outside the repo.
     - **Docs scope:** a new root `ai.config.jsonc` with one test-gate scope for `*.md`, `.ai/**/*.md`, `knowledge/**`, `draft/**`, running `check:law-links`.
     - **tsconfig:** sets `strict`, `module` and `moduleResolution` `nodenext`, `declaration`, `rootDir`, `outDir` and `types` explicitly, so no TypeScript 6 default decides them.
     - **Two tsconfigs:** the build config emits `src/` only; the typecheck config also covers tests.
     - **Vitest,** per "Logger test runner": a node project (`*.test.ts`, `*.node.test.ts`) and a browser project (`*.test.ts`, `*.browser.test.ts`) in headless Chromium, Firefox and WebKit.
   - **Caller prefix module** (PRD "Caller prefix"):
     - **Reading:** V8 structured call sites through `Error.prepareStackTrace`, restored synchronously, and a string parser for the Safari and Firefox formats.
     - **Walking:** past native frames only; no prefix for a short or empty stack.
     - **Output:** the method or function name, the same in every engine; never a class, file or line.
     - **Tests** (shared `*.test.ts`, all four engines): method and function names, one expected string each; no class, file or line in any prefix.
     - **Edge tests** (shared): a short or empty stack, and `Error.prepareStackTrace` restored.
   - Checkpoint: `npm run test:browser` reports all three browser instances and exits 0.
     - **Browser failure bites:** make one shared test fail once; `npm run test:browser` exits non-zero; revert it.
     - **Gates:** `ecorn build` and `ecorn validate -p .` exit 0, and the commit's test and typecheck gates pass.
     - **Docs commit timed:** stage only a fresh throwaway docs edit and run `time ecorn hook git-pre-commit` once, both scopes, as git does.
     - **Docs result:** the gate runs `check:law-links` and skips typecheck; report the time, then unstage and revert the edit.
   - Commit type: `feat(utils):`. Rollback: `git revert` the commit, and `npx playwright uninstall` for the browsers.

2. **The `log` object**
   - **API** (PRD "API", "Bound methods", "Scope label"):
     - **Levels:** a frozen `log` whose `log`, `warn` and `error` getters return `console.<level>.bind(console, ...prefix)`.
     - **Scope:** `log.scope(owner)` takes a string, class or instance, and returns an object with the same methods, `scope` aside.
     - **Tap:** `log.tap(value, ...rest)` returns `value`, and shows `''`, `'null'` and `'undefined'` readably.
   - **Tests:**
     - **Frozen and getters:** `log` is frozen, each level is a getter, and `Error.prepareStackTrace` is restored after each read.
     - **Bound, not wrapped:** a `console` spy's captured stack holds no knix frame (all four engines).
     - **Scope:** a string label prints exactly as written.
     - **Scope from a class or instance:** reads the class name and strips one leading `_`; from a method, `Class.method` in all four engines.
     - **Tap:** `tap` returns `value`, and the empty values print as visible text.
   - Checkpoint: `npm run test:browser` exits 0, `grep -rnw any packages/utils/src` finds no `any` type, and the commit's gates pass.
   - Commit type: `feat(utils):`

3. **Badges and colour**
   - **Badges** (PRD "Badge colour"; decision log "Logger badge palette"): `log.red` … `log.gray` as getters binding `console.log`, in one file with no `node:util` import.
     - **Browsers:** `%c` with one fixed CSS background and text pair per badge, palette values written fresh.
     - **Node:** 16-colour ANSI codes, gated by the colour rule below.
   - **Node colour rule** (decision log "How the logger reads FORCE_COLOR"):
     - **First:** the logger reads `FORCE_COLOR` itself. Empty, `1`, `true`, `2` and `3` are on; anything else is off.
     - **Only when it is unset:** the stream's `hasColors()` decides, stdout for `log.log` and badges, stderr for `warn` and `error`.
     - **A stream without `hasColors`** prints plain.
   - **Tests:**
     - **Colour rule** (node project): pass a stream and an environment in, covering each `FORCE_COLOR` value, `hasColors()` true and false, and a non-terminal stream.
     - **Badges bound** (shared): each badge is a getter, and a `console` spy's captured stack holds no knix frame.
     - **Browser output** (browser project): `%c` output.
     - **Contrast** (shared): every CSS pair reaches at least 4.5:1.
   - Checkpoint: `npm run test:browser` exits 0, and the commit's gates pass.
   - Commit type: `feat(utils):`

4. **Global entry and types**
   - **Install** (PRD "Global install"): `@knix/utils/log/global` defines `log` on `globalThis` only when the name is absent, as a writable, configurable, non-enumerable data property.
     - **Version key:** the version lives under `Symbol.for('@knix/utils/log')`.
     - **An existing knix logger** is kept, with one warning when its version is not caret-compatible.
     - **A foreign value** is kept, with one warning pointing to the import.
   - **Types:** a global `KnixLogger` interface plus `var log: KnixLogger`.
   - **Tests:**
     - **The three existing-value cases,** plus the property descriptor.
     - **A type test:** two copies of the global declaration compile with `tsc --noEmit` and no TS2403, run from `typecheck`.
   - Checkpoint: `npm run test:browser` exits 0, and the commit's gates pass, the type test included.
   - Commit type: `feat(utils):`

5. **Consumer-build tests**
   - **Fixtures** (PRD "CI and docs" criteria): two minimal Vite apps under `packages/utils/test/`, built through Vite's `build()` API from a node-project test.
     - **Plain import:** importing only `@knix/utils/log` yields output with no global installer code.
     - **Guarded import:** an `import.meta.env.DEV`-guarded import of the global yields production output with no `@knix/utils/log` string.
     - **Production mode:** set `process.env.NODE_ENV` to `production` around each `build()`, then restore it; under Vitest, `import.meta.env.DEV` otherwise stays true.
   - Checkpoint: `npm run test:browser` exits 0, and the commit's test gate passes; the consumer-build tests run in the node project.
     - **Assertions bite:** each fails when its fixture's import is switched to the other form, checked once by hand, then reverted.
   - Commit type: `test(utils):`

6. **README**
   - **Content** (PRD "Setup documentation"): `packages/utils/README.md` states development-only use, `tap`'s link limits and the Vitest `FORCE_COLOR=1` need, and gives one setup line per tool.
     - **Tools:** Angular `configurations.development.polyfills`, a Vite `import.meta.env.DEV` guard, Vitest and Jest `setupFiles`, Storybook `.storybook/preview.ts`, `node --import`, and the `tsconfig` `types` entry.
   - **Recorded runs:** run the Jest line (ESM-only setup file) and the Storybook line in throwaway probes.
     - **Probe directories:** `mktemp -d` under `~/tmp/agent/` with the `knix-worker-<slug>-` prefix, each deleted by exact path after.
     - **Record:** each run's tool version and outcome go in the commit body.
     - **On failure:** a line whose run fails is left out, and the operator is told.
   - Checkpoint: `ecorn validate -p .` exits 0, and the README covers every point under Content.
   - Commit type: `docs(utils):`

7. **CI workflow**
   - **Workflow** (PRD "Defaults taken here" CI bullet): `.github/workflows/ci.yml` on push and pull request to `main`, with `permissions: contents: read`.
     - **Runner:** Node 24 with the npm cache, then `npm ci`.
     - **Browsers** (decision log "Where knix's tests run"): `npx playwright install --with-deps chromium firefox webkit` on every run, with no cache.
     - **Steps:** `npm run typecheck`, `npm test` (which builds), `npm run test:browser`.
   - **Pinning:** every `uses:` is a full 40-character commit SHA, with the release tag in a trailing comment.
     - **Resolution:** at execution, through `gh api` against each action's latest release.
   - Checkpoint: every `uses:` line matches `@[0-9a-f]{40}`, and the file parses as YAML.
     - **SHA check:** each SHA resolves to its commented tag through `gh api`.
     - **Shape check:** the file names push and pull-request triggers on `main`, the install step, the three steps above and no `actions/cache`.
     - **First real run:** waits for the operator-confirmed push.
   - Commit type: `ci:`

8. **Verify and delete this plan**
   - **Walk:** every PRD `## Acceptance criteria` box against the tree; each needs an observed check.
   - **Repo check:** `ecorn validate -p .` exits 0.
   - **Delete:** `rm draft/plan/utils-log-entry-point.plan.md`, and commit; the docs-scope gate runs `check:law-links` on that commit.
   - Checkpoint: every criterion has an observed check, `ecorn validate -p .` exits 0, the commit's gates pass, and the plan file is gone.
   - Commit type: `docs(plan):`

## Out of scope

- **Publishing:** the changeset and the `0.0.1` publish belong to `npm-publishing-poc`.
- **Ban rules:** "Logger ban mechanism" and "Closing the logger ban's gaps" are law work, worded through the reviewing peer.
- **Automated scope labels:** `logger-automated-scope-labels`.
- **Shipping `.map` files** carrying both ignore-list fields, which "Logger return value and empty-value display" did not adopt.

## Risks / guards

- **Pre-commit cost:** from Task 1 on, a code commit runs a build and the node project; a docs-only commit runs `check:law-links`.
  - **Guard:** none beyond patience; never bypass the hook.
- **Browser console capture:** Vitest's browser mode forwards `console` to the terminal.
  - **Guard:** the bound-method tests spy on `console` before reading a getter, so they bind the spy.
  - **Unconfirmed engines:** the cold check (T2 row) confirmed this for V8 only; Task 2's Firefox and WebKit runs settle the other two.
- **WebKit is not Safari:** Playwright's WebKit stacks may differ from shipping Safari's (PRD Findings).
  - **Guard:** the string parser tolerates a frame it cannot read, and prints no prefix for it.
- **CI unproven until push:** the workflow only runs on GitHub.
  - **Guard:** Task 7's static checks; the first run is reviewed after the operator confirms the push.
- **Verified 2026-11-20, re-verified 2026-11-21:** twelve cold checks, nine then three for Task 1.
  - **Sources:** the PRD, the tree, ecorn 0.453.0, the registry and Playwright's CI docs.
  - **Refuted and corrected:** T5 (production mode), T7 (browser cache, by my Question 67 A) and T1 (docs-commit timing).
  - **Inferred, settled at execution:** T2's Firefox and WebKit binding, by Task 2; T1's failing-browser exit code, by Task 1.

## Verification

| Claim | Verdict | Disposition | Evidence |
|---|---|---|---|
| S1 — `packages/utils/` holds only `package.json`; no package or the root declares TypeScript, a tsconfig, a test runner or `.github/`; the root's only dev dependency is `@changesets/cli` 3.0.3 | VERIFIED | — | Deterministic — `ls -A packages/utils` lists only `package.json`; `packages/utils/package.json:4` `"private": true`; root `package.json` `devDependencies` holds only `@changesets/cli` `3.0.3`; no `.github/` |
| S2 — the pre-commit test and typecheck hooks run the root `test` and `typecheck` scripts on the commit tree, skip when the script is missing, and run on every commit | VERIFIED | — | `ai.config.lock.jsonc:388-401` (`missing_script_fails: false`, `tree: "commit"`, empty `staged_paths`); ecorn's git-gate handler read: empty `staged_paths` matches every commit, missing script skips, root `node_modules` overlaid on the commit tree |
| S3 — registry versions and peers as Starting position lists them | VERIFIED | — | Deterministic — `npm view` on 2026-11-20 for `typescript`, `vitest`, `@vitest/browser-playwright`, `playwright`, `vite`; `vitest@5.1.1` `peerDependencies` and `engines` |
| T1 — `tsc` 6.0.3 with explicit `nodenext`, `declaration`, `rootDir`, `outDir` and `types` emits the expected files with no deprecation diagnostic | VERIFIED | — | probe: four files emitted, exit 0, no deprecation output |
| T1 — `npm run <script> --workspaces --if-present` runs only the workspaces that define the script, and exits with the script's code | VERIFIED | — | probe: a workspace without the script was skipped; a failing script's exit code propagated. Not tested: more than one failing workspace |
| T1 — a test-gate scope for `*.md`, `.ai/**/*.md`, `knowledge/**` and `draft/**` running `check:law-links` makes a docs-only commit run that script and skip typecheck; any other staged path runs the full `test` and typecheck; the folder globs match at any depth | VERIFIED | — | ecorn v0.453.0 source (installed 0.453.0): `git-gate.ts:198-203` `npmGateChoice`, `:253`, `:257-260`; `gate-scope.ts` `selectScope` uses `every`; `key-table.ts:807-811`; minimatch probe with `dot: true`. `*.md` matches root files only, so `packages/utils/README.md` is out of scope and runs the full suite. knix has no root `ai.config.jsonc`; Task 1 creates it |
| T1 — `vitest run --project node` runs only the node project; `--project browser` selects exactly the three browser instances; each exits non-zero on a failing test | INFERRED | — | probe, vitest 5.1.1: `vitest list --project node` listed only `[node]`; `--project browser` listed `[browser (chromium)]`, `[browser (firefox)]`, `[browser (webkit)]`; a failing node test exited 1. Browsers not installed, so a failing browser test's exit was not shown; Task 1's `test:browser` checkpoint run settles it |
| T1 — `time ecorn hook git-pre-commit --scope project` measures one commit's pre-commit cost and shows the test gate's chosen script | REFUTED | CORRECTED — Task 1's "Docs commit timed" runs `ecorn hook git-pre-commit` with no `--scope`, as git does, once on a fresh staged tree, and expects the docs-scope line | ecorn v0.453.0: knix's `.git/hooks/pre-commit` passes no `--scope`, so git runs both scopes; `git-gate.ts:260` names a chosen scope but prints nothing for the plain `test` script; `:413-416` reuses a stored passing verdict, so a repeat run on the same tree skips the script |
| T2 — a `console` spy installed before a getter is read proves the method is bound, with no knix frame in the captured stack | INFERRED | — | probe: V8 confirmed by run; Vitest's browser console intercept installs before tests, so the spy wraps it. SpiderMonkey and JavaScriptCore unconfirmed, no engine source read; carried to Risks, settled by Task 2's own browser runs |
| T3 — Node 24's colour handling matches 26.x: `hasColors()` false under `NO_COLOR` and `TERM=dumb`, piped stdout has no `hasColors`, and the `FORCE_COLOR` table is identical | VERIFIED | — | probe on Node v24.22.3; `lib/internal/tty.js` byte-identical to 26.x |
| T4 — two files each declaring `declare global { interface KnixLogger; var log: KnixLogger }` compile without TS2403, and an extra member merges; no global `log` exists in `lib.dom` or `@types/node` | VERIFIED | — | probe: `tsc --noEmit` exit 0; inline differing `var` types do raise TS2403; grep of `lib.dom.d.ts` and `@types/node` found no global `log` |
| T5 — a nested Vite `build()` inside a Vitest node test resolves the package through its symlinked `exports` and drops an `import.meta.env.DEV`-guarded import | REFUTED | CORRECTED — Task 5 adds "Production mode": set `process.env.NODE_ENV` to `production` around each `build()`, then restore it | probe: the build resolved `exports` through the workspace symlink, but under `vitest run` the DEV branch survived; with `NODE_ENV=production` it was dropped |
| T6 — the README's content follows the PRD, and the Jest and Storybook setup lines are proven before they ship | VERIFIED | — | Warm — the PRD's "Setup documentation" names every tool; the two unproven lines are gated on Task 6's own recorded runs, and a failing line is left out |
| T7 — Playwright's CI guidance supports caching the browser binaries keyed on the `playwright` version | REFUTED | CORRECTED — Task 7's Browsers line installs with `--with-deps` on every run, with no cache, per decision log "Where knix's tests run" (my Question 67 A, superseding Question 61 A's cache clause) | Playwright's CI docs, "Caching browsers": "Caching browser binaries is not recommended" (restore takes about as long as download; Linux system dependencies cannot be cached); the example runs `npx playwright install --with-deps` each run |
| T7 — every action resolves to a full commit SHA for its latest release, and the repository requires SHA pinning | VERIFIED | — | `gh api`: `sha_pinning_required: true`; `actions/checkout` v7.0.1 and `actions/setup-node` v7.1.0 each resolve to a 40-character SHA; the setup-node README shows `node-version: 24` with `cache: npm` |
| T8 — the final checks exist: `ecorn validate -p .` and the root `check:law-links` script | VERIFIED | — | Deterministic — root `package.json` script `check:law-links`; `ecorn validate -p .` ran this session |

**Cold-agent:** claude-sonnet-5-5 2026-11-20T23:43:45Z — S2
**Cold-agent:** claude-sonnet-5-5 2026-11-20T23:43:33Z — T1
**Cold-agent:** claude-sonnet-5-5 2026-11-20T23:43:28Z — T1
**Cold-agent:** claude-sonnet-5-5 2026-11-20T23:43:53Z — T2
**Cold-agent:** claude-sonnet-5-5 2026-11-20T23:43:44Z — T3
**Cold-agent:** claude-sonnet-5-5 2026-11-20T23:43:59Z — T4
**Cold-agent:** claude-sonnet-5-5 2026-11-20T23:43:45Z — T5
**Cold-agent:** claude-sonnet-5-5 2026-11-20T23:43:29Z — T7
**Cold-agent:** claude-sonnet-5-5 2026-11-20T23:43:27Z — T7
**Cold-agent:** claude-sonnet-5-5 2026-11-21T03:22:36Z — T1
**Cold-agent:** claude-sonnet-5-5 2026-11-21T03:22:36Z — T1
**Cold-agent:** claude-sonnet-5-5 2026-11-21T03:22:27Z — T1
