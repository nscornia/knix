# Test for a missing value with `== null`

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- Test whether a value is missing with `x == null` or `x != null`, which match both `null` and `undefined`; it is the only loose equality. Never spell it `x === null || x === undefined`. Compare with just one of them only when the code means that one, as when `null` and absent mean different things.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Enforcement

- Core `eqeqeq` at `error`, with `['always', { null: 'ignore' }]`.
  - `null: 'ignore'` lets `== null` and `!= null` through (probed).
- `@knix-law/test-for-missing-with-loose-null` at `error`, knix's own rule.
  - It reports the paired form on the same operand, `x === null || x === undefined` or `x !== null && x !== undefined`.
  - A call as the operand is not reported.
  - <!-- TODO: the rule is not built yet. Its spec also decides `typeof x === 'undefined'`, `x === void 0` and reversed operands such as `null === x`. -->
- Comparing with just one of them: review only.

## Related

- [Default with nullish coalescing](default-with-nullish-coalescing.law.draft.md) defaults a missing value with `??`, which matches the same two values.
- [Type values precisely](type-values-precisely.law.draft.md) says where a test for `null` or `undefined` belongs.
