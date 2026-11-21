# Decision log

Every ruling the operator has made on knix, in the order they were made, with who ruled and where each is written. The log only grows: a ruling that a later one overrides stays here, marked with what superseded it.

## How to use this log

- **Append, never rewrite.** A new ruling gets a new entry at the end of `## Rulings`. A later ruling that changes an earlier one names it in **Supersedes**, and the earlier entry gains a **Superseded by** line; nothing else in an old entry changes.
- **Entry fields:**
  - **Ruled:** who ruled and through which question. "My Question N" is the knix working session's numbering. "Walk QN" is the reviewing peer's law-walk numbering.
  - **Ruling:** the ruling as made, with the operator's words quoted where the exact words matter.
  - **Written at:** the tracked file that carries it now, or "not yet".
- **Dates** are the day of the ruling when it was recorded. Otherwise they are the day of the commit that first carries the ruling, written "landed `<sha>`".
- **Topic labels, not bare numbers:** an entry is titled by its topic, so it reads without the question that produced it.

## Standing direction

- **Plan first:** plan, get the operator's approval, then execute. One decision question per turn, in the `[ideal]`/`[recommended]` format.
- **Investigate before raising:** before raising a question, issue or gap, look around and research more extensively. Determine whether a better change is needed, or how to make it more robust or thorough. Weigh every option against one principle: no friction that does not pay for itself.
- **Commits and pushes:** every commit needs the operator's approval. Confirm before every push to this public repository. Stay on `main`, with no worktree.
- **No managing session:** knix has no managing session; the operator's approval in the working session is the only gate, the PRD gate included. Before each push, the confirmation shows the operator the `origin/main..HEAD` range plus the results of `ecorn validate -p .` and `npm run check:law-links` (my Question 58 A, superseding my Question 90 A's report to a managing session).
- **ecorn upgrades** (operator, relayed, 2026-11-17): whenever the project is behind the installed ecorn, run `ecorn upgrade -p .` without asking. Committing what it changes still follows the commit and push rules above.
- **Org-neutral:** knix is public and names no employer, organization, host, registry, product or path. Local hooks in the gitignored `ai.config.local.jsonc` call a term-check script that lives outside the repository. A missing term list blocks, and the hooks never print a term (my Question 2 A). Nothing is copied from employer-owned sources; everything is written fresh.
- **Version ceiling** (operator, 2026-11-17): every knix package stays in `0.x.x`. Nothing moves to `1.0.0` until the operator says so.

## Rulings

### 2026-10-27 — Where laws live

- **Ruled:** operator, my Questions 3 A and 5 A; landed `81da205`.
- **Ruling:** each law lives in `knowledge/law/<slug>.law.md`, a document class declared by `.ai/template/law.template.md`.
  - **Required sections:** `## Rule`, `## Why`.
  - **Optional sections:** Exceptions, Caveat, Narrowings, Enforcement, Related.
- **Written at:** `AGENTS.md` (Laws), `.ai/template/law.template.md`.

### 2026-10-27 — Template shape changes

- **Ruled:** operator, a condition on my Question 4 A; landed `81da205`.
- **Ruling:** a change to a law's shape is recorded in `.ai/template/law.template.md` and confirmed with the reviewing peer.
- **Written at:** `.ai/template/law.template.md`.

### 2026-10-28 — Rulings from the reviewing peer's law set

- **Ruled:** operator, my Question 55 A; date not recorded, in force by 2026-10-28.
- **Ruling:** a generic setting from the reviewing peer's law set counts as covered once knix law text states it, drafts included.
  - **Line maps:** after writing each ruling, send the peer its file and line ranges.
  - **Escalation:** the peer checks them as a second opinion, and goes to the operator only when a check fails.
- **Written at:** not yet.

### 2026-10-28 — Taglines, index rows and unruled prose

- **Ruled:** operator, my Questions 60 A and 66 B; date not recorded, in force by 2026-10-28.
- **Ruling:** the operator rules each law's tagline and index row as the law is walked. Prose of mine that nobody has ruled goes to the operator one question at a time, and each answer is relayed to the peer as given.
- **Written at:** not yet.

