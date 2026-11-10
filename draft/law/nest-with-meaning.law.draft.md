# Nest with meaning

A data shape gains a level of nesting only when the grouping means something.

## Rule

Add a level only when the group is:

- validated together, by a cross-field rule;
- enabled or disabled as a unit;
- repeated per list item;
- mapped one-to-one to an external payload object, where flattening would need a two-way mapping.

Remove a wrapper that adds no meaning. A child key never repeats its parent's name: `button: { button-styles: … }` becomes `button: { properties: … }`.

## Why

Every level of nesting is one more step in every path, and in many frameworks it's also where state like validity and enabled-ness rolls up. A level with no role of its own lengthens every path and adds a seam where that state can split.

- **Data shape** ([Google JSON Style Guide][google-json]):
  - "Data should not be arbitrarily grouped for convenience."
  - A structured hierarchy is "only used if it makes semantic sense."
- **Angular forms** ([reactive forms][reactive-forms]):
  - A required control's "invalid status propagates to the parent form group element."
  - `markAsUntouched` "recalculates the touched status of all parent controls."

## Narrowings

- **Angular forms:** give each `FormGroup` level a reason from the list above ([reactive forms][reactive-forms], [`FormGroup`][form-group]).
  - Cross-field validation needs the fields under a common ancestor group ([form validation][form-validation]).
- **Angular child components:** a child never re-binds its parent's group with its own `[formGroup]`.
  - Bind `[formControl]` to the control it is given, or provide `ControlContainer` with `useExisting: FormGroupDirective` in `viewProviders` and use `formControlName`.
    - The second form works because `formControlName` looks up `ControlContainer` limited to its host, and a host-limited lookup finds what the component provides through `viewProviders` ([hierarchical DI, `host` and `viewProviders`][hierarchical-di]).
  - Why: Angular Material shows a field's error when the control is invalid and either touched or its form submitted ([`error-options.ts`][error-options]). The form is the nearest `FormGroupDirective` ([`error-state.ts`][error-state]). A child's own `[formGroup]` becomes that nearest directive and never sees the parent's submit, so untouched invalid fields show no error on submit.

## Enforcement

- Review only. There is no numeric depth limit.

[reactive-forms]: https://angular.dev/guide/forms/reactive-forms
[form-group]: https://angular.dev/api/forms/FormGroup
[form-validation]: https://angular.dev/guide/forms/form-validation
[error-options]: https://github.com/angular/components/blob/2163de0fe01658260e0e40668574abf10181b999/src/material/core/error/error-options.ts
[error-state]: https://github.com/angular/components/blob/2163de0fe01658260e0e40668574abf10181b999/src/material/core/common-behaviors/error-state.ts
[hierarchical-di]: https://angular.dev/guide/di/hierarchical-dependency-injection
[google-json]: https://google.github.io/styleguide/jsoncguide.html
