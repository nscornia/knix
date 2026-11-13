# Import within a package by relative path

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- Import a file from the same package by a relative path (`./`, `../`), so the import shows where the dependency sits. Never import it by a path from the project root, such as `src/…`, or by an alias that maps into the same package, such as `@app/…`; both read like package names and resolve only through compiler configuration. Import another package by its package name.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Enforcement

<!-- TODO: pending a ruling. -->

## Related

- [Place with the owner](place-with-owner.law.draft.md) governs where a file lives, which decides the relative path that imports it.
- [Import by name](import-by-name.law.draft.md) governs what an import names; this law governs the path it names it from.
