# Build the @knix/utils development logger

**Slice:** [utils-log-entry-point](utils-log-entry-point.md)

## Context

`@knix/utils` 0.0.1 ships one small real utility as the first release of the npm publishing proof ([decision log](../decision-log.md), "The 0.0.1 utility"). The operator chose a development logger, modelled on one they already use and written fresh. Every design point below was ruled one question at a time and is recorded in the decision log, from "Logger requirements" through "@knix/utils drops private with the logger". This PRD cites each entry by its title.

The repo has no code under `packages/utils` yet: only a `private: true`, `0.0.0` manifest. Nothing in the repo has a test runner, a TypeScript setup, a tsconfig or a `.github/` directory. This slice therefore also sets the build, test and CI pattern that later `@knix/*` entry points inherit.

## Decision

The logger is development-only ("Logger is development-only"): it exists to debug, and production code never calls it.

### API

- **Entry points** ("Logger import form", "Logger global install"):
  - `@knix/utils/log` exports `log`, a frozen object.
  - `@knix/utils/log/global` installs that same object on `globalThis`.
  - The package `exports` map lists these two subpaths only, with no root entry.
  - Only the global entry is listed in `sideEffects`.
- **Methods** ("Logger names", "Logger badge palette", "Logger return value and empty-value display"):
  - **Levels:** `log.log`, `log.warn`, `log.error`.
  - **Badges:** `log.red`, `log.yellow`, `log.green`, `log.cyan`, `log.blue`, `log.magenta`, `log.gray`.
  - **Scope:** `log.scope(owner)`.
  - **Tap:** `log.tap(value, ...rest)`.
- **`log.tap`** ("Logger return value and empty-value display"):
  - **Behaviour:** the one wrapper. It logs with the prefix, shows `''`, `'null'` and `'undefined'` readably, and returns `value`.
  - **Its DevTools link:** points at the caller only where the bundler ignore-lists dependencies and the browser honours that.
    - Its docs say where it does not (see Findings).
- **Scope label** ("How the logger names its caller", "How code binds the logger's scope label"):
  - **Owner:** a string, a class or an instance; given a class or instance, it reads the class name.
  - **Output:** `Class.member` when the stack gives a member, and the label alone otherwise.
  - **A string label** prints exactly as written.
  - **No per-call form:** there is no per-call `(component, location)` form.

### Mechanism

- **Bound methods** ("Logger import form", "Logger return value and empty-value display"):
  - **Getter:** each level and badge reads the caller when accessed and returns `console.<level>.bind(console, ...prefix)`.
  - **Badges** bind `console.log`.
  - **The call runs in the caller's frame,** so the DevTools link points at the caller in every browser and in Node.
- **Caller prefix** ("How the logger names its caller", "Leading underscore in logger class names"):
  - **Reading the stack:**
    - **V8:** structured call sites through `Error.prepareStackTrace`, set, captured and restored synchronously.
    - **Other engines:** a string parser for the Safari and Firefox stack formats.
  - **Walking up:** cross native frames only, and stop at the first non-native frame.
  - **Output** ("Caller prefix is the same in every engine"): the method or function name the stack gives, the same string in every engine.
    - **Never** a class or a file and line read from the stack; Firefox and WebKit stacks carry no class.
    - **A class or instance passed to `log.scope`** loses one leading `_` from its name.
  - **A short or empty stack** is tolerated, and prints no automatic prefix.
- **Badge colour** ("Logger badge colour in Node", "When Node badges get colour", "How the logger reads FORCE_COLOR", "Logger badge palette"):
  - **Browsers:** `%c`, with one fixed CSS background and text pair per badge.
    - Each pair meets WCAG AA text contrast.
  - **Node:** the 16-colour ANSI background and text codes, under Node's own colour rule.
    - **`FORCE_COLOR` decides first, as Node reads it:** empty, `1`, `true`, `2` or `3` turns colour on.
    - **`0`, `false` or any other value** turns it off.
    - **Otherwise the stream's `hasColors()` decides:** stdout for `log.log` and badges, stderr for `log.warn` and `log.error`.
    - **A stream that is not a terminal** prints plain.
  - **Code:** one file, with no `node:util` import. Palette values are written fresh.

### Global install and setup