### 2026-11-10 — Severity policy

- **Ruled:** operator, my Questions 6 A and 9 A; landed `259c223`.
- **Ruling:** every enforced check is `error`.
  - **Exceptions:** a needed exception takes a disable comment that says why.
  - **Adoption:** a codebase adopting a law records its existing violations in a committed suppressions file.
  - **Heuristics:** a check that cannot meet that bar is done in review, never at `warn`.
  - **Tool limits:** a tool that cannot meet this policy states its fallback.
- **Written at:** `.ai/template/law.template.md`.

### 2026-11-10 — Per-law copies of list-option core rules

- **Ruled:** operator, my Question 7 A; landed `259c223`.
- **Ruling:** a law that needs a core rule taking a list option uses `@knix-law/eslint-plugin`'s per-law copy, `@knix-law/<law>-<rule without no->`.
- **Open:** the operator's concern about deploying and publishing the copies.
- **Written at:** each law's Enforcement section.

### 2026-11-10 — Glossaries, disable comments and spelling

- **Ruled:** operator, my Questions 10 A, 11 A, 12 A and 17 A; landed `259c223`.
- **Ruling:**
  - Glossaries layer the way `ai.config` does.
  - `explain-every-disable` owns every disable-comment check.
  - Glossary terms are enforced through cspell `flagWords` and Vale substitution.
- **Written at:** the draft laws.

### 2026-11-10 — Draft index and approval

- **Ruled:** operator, my Question 28 A; landed `259c223`.
- **Ruling:** draft laws are indexed in `draft/law/README.md`. No law is approved or graduated until every draft is walked and the reviewing peer explicitly says the walk is done.
- **Written at:** `AGENTS.md` (Laws).

### 2026-11-10 — Index rows

- **Ruled:** operator; landed `259c223`.
- **Ruling:** a law's index row states nothing its `## Rule` does not.
- **Written at:** `AGENTS.md` (Laws).

### 2026-11-10 — Forge links

- **Ruled:** operator, my Questions 77 A, 78 and 80 A; landed `259c223`.
- **Ruling:**
  - A forge link pins the full 40-character sha.
  - A GitHub `#L` link carries `?plain=1`.
  - Link text never shows a sha.
  - `npm run check:law-links` enforces all three.
- **Open:** whether GitLab Markdown `#L` links need `?plain=1`.
- **Written at:** `.ai/template/law.template.md`, `package.json`.

### 2026-11-10 — Draft file names

- **Ruled:** operator, my Question 88 A; landed `259c223`.
- **Ruling:** drafts are `draft/law/<slug>.law.draft.md`. Graduation renames each to `knowledge/law/<slug>.law.md`.
- **Written at:** `AGENTS.md`, `draft/law/README.md`.

### 2026-11-11 — Tool versions

- **Ruled:** operator, my Question 8 A plus "typescript is 6.x.x"; landed `722d862`.
- **Ruling:** tool versions live only in `packages/law/*/package.json`, as a caret peer range plus an exact dev pin.
- **Written at:** `AGENTS.md` (Tool versions), `packages/law/*/package.json`.

### 2026-11-13 — Placing a walk ruling

- **Ruled:** operator; date not recorded, in force by 2026-11-13.
- **Ruling:** each ruling the reviewing peer relays, worded by the peer and ruled as worded, gets a placement question to the operator.
  - **Before asking:** recheck for overlap with existing laws first.
  - **A new topic** gets its own draft law, with title, tagline and Why as TODO.
  - **Enforcement** is written once it is ruled and its tools are declared; otherwise a TODO records the ruling.
  - **Flagged as unruled:** my title, Related lines, Enforcement labels and README row.
  - **Final check:** a line map goes to the peer for a byte-exact check.
- **Written at:** not yet.

### 2026-11-14 — ESLint config peer versions

