# Derive declaratively

A derived value is computed from its source once per change, not once per read, and never kept as a hand-synced copy.

## Rule

- Derive values declaratively from their source.
- Memoise the derivation.
- Never keep a copy that code syncs by hand.

## Why

A hand-kept copy of derivable state drifts as soon as one update path forgets to sync it; deriving from the source leaves nothing to forget. Deriving once per change rather than once per read means the work runs only when the source changes, however often the value is read.

- **Redundant state** ([React, Avoid redundant state][react-redundant-state]):
  - Information calculable from props or state stays out of state: "you should not put that information into that component's state."
  - Derived instead, "it won't get out of sync."
- **Memoised derivation** ([Angular signals][angular-signals]):
  - Computed signals are "both lazily evaluated and memoized."
  - A repeat read returns "the cached value without recalculating."

## Narrowings

- **Angular:** use `computed()` or `linkedSignal()`.
  - A single non-signal `@Input` may use a transform or a setter.
  - Never use `effect()` to copy state.
    - An effect copying one signal into another is "a sign you should move your source-of-truth higher up" ([Angular effects][angular-effects]).
    - Propagating state through effects "can result in `ExpressionChangedAfterItHasBeenChecked` errors, infinite circular updates, or unnecessary change detection cycles." ([Angular effects][angular-effects])
- **Angular templates:** keep expressions straightforward.
  - Move filtering, mapping, sorting, finding, formatting, translating and object-building into `computed()` or a pure pipe.
  - **Hard rule:** never bind an object, array or function built per read to an input.
  - `OnPush` change detection does not excuse a per-read derivation. It is now the default ([`ChangeDetectionStrategy`][angular-cds]).

## Enforcement

- A cross-file template lint rule at `error`, covering the hard rule only.
- Rejected: `@angular-eslint/template/no-call-expression`, because it flags signal reads.

## Related

- [Measure before optimizing](measure-before-optimizing.law.draft.md) governs hand-written optimization layers; the memoisation this law requires is not one.
- [Fetch data from its owning system](fetch-data-from-its-owning-system.law.draft.md) forbids pasting a copy of another system's data into code.
- [Build arrays with map and filter](build-arrays-with-map-and-filter.law.draft.md) governs how plain code builds a derived array.

[angular-cds]: https://angular.dev/api/core/ChangeDetectionStrategy
[react-redundant-state]: https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state
[angular-signals]: https://angular.dev/guide/signals
[angular-effects]: https://angular.dev/guide/signals/effect
