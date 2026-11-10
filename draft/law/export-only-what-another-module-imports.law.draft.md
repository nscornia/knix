# Export only what another module imports

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. -->

## Rule

- Export a symbol only when another module imports it.
  - An entry point's exports count as imported: consumers outside the repository import them.
    - The entry points are the files `package.json` names in `exports`, `main` or `types`.
    - They also include the files a bundler's config names as entries or exposed modules.
  - A re-export counts as an import of what it re-exports.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Caveat

- A file with no exports is outside the rule, even when nothing imports it.

## Enforcement

- **ESLint:** `@knix-law/export-only-what-another-module-imports` at `error`: `{ entries: ['<bundler entry or exposed module>'] }`.
  - It is a typed rule. It reads the `package.json` entry points itself; `entries` lists the files a bundler's config names.
  - The lint tsconfig covers every file that may import an export, tests included.
    - An import from a file outside the program doesn't count, so its target is reported (probed).
  - CI runs ESLint without `--cache`.
    - ESLint "does not track dependencies between files", so a cached result can go stale ([ESLint, command line interface][eslint-cache]).
  - A stale disable is reported under `reportUnusedDisableDirectives`, even when another file's import made it stale (probed).
- **Known gaps (probed):**
  - An editor's result for a file changes only when that file is re-linted.
  - A non-literal `import()` resolves to no module, so the exports it loads are reported.

## Related

- [Explain every disable](explain-every-disable.law.draft.md) governs the disable a needed exception takes.

[eslint-cache]: https://github.com/eslint/eslint/blob/4637f9827a1ba137498eaee70957850621082815/docs/src/use/command-line-interface.md?plain=1#L715