- **Global install** ("Logger global install", "Logger names"):
  - **Property:** a writable, configurable, non-enumerable data property named `log`, holding the frozen object.
    - It is defined only if the name is absent from `globalThis`.
  - **An existing knix logger is kept.** It warns once if its version is not caret-compatible.
    - The version lives under `Symbol.for('@knix/utils/log')`.
  - **Anything else under the name is kept.** It warns once and points to the import.
  - **Types:** a global `KnixLogger` interface plus `var log: KnixLogger`, so copies merge without TS2403.
- **Setup documentation** ("Loading the logger global in development only"):
  - **One setup line per tool in the package README:**
    - Angular `configurations.development.polyfills`.
    - A Vite `import.meta.env.DEV` guard.
    - Vitest and Jest `setupFiles`.
    - Storybook `.storybook/preview.ts`.
    - `node --import`, and the `tsconfig` `types` entry.
  - **Run before citing:** the Jest line for an ESM-only setup file, and the Storybook line.
  - **Also stated:** development-only use, the Vitest `FORCE_COLOR=1` requirement, and `tap`'s link limits.

### Tests

- **Runner** ("Logger test runner"): Vitest 5.1.1, with a Node project and a browser project.
- **Browser project:** `@vitest/browser-playwright` 5.1.1 in Chromium, Firefox and WebKit.
  - So each stack parser meets its engine's real stacks.
- **Where each runs** ("Where knix's tests run"):
  - **Root `test`:** the build and the Node project, which the pre-commit gate runs on code commits.
  - **Root `test:browser`:** the three browser instances, in CI and at each code task's checkpoint.
  - **Docs-only commits:** the gate's docs scope runs `check:law-links` instead.
- **Colour tests** pass a stream in, rather than reading `process.stdout`.

### Defaults taken here, not ruled

Surfaced at the handoff for the operator's approval:

- **Version** (ruled since: "@knix/utils drops private with the logger"): this slice removes `private: true`; `main` keeps `0.0.0`.
  - `npm-publishing-poc` adds the changeset that publishes `0.0.1`.
- **Build:** plain `tsc`, with `typescript` pinned at exact `6.0.3`.
  - This follows the "Tool versions" ruling's "typescript is 6.x.x".
  - One emitted `.js` and `.d.ts` per entry. No bundler, no runtime dependencies, no `any`.
- **CI:** this slice adds the repo's first workflow, `.github/workflows/ci.yml`.
  - **Pinning:** every action pinned to a full SHA, which the repository settings require.
  - **Jobs:** typecheck, build and both test projects, installing the Playwright browsers each run with no cache (decision log "Where knix's tests run").
  - **Consumer builds:** a Vite production build importing only `@knix/utils/log` carries no global installer.
    - A `DEV`-guarded import of the global is absent from production output.
- **Scoped object:** `log.scope(owner)` returns an object with the same methods as `log`, `scope` aside.
- **Out of scope:**
  - **The ban rules** ("Logger ban mechanism", "Closing the logger ban's gaps"): law work, worded through the reviewing peer.
  - **Automated scope labelling:** [logger-automated-scope-labels](logger-automated-scope-labels.md).
- **Architecture records:** none. knix keeps no `knowledge/adr/` records.
  - Every ruling this slice rests on lives in the decision log ("This decision log").

## Alternatives considered

Every ruling below took the option badged `[ideal]`, so no ideal was deferred.

- **Import form** ("Logger import form"):
  - **Globals only:** rejected. A global hides the dependency the draft import-by-name law asks each unit to name.
  - **Plain function exports that read the stack:** rejected. The link points into knix unless ignore-listing rescues it.
- **Names** ("Logger names"): `lg`, `lg.err` and `KnixLg` were superseded by "just log instead of logger".
- **Per-call `(component, location)` variants** ("How the logger names its caller"): dropped.
  - A scope label plus the automatic prefix replaces them.
- **Palette** ("Logger badge palette"):
  - **Semantic aliases:** rejected. `log.warn` and `log.error` already carry severity.
  - **About 38 named colours:** rejected. Node would need 256-colour or truecolor conversion code.
  - **One `log.badge(colour, …)`:** rejected. Node would have to parse CSS colours.
- **Colour detection** ("When Node badges get colour"): "is a terminal, unless `NO_COLOR` is set" was superseded.
  - Node's own rule replaced it, which also honours `FORCE_COLOR` and `TERM=dumb`.
