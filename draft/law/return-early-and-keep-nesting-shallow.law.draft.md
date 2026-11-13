# Return early and keep nesting shallow

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- Return or throw as soon as a case is settled, so the main path runs at the outermost indent; an `else` after a branch that returns or throws is dropped and its body follows the `if`. Nest blocks at most four deep inside a function, and extract deeper logic into a named function.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Enforcement

<!-- TODO: pending a ruling. -->

## Related

- [Nest with meaning](nest-with-meaning.law.draft.md) governs nesting in data shapes; this law governs nesting in code.
