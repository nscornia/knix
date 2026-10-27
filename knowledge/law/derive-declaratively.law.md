# Derive declaratively

A derived value is computed from its source once per change, not once per read, and never kept as a hand-synced copy.

## Rule

- Derive values declaratively from their source.
- Memoise the derivation.
- Never keep a copy that code syncs by hand.

## Narrowings

- **Angular:** use `computed()` or `linkedSignal()`.
  - A single non-signal `@Input` may use a transform or a setter.
  - Never use `effect()` to copy state.
- **Angular templates:** keep expressions straightforward.
  - Move filtering, mapping, sorting, finding, formatting, translating and object-building into `computed()` or a pure pipe.
  - **Hard rule:** never bind an object, array or function built per read to an input.
  - `OnPush` change detection does not excuse a per-read derivation. It is now the default ([`ChangeDetectionStrategy`][angular-cds]).

## Enforcement

- A cross-file template lint rule at `warn`, covering the hard rule only.
- Rejected: `@angular-eslint/template/no-call-expression`, because it flags signal reads.

[angular-cds]: https://angular.dev/api/core/ChangeDetectionStrategy
