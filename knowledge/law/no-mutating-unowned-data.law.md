# No mutating unowned data

Data belongs to the module that created it; everyone else reads it or copies it.

## Rule

- **Consumers:** copy first. Never write into, merge into, sort or push onto an imported object.
- **Owners:** export a factory when each consumer needs its own instance, and deep-freeze fixed data.
  - No `export let`.
  - Callbacks that capture an instance never live in module scope.

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
