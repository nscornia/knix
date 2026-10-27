# Own your public types

A public API exposes types the library owns, never a dependency's types by accident.

## Rule

- Expose a narrow interface you own, sized to what consumers use.
- Or re-export the dependency's type on purpose, and document it.

## Why

Hyrum's Law: with enough consumers, every observable behaviour of an API is depended on. A leaked dependency type turns that dependency's changes into your breaking changes.