- **Return value and empty-value display** ("Logger return value and empty-value display"):
  - **Drop both features:** rejected. `tap` brings both back without touching the bound methods.
  - **Wrap every method:** rejected. Every link would move to knix wherever `tap`'s link fails.
  - **Ship `.map` files carrying both ignore-list fields:** not adopted.
    - Whether pre-bundlers keep a dependency's ignore list is unverified.
- **Leading underscore** ("Leading underscore in logger class names"):
  - **Print runtime names as reported:** rejected. Angular development builds would show `_CartService`.
  - **Strip every leading underscore:** rejected. One is all the bundler adds.
  - **Turn on `keepNames`:** rejected. The Angular builder does not expose it.
- **Test runner** ("Logger test runner"):
  - **`node:test` with hand-written stack strings:** rejected. Fixtures drift from real engines, and nothing catches it.
  - **Vitest with a Node project only:** rejected, for the same drift risk.

## Findings

Probes and source reads from 2026-11-17 to 2026-11-19, each tagged by how it was checked.

**Cold pass, 2026-11-20:** eight claims went to cold agents (ledger under Verification).

- **Corrected:** Node's `FORCE_COLOR` reading.
- **Narrowed:** Chrome's ignore-list sources and the Safari fallback.
- **Residual unknowns:**
  - Firefox's behaviour, checked only against its bug tracker.
  - Chrome's automatic third-party default.
  - Whether Chrome console API messages carry a `scriptId`.

### Console links

- **Bound call frames** (VERIFIED, probe, Vite 8.3.8 dev with headless Chrome over CDP):
  - A call through `console.log.bind(console, prefix)` reports the caller as its first stack frame.
  - A wrapper's first frame is the wrapper itself, in the dependency chunk.
- **Vite's ignore-list field** (VERIFIED, same probe): the dependency chunk's map carries `x_google_ignoreList: [0]`.
  - It carries no `ignoreList`.
- **Chrome DevTools** (VERIFIED, source read of devtools-frontend `DebuggerWorkspaceBinding.ts`):
  - The console link moves to the first frame not on the ignore list.
    - This holds for a message anchored by its stack trace, with no `scriptId` or breakpoint frame.
    - Whether console API messages ever carry a `scriptId` is unchecked.
  - The list comes from custom patterns and from known third-party scripts.
    - A source map's ignore list marks a script as third-party.
    - So it counts only while the automatic third-party setting is on; its default is unchecked.
  - The user can turn ignore-listing off.
- **Safari** (VERIFIED, source read of WebKit `ConsoleMessageView` and `SourceMap.js`):
  - The console uses the first non-native, non-anonymous, non-blackboxed frame.
    - If every such frame is blackboxed, it falls back to the first non-native, non-anonymous one.
  - The source-map reader honours only `ignoreList`.
- **Firefox** (ATTESTED, from its bug tracker): the console message location ignores blackboxing.
  - Bugs 1861326 and 1060904 are open; 1216836 is a duplicate. Firefox source and a live run were not checked.

### Ecosystem

- **Bundlers** (INFERRED, from their sources and docs, per a research subagent):
  - **Vite:** `server.sourcemapIgnoreList` defaults to `node_modules`.
  - **Rollup 3.18 and later:** writes `x_google_ignoreList` for `node_modules`.
  - **The Angular esbuild builder:** writes `x_google_ignoreList` for `node_modules` when source maps are on.
  - **webpack:** has no default.
  - **Next:** writes `ignoreList`, the ECMA-426 standard field.
- **Logging libraries** (INFERRED, same research): loglevel binds to keep stack traces.
  - debug, consola, tslog and Angular's `Console` wrap.
- **Registry** (VERIFIED, npm registry, 2026-11-19):
  - `vitest` 5.1.1 peers `vite ^6.4.0 || ^7.0.0 || ^8.0.0`.
  - `@vitest/browser-playwright` 5.1.1 peers `playwright *`.
  - `playwright` is 1.65.1, and the newest `typescript` 6.x is 6.0.3.

### Runtimes

- **Angular class names** (VERIFIED, probe, Angular 22.3.0 development build): classes are named `_CartService`.
  - The build emits `var CartService = class _CartService {`, with esbuild 0.28.2.
  - `@angular/build` 22.3.0 has no `keepNames` option.
