# Build versus buy, in order

Before writing a helper, look for one that already exists, in a fixed order.

## Rule

- Check, in order, before writing a helper:
  1. a language or platform feature;
  2. a library the project already installs;
  3. a new dependency;
  4. custom code.
- Justify a new dependency on its maintenance status, open advisories, size and license.
- When a library call replaces existing code, it keeps that code's behaviour, defaults included.
  - Example: lodash `get(object, path, fallback)` returns `fallback` only for `undefined`. A hand-rolled getter ending in `|| fallback` also replaces `''`, `0` and `false`, so a straight swap changes behaviour.

## Related

- [Reuse existing utilities](reuse-existing-utilities.law.md) covers the project's own utilities, which come before this order applies.
