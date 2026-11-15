# Only the owner writes

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. -->

## Rule

- **Owners:** data belongs to the module that created it, and the owner of mutable state is its only writer.
  - **Mutable state** (a subject, signal, store or emitter): keep the writable source private.
    - Expose a read-only view plus named update operations. No consumer gets a handle that can write.
    - Inside the owner, prefer its own update operations to touching the source directly.
  - **Module data:** export a factory when each consumer needs its own instance, and deep-freeze fixed data.
    - No `export let`.
    - Callbacks that capture an instance never live in module scope.
- **Consumers:** copy first. Never write into, merge into, sort or push onto an imported object.
  - Copy a value only to change it, or to stop a reference someone else holds from being shared. A value nothing else references, such as an object a factory has just created, is used directly, not spread into a copy.

## Why

An imported object is one shared instance, so one consumer's edit is seen by every other module that imports it. The resulting bug shows up far from its cause and can depend on which code ran first, so only the owner changes its data. Consumers change a copy. One writer keeps data flow unidirectional and traceable, and a consumer cannot emit into or complete the source by accident.

- **Imports** ([MDN `import`][mdn-import]):
  - "any module holding an exported object can mutate the object, and the mutated value can be observed by all other modules importing the same value."
- **Parameters:** "Manipulating objects passed in as parameters can cause unwanted variable side effects in the original caller." ([Airbnb JavaScript Style Guide, 7.12][airbnb-mutate-params])

## Exceptions

- **Module data:**
  - A module initialising its own export.
  - Namespace objects of functions.
  - Dependency-injection tokens.
  - Identity singletons.
- **Mutable state:**
  - Framework output emitters built for component events.
  - A source deliberately exposed as an event bus, with a documented reason.

## Caveat

A read-only view does not stop mutation of an object value it holds. Return immutable data or copies where that matters.

## Narrowings

- **Angular:**
  - Keep a `WritableSignal` private, publish `asReadonly()` ([`WritableSignal`][writable-signal]) and mutate through methods.
  - Replace objects held in signals and inputs instead of editing them.
  - Use `useFactory` for per-injector state.
- **RxJS:** keep every `Subject`, `BehaviorSubject` and `ReplaySubject` private, and mutate through methods.
  - Expose the view as a field built once: `readonly x$ = this._x.asObservable()`.
  - Never expose it through a getter that returns `asObservable()` or a `pipe` chain.
    - Each call returns a new object, and Angular's `AsyncPipe` disposes and resubscribes whenever the bound object changes identity ([`async_pipe.ts`][async-pipe]).
    - The getter resubscribes on every change-detection pass, and a plain `Subject` loses its latest value each time.
- **TypeScript:** `readonly` and `as const` catch direct writes only. They miss library mutators such as `Object.assign` or a deep-merge helper.

## Enforcement

- **Consumers:** a lint rule, needing no type information, flags writes whose target's root identifier is an import binding:
  - member writes;
  - in-place array methods;
  - known mutator functions.
- **RxJS:** `rxjs-x/no-exposed-subjects` with `allowProtected: false` ([rule docs][no-exposed-subjects]).
  - It misses module-scope and object-literal exposure, which stays review-only.
- **Angular signals:** review only.
- **Unneeded copies:** review only.

## Related

- [Read each observable once per template](read-each-observable-once-per-template.law.draft.md) reads that field through `async` once per template.

[mdn-import]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
[airbnb-mutate-params]: https://github.com/airbnb/javascript#functions--mutate-params
[async-pipe]: https://github.com/angular/angular/blob/37563fc32267fd0fcbdff8caf98862962e5d46b5/packages/common/src/pipes/async_pipe.ts
[writable-signal]: https://angular.dev/api/core/WritableSignal
[no-exposed-subjects]: https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/5324875702b93b1fcdec2e7227288cebe11ebfda/docs/rules/no-exposed-subjects.md
