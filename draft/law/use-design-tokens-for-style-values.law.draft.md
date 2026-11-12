# Use design tokens for style values

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- A style takes each color, spacing, border radius and typography value from a design token, never a literal; typography comes from a type-level token, never a raw `font-weight` such as `bold`. Only the files that define tokens hold literals, and CSS keywords and zero need no token.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Enforcement

<!-- TODO: pending a ruling. -->

## Related

- [Use the design system](use-the-design-system.law.draft.md) governs which component a need uses; a hand-built one builds from the design system's tokens.
- [Style through the published API](style-through-published-api.law.draft.md) governs how a dependency is styled, including how tokens are named.
- [Set backgrounds through longhands](set-backgrounds-through-longhands.law.draft.md) governs which background property a value is set through.
