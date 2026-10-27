# Expose read-only state

The owner of mutable state is its only writer; everyone else gets a read-only view.

## Rule

- An owner of mutable state (a subject, signal, store or emitter) keeps the writable source private.
- It exposes a read-only view plus named update operations. No consumer gets a handle that can write.
- Inside the owner, prefer its own update operations to touching the source directly.

## Why

One writer keeps data flow unidirectional and traceable, and a consumer cannot emit into or complete the source by accident.

## Exceptions

- Framework output emitters built for component events.
- A source deliberately exposed as an event bus, with a documented reason.

## Caveat

A read-only view does not stop mutation of an object value it holds. Return immutable data or copies where that matters; see [No mutating unowned data](no-mutating-unowned-data.law.md).

## Narrowings

- **RxJS:** keep every `Subject`, `BehaviorSubject` and `ReplaySubject` private, and mutate through methods.
  - Expose the view as a field built once: `readonly x$ = this._x.asObservable()`.
  - Never expose it through a getter that returns `asObservable()` or a `pipe` chain. Each call returns a new object, and Angular's `AsyncPipe` disposes and resubscribes whenever the bound object changes identity ([`async_pipe.ts`][async-pipe]). The getter resubscribes on every change-detection pass, and a plain `Subject` loses its latest value each time.
- **Angular signals:** keep a `WritableSignal` private, publish `asReadonly()` ([`WritableSignal`][writable-signal]) and mutate through methods.

## Enforcement

- **RxJS:** `rxjs-x/no-exposed-subjects` with `allowProtected: false` ([rule docs][no-exposed-subjects]).
  - It misses module-scope and object-literal exposure, which stays review-only.
- **Angular signals:** review only.

[async-pipe]: https://github.com/angular/angular/blob/main/packages/common/src/pipes/async_pipe.ts
[writable-signal]: https://angular.dev/api/core/WritableSignal
[no-exposed-subjects]: https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/docs/rules/no-exposed-subjects.md