- **Ruled:** operator, my Question 1 A; landed `dcbb098`.
- **Ruling:** `@knix-law/eslint-config` peers:
  - `eslint ^10.13.0`, `typescript ^6.0.3`.
  - `eslint-plugin-perfectionist ^5.13.0`, `typescript-eslint ^8.72.1` (dev pin `8.72.2`), `eslint-plugin-sonarjs ^4.2.2`.
  - `@angular-eslint/eslint-plugin-template` and `@angular-eslint/template-parser` `^22.6.0`, optional in `peerDependenciesMeta`.
  - `stylelint ^17.16.0`.
- **Written at:** `packages/law/eslint-config/package.json`, `packages/law/stylelint-config/package.json`.

### 2026-11-15 — Declaring the cited plugins

- **Ruled:** operator; landed `aafa932`.
- **Ruling:** the eight plugins the draft laws cite are declared in `@knix-law/eslint-config` as caret peer plus exact dev pin, with `eslint-plugin-rxjs-x` optional. `eslint-plugin-import` is out, because 2.32.0 accepts eslint only to `^9`.
- **Written at:** `packages/law/eslint-config/package.json`.

### 2026-11-16 — Test files

- **Ruled:** operator; landed `0ce20e3`.
- **Ruling:** test files are defined once, in `draft/law/README.md` `## Test files`.
  - **Linking:** every law links its first mention of test files to that section.
  - **Graduation:** the section moves to `knowledge/law/README.md`.
- **Written at:** `draft/law/README.md`.

### 2026-11-16 — Completers that may follow takeUntil

- **Ruled:** operator; landed `0ce20e3`.
- **Ruling:** the post-completer list is the 45 operators in `end-every-subscription-you-make`.
  - **In:** `startWith`, `endWith`, `share`, `shareReplay`, `windowCount`, `windowTime`.
  - **Out:** `distinct`, `timeout`, `mapTo`, `pluck`.
- **Written at:** `draft/law/end-every-subscription-you-make.law.draft.md`.

### 2026-11-16 — One naming-convention setting

- **Ruled:** operator (walk Q202-A placed).
- **Ruling:** one `@typescript-eslint/naming-convention` setting, owned by `name-values-descriptively`, holds every naming selector, since a later setting replaces an earlier one's options.
- **Written at:** `draft/law/name-values-descriptively.law.draft.md`.

### 2026-11-16 — Subscription enforcement

- **Ruled:** operator, my Questions 6 A, 7 B, 8 A, 9 A, 11 A, 12 A, 13 A, 14 A and 15 A; landed `9f3d3db`.
- **Ruling:** `end-every-subscription-you-make` Enforcement, all at `error`:
  - **`rxjs-x/no-unsafe-takeuntil`:** alias `takeUntilDestroyed`, `takeWhile`, `take`, `first`, `last`; allow the 45-operator list.
    - It stays on in test files.
  - **`rxjs-x/no-sharereplay-before-takeuntil`:** `takeUntilAlias` set to the same alias list.
  - **`rxjs-x/no-subscribe-in-pipe`.**
  - **`rxjs-x/no-nested-subscribe`:** ruled against my recommendation.
  - **A typed `@knix-law/end-every-subscription-you-make` rule** (name unruled, spec TODO):
    - It reports a `.subscribe()` returned from an arrow unless a completer ends its pipe. This was ruled against my recommendation.
    - It also reports a `Subscription` class field with no `.unsubscribe()` call in its class. Locals stay in review.
- **Written at:** `draft/law/end-every-subscription-you-make.law.draft.md`.

### 2026-11-16 — Test support

- **Ruled:** operator, my Questions 18 A and 19 A; landed `7dfd3c4`.
- **Ruling:** test support is defined once, in `draft/law/README.md` `## Test support`.
  - **What it is:** shared code that test files import is not a test file, and keeps production rules.
  - **Overlap:** a path matching both sections is test support.
  - **Graduation:** the section moves to `knowledge/law/README.md`.
- **Written at:** `draft/law/README.md`.

### 2026-11-16 — Walk rulings awaiting placement