- **Engine naming** (VERIFIED, probes, Chrome and JavaScriptCore; corrected 2026-11-21):
  - V8 structured call sites give `Class.method`.
  - Firefox and WebKit stack strings give the bare method name, `add@url:line:col` (VERIFIED, probe, Playwright 1.65.1, 2026-11-21).
    - JavaScriptCore has no structured call sites; the earlier "`Class.method`" claim held for V8 only.
  - Async callbacks have no enclosing method.
  - Stack `file:line` is not source-mapped.
- **Node console** (VERIFIED, probe, Node 26.8.1):
  - It drops `%c` and its CSS argument silently.
  - A top-level `''` prints invisibly; a nested one prints quoted.
- **Test runners' streams** (VERIFIED, probe):
  - **Vitest 5.1.1 workers:** `isTTY` is undefined even under a pty, and `FORCE_COLOR` reaches them.
  - **Jest 30.5.2:** `isTTY` is true under a pty and undefined when piped.
- **Bundle output** (VERIFIED, probe, Vite 8.3.8):
  - A production build drops a `DEV`-guarded `import()`.
  - Subpath-only exports plus a `sideEffects` list keep unused areas out of the bundle.

## Acceptance criteria

### Package and build

- [ ] `packages/utils/package.json` declares the package shape:
  - `exports` for exactly `./log` and `./log/global`, with types and import conditions.
  - `sideEffects` listing only the built global entry.
  - no `private` field, version `0.0.0`, no `dependencies`, and an exact `typescript` `6.0.3` dev pin.
- [ ] `npm run build -w @knix/utils` exits 0 and emits one `.js` and one `.d.ts` per entry with plain `tsc`.
- [ ] The source contains no `any`.

### Behaviour

- [ ] `log` is frozen, and `log.log`, `log.warn`, `log.error` and the seven badges are getters.
  - Each returns a function that writes through the bound `console` method.
  - A test asserts it is not a wrapper: a `console` spy's captured stack holds no knix frame.
- [ ] `log.tap(value, ...rest)` returns `value`.
  - Tests show `''`, `'null'` and `'undefined'` logged as visible text.
- [ ] Prefix tests run in Node, Chromium, Firefox and WebKit through the Vitest projects. In each they assert:
  - The method name for a method call, and the function name for a plain function, the same string in all four.
  - `Class.method` from a class or instance `log.scope` label with a single leading `_` stripped, and a string label printed as written.
  - No file or line ever printed.
- [ ] Tests cover a short or empty stack, with no throw and no automatic prefix.
- [ ] Tests show `Error.prepareStackTrace` restored after each getter access.
- [ ] Colour tests pass a stream in and cover:
  - `FORCE_COLOR` empty, `1`, `true`, `2` and `3` on; `0`, `false` and an unrecognised value off.
  - `hasColors()` true and false, and a non-terminal stream plain.
  - Browser `%c` output.
- [ ] A test asserts each badge's CSS pair has a contrast ratio of at least 4.5:1.

### Global

- [ ] Importing `@knix/utils/log/global` defines `globalThis.log` when absent: writable, configurable, non-enumerable.
- [ ] Tests cover the three existing-value cases:
  - A compatible knix logger is kept silently.
  - An incompatible one is kept with one warning.
  - A foreign value is kept with one warning pointing to the import.
- [ ] A type test compiles two declarations of the global `KnixLogger` and `var log` without TS2403.

### CI and docs

- [ ] `.github/workflows/ci.yml` runs on push and pull request to `main`:
  - Every action pinned to a full SHA.
  - Playwright browsers installed each run, with no cache.
  - Typecheck, build and both Vitest projects run.
- [ ] Tests run where "Where knix's tests run" puts them:
  - Root `test` runs the build and the Node project; root `test:browser` runs the three browser instances.
  - A docs-only commit runs `check:law-links` through the test gate's docs scope, and skips typecheck.
- [ ] The CI consumer builds pass:
  - A Vite production build importing only `@knix/utils/log` contains no global installer code.
  - A production build with a `DEV`-guarded global import contains no `@knix/utils/log` string.
- [ ] `packages/utils/README.md` states the logger is development-only, and gives the setup line per tool.
  - It cites the Jest ESM and Storybook lines only after a recorded run of each.
  - It names the Vitest `FORCE_COLOR=1` need and `tap`'s link limits.
