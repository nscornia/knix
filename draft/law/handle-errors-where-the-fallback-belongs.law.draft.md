# Handle errors where the fallback belongs

Where `catchError` sits decides how much of a result one failure costs.

<!-- TODO: the title is a working title, pending a ruling. -->

## Rule

- Put `catchError` where its fallback belongs. On each source of a combination such as `forkJoin`, it keeps the other sources' results when one fails; once on the combination, one failure replaces the whole result and cancels the rest. Where sources share a fallback, write the handler once, as a named function or operator, and pass it to each.

## Why

`catchError` swaps the stream it catches for its fallback, so where it sits decides how much a failure takes with it. When one source of a `forkJoin` fails, the `forkJoin` fails too and unsubscribes from the rest: a handler on the `forkJoin` replaces every result, including those that loaded, while a handler on each source replaces only the one that failed. The right place is the one whose fallback matches what a failure should lose. Sources that share a fallback pass one named handler, because copies written separately drift apart when one is changed.

- **One failure ends the combination:**
  - "If any given observable errors at some point, `forkJoin` will error as well and immediately unsubscribe from the other observables." ([RxJS `forkJoin`][rxjs-forkjoin-error])
  - "in order for `forkJoin` to emit a value, all given observables have to emit something at least once and complete." ([RxJS `forkJoin`][rxjs-forkjoin-emit])
- **`catchError` replaces what it catches:** "If the source observable terminates with an error, it will map that error to a new observable, subscribe to it, and forward all of its events to the resulting observable." ([RxJS `catchError`][rxjs-catcherror])

## Enforcement

- Review only: no lint rule can tell a fallback placed per source on purpose from a duplicated one.
  - Where each `catchError` sits relative to a combination.
  - That sources sharing a fallback pass one named handler.

## Related

- [Reuse existing utilities](reuse-existing-utilities.law.draft.md) governs reusing code rather than writing a parallel copy, as a shared handler does.

[rxjs-forkjoin-emit]: https://github.com/ReactiveX/rxjs/blob/e5351d02e225e275ac0e497c7b66eaa5f0c88791/src/internal/observable/forkJoin.ts#L83-L84
[rxjs-forkjoin-error]: https://github.com/ReactiveX/rxjs/blob/e5351d02e225e275ac0e497c7b66eaa5f0c88791/src/internal/observable/forkJoin.ts#L86-L87
[rxjs-catcherror]: https://github.com/ReactiveX/rxjs/blob/e5351d02e225e275ac0e497c7b66eaa5f0c88791/src/internal/operators/catchError.ts#L25-L26
