# End every subscription you make

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- End every subscription you make by hand. A read or a long-lived stream ends with its owner (in Angular, `takeUntilDestroyed`); a one-shot that must finish, such as a save, ends with `take(1)`. The completer goes after every operator that subscribes to another stream, and a subscription kept in a variable is unsubscribed when its owner is destroyed.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Enforcement

- `rxjs-x/no-ignored-subscription` at `error`.
  - It needs type information (probed).
  - Neither of rxjs-x's presets includes it, so it is enabled explicitly (probed).
  - `completers`: the rule's defaults, `takeUntil`, `takeWhile`, `take`, `first`, `last` and `takeUntilDestroyed` (probed).
  - `postCompleters`: operators that start no subscription of their own, by rxjs 7.8.2's source:
    - Transform: `map`, `scan`, `pairwise`, `materialize`, `dematerialize`, `timeInterval`, `timestamp`.
    - Filter: `filter`, `distinctUntilChanged`, `distinctUntilKeyChanged`, `skip`, `skipWhile`, `skipLast`, `ignoreElements`, `debounceTime`.
    - Take and find: `take`, `takeWhile`, `takeLast`, `first`, `last`, `single`, `elementAt`, `find`, `findIndex`.
    - Reduce and batch: `reduce`, `count`, `max`, `min`, `every`, `isEmpty`, `toArray`, `bufferCount`, `bufferTime`, `windowCount`, `windowTime`.
    - Edges, side effects and sharing: `startWith`, `endWith`, `defaultIfEmpty`, `throwIfEmpty`, `tap`, `finalize`, `observeOn`, `subscribeOn`, `share`, `shareReplay`.
  - Off in [test files](README.md#test-files).
- A split chain or an app-lifetime subscription takes a disable comment that says why.

## Related

- [Read each observable once per template](read-each-observable-once-per-template.law.draft.md) reads an observable through `async`, which ends its own subscription.
- [Explain every disable](explain-every-disable.law.draft.md) governs the disable a split chain or an app-lifetime subscription takes.
