# Default with nullish coalescing

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- Default a missing value with `??`, never `||`, which also replaces `''`, `0` and `false`. Where those values should take the default too, keep `||` under a disable comment that says so.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Enforcement

- `@typescript-eslint/prefer-nullish-coalescing` at `error`, with default options.
  - It is type-aware, so it needs type information (probed).
  - It needs `strictNullChecks`, which [Assert only what the checker cannot know](assert-only-what-the-checker-cannot-know.law.draft.md) already requires through `strict: true`.
    - Without it, the rule reports that it can't run correctly (probed).
  - It only suggests a fix. `--fix` never rewrites `||` (probed).
  - Its defaults also report a ternary or `if` that defaults by hand, and skip `||` inside a condition (probed).

## Related

- [Build versus buy, in order](build-vs-buy-order.law.draft.md) shows how swapping `|| fallback` for a library default changes behaviour.
- [Explain every disable](explain-every-disable.law.draft.md) governs the disable comment that keeps a deliberate `||`.