- **Ruled:** operator, through the reviewing peer's walk. The full wording is the peer's.
- **Ruling:** these are ruled as worded by the peer; their placement is mine to propose, one question at a time:
  - **Walk Q153-A:** three `own-your-public-types` test-file lines. They cover checker-allowed access, template-only members reached through the rendered template, and `_` marking public-but-internal. Enforcement open.
  - **Walk Q154-A:** an `own-your-public-types` line; outside code never reads or writes a `_` member (typed rule).
  - **Walk Q155-A:** that rule at `warn`, as the one named exception to the severity policy.
  - **Walk Q158-A:** a `compileComponents` test-file line (review only).
  - **Walk Q159-A:** an `await-every-async-assertion` test-file line; Enforcement is a later question.
  - **Walk Q161-A:** a relative-units line; Enforcement is a later question.
- **Open items recovered 2026-11-16:**
  - **`type-values-precisely` Enforcement.** The candidates are `no-unnecessary-condition`, NG8102 and NG8107, plus a gap for template `&&` and `*ngIf`.
  - **`identify-by-key-not-display-text` regroup.**
    - Enforcement has 9 top-level items against a cap of 8.
    - Its rule IDs are unruled.
    - A CDK harness `hostSelector` must match the component selector, which needs an exception or a review line.
  - **`use-the-design-system`:** 6 Related lines against a cap of 5.
- **Written at:** not yet.

### 2026-11-17 — Reuse-existing-utilities fixture factories

- **Ruled:** operator, through the reviewing peer's walk (walk Q151-A); landed `16c489f`.
- **Ruling:** a `reuse-existing-utilities` test-file line for fixture factories, review only.
- **Written at:** `draft/law/reuse-existing-utilities.law.draft.md`.

### 2026-11-17 — Order of work

- **Ruled:** operator, my Question 34 A.
- **Ruling:** interrogate the `npm-publishing-poc` slice first; place the remaining walk rulings after.
- **Written at:** not yet.

### 2026-11-17 — npm proof-of-concept scope

- **Ruled:** operator, my Question 35 A.
- **Ruling:**
  - **Package:** one, `@knix/utils`.
  - **Bootstrap:** hand-publish `0.0.0-bootstrap.0` under dist-tag `bootstrap`, then run `npm trust github`.
  - **CI publish:** Changesets publishes from CI with provenance.
  - **Tooling:** npm 11 and Node 24 LTS in CI.
  - **Ecosystem note:** record whether a non-`latest` first publish became `latest`.
- **Superseded by:** the version and status rulings below, for the prerelease, dist-tag and deprecation parts.
- **Written at:** not yet.

### 2026-11-17 — npm versioning

- **Ruled:** operator, my Question 36 A.
- **Ruling:** for the proof of concept, `changeset version` runs locally and is committed to `main` with approval, and CI only publishes; after that, move to best practice. The operator authorized updating repository settings to best practice.
- **Written at:** not yet.

### 2026-11-17 — Repository settings

- **Ruled:** applied under the operator's authorization on my Question 36.
- **Ruling:**
  - **Security:** Dependabot alerts and security updates, private vulnerability reporting, Actions SHA pinning required, CodeQL default setup.
  - **Rulesets:** `main` blocks deletion and force push; `release tags` blocks deletion and update. Neither has a bypass.
  - **Environment `npm`:** the operator as required reviewer with self-review allowed, admins cannot bypass, deploys from `main` only. The publish job and `npm trust github --env npm` name it.
  - **Deferred:** Actions-created pull requests and a PR-required ruleset wait for the move to the Version Packages PR route.
- **Written at:** the repository settings.

### 2026-11-17 — First release version

- **Ruled:** operator, my Question 37 A plus their note.
- **Ruling:** `main` keeps `0.0.0`. The bootstrap version exists only in the hand-publish working tree. There is no prerelease and no `poc` tag: CI publishes a normal patch release, `0.0.1`.
- **Supersedes:** the npm proof-of-concept scope's prerelease and dist-tag.
- **Written at:** not yet.

### 2026-11-17 — Status of 0.0.1

- **Ruled:** operator, my Question 38 A.
- **Ruling:** `0.0.1` is the first real release, with one small real utility, and stays on `latest`. `AGENTS.md` allows the bootstrap placeholder and records `@knix/utils` as released.
- **Written at:** not yet.