- [ ] `ecorn validate -p .` and `npm run check:law-links` report no errors.

## Verification

| Claim | Verdict | Disposition | Evidence |
|---|---|---|---|
| D1 — Chrome DevTools links a console message to the first stack frame not ignore-listed; the list draws on source-map ignore lists, the third-party setting and custom patterns, and the user can turn it off | VERIFIED | — | devtools-frontend `front_end/models/bindings/DebuggerWorkspaceBinding.ts:765-841`, `front_end/models/workspace/IgnoreListManager.ts:227-252`, `front_end/models/bindings/CompilerScriptMapping.ts:1192-1193` — source read. Qualified: stack-trace anchors only (`front_end/panels/console/ConsoleViewMessage.ts:622-648`), and a source map's list counts through the third-party setting; folded into Findings |
| D2 — Vite 8.3.8 dev serves a pre-bundled dependency's map with `x_google_ignoreList` and no `ignoreList` | VERIFIED | — | probe: served `node_modules/.vite/deps/tinydep.js.map` carried `"x_google_ignoreList":[0]`, no `ignoreList` |
| D3 — WebKit's source-map reader honours only `ignoreList`, and the console link uses the first non-native, non-anonymous, non-blackboxed frame | VERIFIED | — | WebKit `Source/WebInspectorUI/UserInterface/Models/SourceMap.js:117-149`, `Views/ConsoleMessageView.js:464-467`, `Models/StackTrace.js:153-179` — all-blackboxed fallback folded into Findings |
| D4 — Firefox's console link does not skip blackboxed or ignore-listed frames | ATTESTED | — | Bugzilla 1861326 (NEW), 1060904 (NEW), 1216836 (duplicate of 1861326); mozilla-central source not read, Firefox not run |
| D5 — a direct call through `console.log.bind(console, p)` records the caller as top frame; a wrapper records itself | VERIFIED | — | probe, Node 26.8.1 `node:inspector` `Runtime.consoleAPICalled`: bound → `fBound` top, wrapper → `w` top |
| D6 — an Angular 22.3.0 development build names a class `_CartService`, and the builder has no `keepNames` option | VERIFIED | — | probe: `dist/browser/main.js:30015` `var CartService = class _CartService {`; grep of `@angular/build@22.3.0` for `keepNames` found none; `src/tools/esbuild/application-code-bundle.js:448-450` |
| D7 — Node's colour rule: `FORCE_COLOR` `0` or `false` off, any other value on; else `hasColors()`, which honours `NO_COLOR` and `TERM=dumb`; a non-TTY stream has no `hasColors` | REFUTED | CORRECTED — Decision "Badge colour" and the colour acceptance criterion now read: empty, `1`, `true`, `2` or `3` on; `0`, `false` or any other value off | probe, Node 26.8.1 `hasColors.call({}, 16, env)`: `FORCE_COLOR=foo` and `yes` → false; `''`, `1`, `true` → true; `NO_COLOR`, `TERM=dumb` → false; piped `process.stdout.hasColors` undefined |
| D8 — Vitest 5.1.1 with `@vitest/browser-playwright` 5.1.1 runs a Node project and a Chromium, Firefox and WebKit browser project in one run from one config | VERIFIED | — | probe: `tsc --noEmit` on the config exit 0; `vitest list` resolved `[node]` plus `[browser (chromium)]`, `[browser (firefox)]`, `[browser (webkit)]`; browsers not installed, so no browser test ran. An earlier dispatch returned no verdict and was re-dispatched |

**Cold-agent:** claude-sonnet-5-5 2026-11-20T14:12:46Z — D1
**Cold-agent:** claude-sonnet-5-5 2026-11-20T14:11:55Z — D2
**Cold-agent:** claude-sonnet-5-5 2026-11-20T14:12:01Z — D3
**Cold-agent:** claude-sonnet-5-5 2026-11-20T14:11:51Z — D4
**Cold-agent:** claude-sonnet-5-5 2026-11-20T14:11:30Z — D5
**Cold-agent:** claude-sonnet-5-5 2026-11-20T14:12:59Z — D6
**Cold-agent:** claude-sonnet-5-5 2026-11-20T14:11:56Z — D7
**Cold-agent:** claude-sonnet-5-5 2026-11-20T14:12:43Z — D8
