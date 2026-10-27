# Import by name

A unit names each dependency it uses instead of pulling in an aggregate.

## Rule

Import only what the unit uses, by name. Never import a whole aggregate when its members are importable on their own.

## Why

Explicitness: a reader sees exactly what the unit depends on. Code review enforces the general rule.

## Exceptions

- Type-only imports.
- A deliberate package-boundary barrel.
- Aggregates a tool requires.

## Narrowings

- **Angular:** never import `CommonModule`. Use `@if` and `@for`, and import pipes and directives by name.
  - A lint rule flags `CommonModule` imports.
  - Bundle size is not a reason for this narrowing. An AOT compile emits only the pipes a template uses.
