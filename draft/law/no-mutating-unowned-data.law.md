# No mutating unowned data

Data belongs to the module that created it; everyone else reads it or copies it.

## Rule

- **Consumers:** copy first. Never write into, merge into, sort or push onto an imported object.
- **Owners:** export a factory when each consumer needs its own instance, and deep-freeze fixed data.
  - No `export let`.
  - Callbacks that capture an instance never live in module scope.

## Why

An imported object is one shared instance, so one consumer's edit is seen by every other module that imports it. The resulting bug shows up far from its cause and can depend on which code ran first, so only the owner changes its data. Consumers change a copy.

- **Imports:** "any module holding an exported object can mutate the object, and the mutated value can be observed by all other modules importing the same value." ([MDN `import`][mdn-import])
- **Parameters:** "Manipulating objects passed in as parameters can cause unwanted variable side effects in the original caller." ([Airbnb JavaScript Style Guide, 7.12][airbnb-mutate-params])

## Exceptions

- A module initialising its own export.
- Namespace objects of functions.
- Dependency-injection tokens.
- Identity singletons.

## Narrowings

- **Angular:** replace objects held in signals and inputs instead of editing them. Use `useFactory` for per-injector state.
- **TypeScript:** `readonly` and `as const` catch direct writes only. They miss library mutators such as `Object.assign` or a deep-merge helper.

## Enforcement

- A lint rule, needing no type information, flags writes whose target's root identifier is an import binding:
  - member writes;
  - in-place array methods;
  - known mutator functions.

[mdn-import]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
[airbnb-mutate-params]: https://github.com/airbnb/javascript#functions--mutate-params
