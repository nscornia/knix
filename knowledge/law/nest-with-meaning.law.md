# Nest with meaning

A data shape gains a level of nesting only when the grouping means something.

## Rule

Add a level only when the group is:

- validated together, by a cross-field rule;
- enabled or disabled as a unit;
- repeated per list item;
- mapped one-to-one to an external payload object, where flattening would need a two-way mapping.

Remove a wrapper that adds no meaning. A child key never repeats its parent's name: `button: { button-styles: … }` becomes `button: { properties: … }`.

## Enforcement

Review only. There is no numeric depth limit.

## Narrowings

- **Angular forms:** give each `FormGroup` level a reason from the list above ([reactive forms][reactive-forms], [`FormGroup`][form-group]).
  - Cross-field validation needs the fields under a common ancestor group ([form validation][form-validation]).
- **Angular child components:** a child never re-binds its parent's group with its own `[formGroup]`.
  - Bind `[formControl]` to the control it is given, or provide `ControlContainer` with `useExisting: FormGroupDirective` in `viewProviders` and use `formControlName`.
  - Why: Angular Material shows a field's error when the control is invalid and either touched or its form submitted ([`error-options.ts`][error-options]). The form is the nearest `FormGroupDirective` ([`error-state.ts`][error-state]). A child's own `[formGroup]` becomes that nearest directive and never sees the parent's submit, so untouched invalid fields show no error on submit.

[reactive-forms]: https://angular.dev/guide/forms/reactive-forms
[form-group]: https://angular.dev/api/forms/FormGroup
[form-validation]: https://angular.dev/guide/forms/form-validation
[error-options]: https://github.com/angular/components/blob/main/src/material/core/error/error-options.ts
[error-state]: https://github.com/angular/components/blob/main/src/material/core/common-behaviors/error-state.ts
