# Style through the published API

A dependency is styled only through the styling surface it publishes.

## Rule

- Never select a dependency's private DOM structure or class names.
- When the published API cannot express a need, the wrapping library extends or owns the component. Consumers never reach in.

## Why

A dependency's internal DOM and class names aren't part of its public API, so it makes no compatibility promise about them. Styles that reach into them can break on an ordinary upgrade, and nothing reports the breakage.

- **Public API:** "Software using Semantic Versioning MUST declare a public API." Major and minor versions are defined against that API ([semver.org][semver]).
- **Angular Material v15**, a major release ([v15 MDC migration guide][mdc-migration]):
  - "The new components have different internal DOM and CSS styles."
  - Styles "overriding styles on internal elements" will likely need adjusting.
  - "Most of the TypeScript APIs and component/directive selectors" stayed close to the old ones.

## Exceptions

- The wrapping library itself, with a reason given at each site.
- Classes the dependency documents for public use.

## Narrowings

- **Angular Material:** use the `mat.*-overrides()` mixins and system tokens. Never select `.mat-mdc-*` or `.mdc-*` classes.
  - The theming guide says: "Component DOM structure and CSS classes are considered private implementation details that may change at any time." ([theming guide, Direct Style Overrides][material-theming])
  - Open: whether non-MDC `.mat-*` classes are covered.
- **Design tokens:** name tokens for your own components and meaning, never for a dependency's internal structure.

## Enforcement

- A Stylelint selector rule at `error`, with an allowlist option for the wrapping library.
- A separate rule against `!important`, at `error`.

## Related

- [Use the design system](use-the-design-system.law.draft.md) governs when to use the design system's components.
- [Use design tokens for style values](use-design-tokens-for-style-values.law.draft.md) governs the values a style takes.

[material-theming]: https://github.com/angular/components/blob/2163de0fe01658260e0e40668574abf10181b999/guides/theming.md
[semver]: https://semver.org/
[mdc-migration]: https://github.com/angular/components/blob/da272ad398640e49c3a84195b7bfb16c5fac36f6/guides/v15-mdc-migration.md
