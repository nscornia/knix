# Own your public types

A public API exposes types the library owns, never a dependency's types by accident.

## Rule

- Expose a narrow type you own, sized to what consumers use.
- Or re-export the dependency's type on purpose, and document it.
- The public API never references a type that no entry point exports.
  - An entry point is a file `package.json` names in `exports`, `main` or `types`.
  - The public API is what the entry points export, not what a file's own `export` keyword exposes.
    - It also includes any `declare global` in a file an entry point reaches.

## Why

Hyrum's Law: with enough consumers, every observable behaviour of an API is depended on. A leaked dependency type turns that dependency's changes into your breaking changes.

## Related

- [Publish only the tokens consumers use](publish-only-the-tokens-consumers-use.law.draft.md) keeps a design system's published tokens narrow in the same way.
