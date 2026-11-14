# Build arrays with map and filter

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- Build an array from another with `map` and `filter`, never by pushing into an empty array from a loop or `forEach`. A loop that does more than build one array, such as splitting items into two arrays, stopping early or running side effects in order, stays a loop.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Enforcement

<!-- TODO: ruled at `error`, by a knix rule for the push-only shape: a `const` empty-array declaration directly followed by a `forEach` or `for…of` whose body is one push, or one `if` guarding one push. The rule is written from this law's Rule and probed against the declared versions. -->

## Related

- [Derive declaratively](derive-declaratively.law.draft.md) governs reactive derivation; this law governs how plain code builds a derived array.