### 2026-11-17 — Non-release cleanup

- **Ruled:** operator.
- **Ruling:** delete any version, tag or artifact that is not a real release rather than deprecate it. `0.0.0-bootstrap.0` is unpublished, and its `bootstrap` dist-tag removed, only after `0.0.1` is live and inside npm's 72-hour window.
- **Supersedes:** deprecating the bootstrap.
- **Written at:** not yet.

### 2026-11-17 — Enforcing the version ceiling

- **Ruled:** operator, my Question 39 A.
- **Ruling:** a script fails on any major changeset, or on any package version `>= 1.0.0`, while a single committed `ga` flag is off.
  - **No override:** there is no environment override.
  - **Error message:** it says to write a minor changeset.
  - **When it runs:** before `changeset version` locally, and in CI before publishing.
  - **Tests:** cover the flag both off and on.
- **Written at:** not yet.

### 2026-11-17 — The 0.0.1 utility

- **Ruled:** operator, my Questions 40 (answered C) and 41.
- **Ruling:** `@knix/utils` `0.0.1` ships a simple logging utility, modelled on an existing logger the operator uses and written fresh.
  - **First step:** I describe what that logger does, and the operator corrects the description.
  - **Then:** a roadmap slice is captured.
- **Written at:** not yet.

### 2026-11-17 — Logger requirements

- **Ruled:** operator.
- **Ruling:** the description was accepted. The first implementation adds:
  - **Universal availability:** the log functions work without an import when `@knix/utils` is a dependency.
  - **Automatic caller:** they print the calling function or place automatically.
- **Written at:** not yet.

### 2026-11-17 — Logger under ship-no-debug-console-output

- **Ruled:** operator, my Question 42 A.
- **Ruling:** the warn and error loggers are allowed anywhere. The plain and coloured loggers are debug output, banned in shipped browser code.
- **Superseded by:** "Logger is development-only" and "Logger ban mechanism".
- **Written at:** not yet.

### 2026-11-18 — Logger import form

- **Ruled:** operator, my Question 43 A.
- **Ruling:** both forms exist.
  - **Import:** `import { log } from '@knix/utils/log'` exports an object whose methods are caller-computing getters.
  - **Global:** the opt-in `@knix/utils/log/global` entry installs the same object on `globalThis`.
  - **Both forms** keep the caller prefix and the DevTools link.
- **Written at:** not yet.

### 2026-11-18 — Logger global install

- **Ruled:** operator, my Questions 44 A and 45 A.
- **Ruling:** one global, the same object as the import.
  - **How it is defined:** `@knix/utils/log/global` defines it as a writable, configurable, non-enumerable data property holding the frozen object, and only if the name is not already in `globalThis`.
  - **An existing knix logger** is kept, with one warning if its version (under the `Symbol.for('@knix/utils/log')` key) is not caret-compatible.
  - **Anything else under the name** is kept, with one warning pointing to the import.
  - **Types:** a global interface plus `var`, so copies merge without TS2403.
- **Written at:** not yet.

### 2026-11-18 — Logger names

- **Ruled:** operator, my Question 46 A, with their change: "just log instead of logger".
- **Ruling:** the import and the global are `log`, with `log.log`, `log.warn`, `log.error` and the colour badges. The global interface is `KnixLogger`.
- **Supersedes:** the earlier names `lg`, `lg.err` and `KnixLg`.
- **Written at:** not yet.

### 2026-11-18 — Logger is development-only

- **Ruled:** operator.
- **Ruling:** all of `log.*` is banned in production code and used only in development code, for debugging.
- **Supersedes:** "Logger under ship-no-debug-console-output", where the warn and error loggers were allowed anywhere.
- **Written at:** not yet.

### 2026-11-18 — Logger ban mechanism

- **Ruled:** operator, my Question 47 A.
- **Ruling:** `ship-no-debug-console-output` Enforcement adds two rules, both at `error` and turned off in each project's `no-console` override. The wording goes through the reviewing peer.
  - `@knix-law/ship-no-debug-console-output-restricted-imports`, for `@knix/utils/log` and `@knix/utils/log/global`.
  - `@knix-law/ship-no-debug-console-output-restricted-globals`, for `log`.
