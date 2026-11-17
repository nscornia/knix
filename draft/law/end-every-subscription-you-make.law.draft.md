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
- `rxjs-x/no-unsafe-takeuntil` at `error`.
  - It needs type information (probed).
  - Both of rxjs-x's presets include it (probed).
  - `alias`: `takeUntilDestroyed`, `takeWhile`, `take`, `first`, `last`; with `takeUntil`, which the rule always checks, these are the completers `no-ignored-subscription` uses.
  - `allow`: the `postCompleters` list above.
- `rxjs-x/no-sharereplay-before-takeuntil` at `error`.
  - It needs no type information (probed).
  - Only rxjs-x's strict preset includes it (probed).
  - `takeUntilAlias`: the `alias` list above.
- `rxjs-x/no-subscribe-in-pipe` at `error`.
  - It needs type information (probed).
  - Both of rxjs-x's presets include it (probed).
- `rxjs-x/no-nested-subscribe` at `error`.
  - It needs type information (probed).
  - Both of rxjs-x's presets include it (probed).
- `@knix-law/end-every-subscription-you-make` at `error`, knix's own typed rule.
  - It reports a `.subscribe()` returned from an arrow, unless a completer ends its pipe.
  - It reports a `Subscription` class field that has no `.unsubscribe()` call anywhere in its class.
  - <!-- TODO: the rule is not built yet. Covering a function or method that returns `.subscribe()` needs a ruling. Its spec also decides a `return` in a block-bodied arrow, whether the completers and their order follow `no-ignored-subscription`'s options, and its overlap with `no-subscribe-in-pipe` inside a pipe. For the field check, it also decides a field typed `Subscription | undefined`, an array of subscriptions, a field released through another subscription's `.add()`, and an `.unsubscribe()` in a base class. -->
- A subscription kept in a local variable: review only.
- A split chain or an app-lifetime subscription takes a disable comment that says why.

## Related

- [Read each observable once per template](read-each-observable-once-per-template.law.draft.md) reads an observable through `async`, which ends its own subscription.
- [Explain every disable](explain-every-disable.law.draft.md) governs the disable a split chain or an app-lifetime subscription takes.
