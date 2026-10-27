# Style through the published API

A dependency is styled only through the styling surface it publishes.

## Rule

- Never select a dependency's private DOM structure or class names.
- When the published API cannot express a need, the wrapping library extends or owns the component. Consumers never reach in.

## Exceptions

- The wrapping library itself, with a reason given at each site.
- Classes the dependency documents for public use.

## Narrowings

- **Angular Material:** use the `mat.*-overrides()` mixins and system tokens. Never select `.mat-mdc-*` or `.mdc-*` classes.
  - The theming guide says: "Component DOM structure and CSS classes are considered private implementation details that may change at any time." ([theming guide, Direct Style Overrides][material-theming])
  - Open: whether non-MDC `.mat-*` classes are covered.
- **Design tokens:** name tokens for your own components and meaning, never for a dependency's internal structure.

## Enforcement

- A Stylelint selector rule at `warn`, with an allowlist option for the wrapping library.
- A separate rule against `!important`, at `error`.

[material-theming]: https://github.com/angular/components/blob/main/guides/theming.md