- **Written at:** not yet.

### 2026-11-18 — Loading the logger global in development only

- **Ruled:** operator, my Question 48 A.
- **Ruling:** no automatic install and no export-condition split. The package ships one `@knix/utils/log/global` entry, plus a README setup line per tool:
  - Angular `configurations.development.polyfills`.
  - Vite `if (import.meta.env.DEV) await import('@knix/utils/log/global')`.
  - Vitest and Jest `setupFiles`.
  - Storybook `.storybook/preview.ts`.
  - `node --import` for development scripts.
  - `"types": ["@knix/utils/log/global"]` in `tsconfig`.
- **Before the README cites them:** the Jest line for an ESM-only setup file, and the Storybook line, each need a run.
- **Written at:** not yet.

### 2026-11-18 — Closing the logger ban's gaps

- **Ruled:** operator, my Question 49 A.
- **Ruling:** `ship-no-debug-console-output` Enforcement, all at `error` and off in each project's `no-console` override. The wording goes through the reviewing peer.
  - **Restricted imports:** one `patterns` regex, `^@knix/utils/log(/|$)`, in place of two exact paths.
  - **Restricted globals:** `log`, with `checkGlobalObject: true` and `globalObjects: ['window', 'self', 'global']`.
  - **A restricted-syntax copy** with five selectors: `import()` with a literal or a template specifier, any call whose first argument is that literal or template, and `TSImportType`.
  - **A restricted-properties copy** for `log` on `globalThis`, `window` and `self`.
  - **The Vite setup line** takes a disable comment that says why.
  - **Build scan:** each project's CI fails if its production `.js` output contains the string `@knix/utils/log`.
  - **Review only:** computed specifiers, a `globalThis` alias, `Reflect.get`, and triple-slash types references.
- **Written at:** not yet.

### 2026-11-18 — How the logger names its caller

- **Ruled:** operator, my Question 50 A.
- **Ruling:** an automatic prefix plus a per-scope label.
  - **Automatic prefix:**
    - **Reading the stack:** V8 structured call sites, with a string parser for Safari and Firefox.
    - **Walking up:** across native frames only, stopping at the first non-native frame.
    - **Never** print a file and line read from the stack.
    - **`Error.prepareStackTrace`:** set, captured and restored synchronously.
    - **A short or empty stack** is tolerated.
  - **Scope label:** bound once per class or file. It prints `Class.member` when the stack gives a member, and the label alone when it does not.
  - **No per-call variants:** there is no per-call `(component, location)` form.
- **Next priority:** automated labelling, by lint autofix or build transform, is the next thing to prioritize after this work. The operator's words: "that is the next thing we should prioritize after".
- **Written at:** not yet.

### 2026-11-18 — This decision log

- **Ruled:** operator, my Question 52 A.
- **Ruling:** every project ruling lives in this committed, append-only log, and later documents cite its entries. Session-only rules stay in the working session's own notes.
- **Written at:** this file.

### 2026-11-18 — How code binds the logger's scope label

- **Ruled:** operator, my Question 51 A.
- **Ruling:** `log.scope(owner)` binds the scope label from How the logger names its caller. It takes a string, a class or an instance; given a class or an instance, the logger reads the class name itself.
- **Written at:** not yet.

### 2026-11-18 — Logger badge colour in Node

- **Ruled:** operator, my Question 53 A.
- **Ruling:** in Node, the colour badges use ANSI codes when the stream they write to (stdout for `log.log`, stderr for `log.warn` and `log.error`) is a terminal, unless `NO_COLOR` is set; browsers keep `%c`. One file, with no `node:util` import. The operator's words: "if we can dectect which and do the correct thing, then yes".
- **Superseded by:** When Node badges get colour (detection clause only).
- **Written at:** not yet.

### 2026-11-18 — When Node badges get colour

