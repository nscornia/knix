# Measure before optimizing

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- Add a hand-written cache, memo table or other optimization layer only for a performance problem you have measured, and state the measurement in the change. Until then, write the plain version. A framework's built-in memoisation of a derived value, such as `computed()`, is not an optimization layer. The change also names the complexity the optimization adds, such as invalidation, staleness or memory, and shows the measured gain outweighs it.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Enforcement

- Review only.

## Related

- [Derive declaratively](derive-declaratively.law.draft.md) requires memoising a derived value, which this law does not count as an optimization layer.