- **Ruled:** operator, my Question 54 A.
- **Supersedes:** the detection clause of Logger badge colour in Node ("is a terminal, unless `NO_COLOR` is set").
- **Ruling:** Node badges follow Node's own colour rule. `FORCE_COLOR` decides first: `0` or `false` turns colour off, any other value turns it on. Otherwise a terminal stream decides through `stream.hasColors()`, which honours `NO_COLOR` and `TERM=dumb`; a non-terminal stream prints plain. Vitest workers write to a pipe, so the README states that Vitest needs `FORCE_COLOR=1` for colour.
- **Superseded by:** How the logger reads FORCE_COLOR (the `FORCE_COLOR` clause only).
- **Written at:** not yet.

### 2026-11-18 — Logger badge palette

- **Ruled:** operator, my Question 55 A.
- **Ruling:** `log` carries seven badges: `log.red`, `log.yellow`, `log.green`, `log.cyan`, `log.blue`, `log.magenta` and `log.gray`, one per basic ANSI colour that works as a badge.
  - **Node:** the 16-colour ANSI background and text codes, so no colour-depth conversion.
  - **Browsers:** one fixed CSS background and text pair per badge, chosen for WCAG AA text contrast so it reads the same in light and dark DevTools.
  - **Palette values** are written fresh.
- **Written at:** not yet.

### 2026-11-18 — Where the ga flag lives

- **Ruled:** operator, my Question 56 A.
- **Ruling:** the version-ceiling ga flag from Enforcing the version ceiling lives in the root `package.json` as `"knix": { "ga": false }`. The version-ceiling script reads it with `JSON.parse`; its tests pass the flag in directly to cover both off and on.
- **Written at:** not yet.

### 2026-11-18 — Who captures the logger slices

- **Ruled:** operator, my Question 57 A.
- **Ruling:** the knix working session captures both logger slices, the `@knix/utils/log` logger and the automated scope labelling follow-up, under Logger utility flow, with `/roadmap`. Each cites its decision-log entries and is committed as `docs(roadmap)` on the operator's approval.
- **Written at:** not yet.

### 2026-11-18 — knix has no managing session

- **Ruled:** operator, my Question 58 A.
- **Supersedes:** my Question 90 A's pre-push report to the managing session (the former Standing direction bullet "Before each push").
- **Ruling:** knix has no managing session. The operator's approval in the working session is the only gate, the PRD gate included. Research runs through the working session's own subagent, with findings tagged VERIFIED, INFERRED or UNVERIFIED. Before each push, the confirmation shows the operator the `origin/main..HEAD` range plus the results of `ecorn validate -p .` and `npm run check:law-links`.
- **Written at:** this file, Standing direction.

### 2026-11-18 — Logger return value and empty-value display

- **Ruled:** operator, my Question 59 A.
- **Ruling:** `log.log`, `log.warn`, `log.error` and the badges stay bound console methods, so their DevTools link points at the caller. One wrapper method, `log.tap(value, ...rest)`, logs with the prefix, shows `''` and the strings `'null'` and `'undefined'` readably, and returns `value` so it can sit inside an expression.
  - **`tap`'s link:** points at the caller where the bundler ignore-lists dependencies and the browser honours it (Chrome under Vite, Rollup, the Angular esbuild builder, Next). It points at knix in Firefox, in Safari under Vite, in webpack without an ignore-list plugin, and wherever ignore-listing is off. Its docs say so.
- **Written at:** not yet.

### 2026-11-18 — Leading underscore in logger class names

- **Ruled:** operator, my Question 60 A.
- **Ruling:** the logger strips one leading `_` from a class name it reads itself, from a class, an instance or the stack, because an Angular development build names classes `_CartService`. A string passed to `log.scope('…')` prints exactly as written.
- **Written at:** not yet.
- **Superseded by:** Caller prefix is the same in every engine (the stack as a source only).

### 2026-11-20 — Logger test runner

- **Ruled:** operator, my Question 61 A.
- **Ruling:** Vitest 5.1.1 with two projects. A Node project covers the colour rule and Node naming. A browser project runs `@vitest/browser-playwright` 5.1.1 in Chromium, Firefox and WebKit, so each stack parser meets its own engine's real stacks. CI installs and caches the three Playwright browsers. Colour tests pass a stream in rather than reading `process.stdout`, because Vitest workers write to a pipe.
- **Written at:** not yet.
- **Superseded by:** Where knix's tests run (the CI cache clause only).

### 2026-11-20 — How the logger reads FORCE_COLOR

- **Ruled:** operator, my Question 62 A.
- **Supersedes:** the `FORCE_COLOR` clause of When Node badges get colour ("`0` or `false` turns colour off, any other value turns it on").
- **Ruling:** the logger reads `FORCE_COLOR` exactly as Node 26.8.1 does. An empty value, `1`, `true`, `2` or `3` turns colour on; `0`, `false` or any other value turns it off. The rest of When Node badges get colour stands.
- **Written at:** not yet.

### 2026-11-20 — @knix/utils drops private with the logger

- **Ruled:** operator, on my Question 64's version default: "\"private\" or not doesn't matter to me, you can make it pulic and puslish it under 0.x.x".
- **Ruling:** the logger slice removes `private: true` from `@knix/utils`, because the package then holds a real utility rather than an empty placeholder. `main` keeps `0.0.0`, and the first publish stays the `0.0.1` that First release version rules, inside the 0.x.x range the version ceiling enforces.
- **Written at:** not yet.

### 2026-11-21 — Where knix's tests run

- **Ruled:** operator, my Question 67 A: "Q67-A".
- **Supersedes:** the CI cache clause of Logger test runner ("CI installs and caches the three Playwright browsers").
- **Ruling:** each check runs once, where it costs least, because the friction directive requires it.
  - **CI:** runs `npx playwright install --with-deps` for the three browsers on every run, with no browser cache. Playwright's CI docs say caching browser binaries is not recommended.
  - **Docs commits:** the pre-commit test gate gets a docs scope (`*.md`, `.ai/**/*.md`, `knowledge/**`, `draft/**`). A commit staging only those paths runs `check:law-links` and skips typecheck.
  - **Root scripts:** `test` runs the build and the node project; `test:browser` runs the three browser instances, in CI after `test` and at each code task's checkpoint.
  - **Checkpoints:** a plan checkpoint drops the `npm test` and `npm run typecheck` the pre-commit gates run on the same tree.
- **Written at:** not yet.

### 2026-11-21 — Caller prefix is the same in every engine

- **Ruled:** operator, my Question 70 A: "Q70-A". Asked first: "The best? It should be the same across all of them, is there a reason we can't?"
- **Supersedes:** the stack as a source in Leading underscore in logger class names.
- **Ruling:** the automatic prefix is the method or function name read from the stack, the same string in Node, Chromium, Firefox and WebKit.
  - **No class from the stack:** Firefox and WebKit stacks carry only the bare name (`add@…`), so reading V8's class would make the output differ by engine.
  - **The class** comes only from `log.scope(owner)`, which prints `Class.method` in every engine.
  - **Automatic class labels** stay with the automated scope labelling follow-up.
- **Written at:** `knowledge/roadmap/utils-log-entry-point.prd.md`.

### 2026-11-21 — How the caller prefix is printed

- **Ruled:** operator, my Question 71 A: "Q71-A".
- **Ruling:** the levels and `tap` print the prefix in square brackets as the leading argument: `log.log('x')` prints `[CartService.add] x`.
  - **Badges** colour the same text with one space each side and no brackets: ` CartService.add `.
  - **No name:** the levels and `tap` print no prefix, and a badge prints a short blank coloured block.
- **Written at:** `knowledge/roadmap/utils-log-entry-point.prd.md`.

### 2026-11-21 — Badges when Node prints without colour

- **Ruled:** operator, my Question 72 A: "Q72-A".
- **Ruling:** when Node's colour rule turns colour off, a badge prints what the levels print: `log.red('x')` gives `[CartService.add] x`, and no prefix when there is no name. Browsers always colour badges.
- **Written at:** `knowledge/roadmap/utils-log-entry-point.prd.md`.
