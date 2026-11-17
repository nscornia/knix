# Keep business logic out of templates

A component's decisions and state changes stay testable from its class, without rendering.

## Rule

- A rule over domain state, a status value or a permission moves out of the template. The recommended form is a named `computed`; a standalone function is the alternative.
- An event binding calls the owner's operation rather than writing domain data. A view-only flag may be set in place.
- Straightforward presentation expressions stay in the template.

## Why

A decision written in a template can be tested only by rendering the component and reading the DOM. Moved to a named `computed`, it is tested from the class alone, and the template says what appears rather than how it is decided. A state change kept in the owner's operation is tested the same way, without a rendered click.

- **Class tests** ([Angular, component testing basics][angular-component-testing]):
  - DOM tests "require creating the component's host element in the browser DOM".
  - "_testing the component class alone_, without DOM involvement, can validate much of the component's behavior in a straightforward, more obvious way."
- **Simple expressions** ([Vue style guide][vue-simple-expressions]):
  - "Component templates should only include simple expressions, with more complex expressions refactored into computed properties or methods."
  - "We should strive to describe _what_ should appear, not _how_ we're computing that value."

## Enforcement

- Review only: nothing is linted.

## Related

- [Derive declaratively](derive-declaratively.law.draft.md) owns calculations.
- [Only the owner writes](only-the-owner-writes.law.draft.md) owns writes into objects a consumer doesn't own.

[angular-component-testing]: https://github.com/angular/angular/blob/148fee3991e1aff1c8cf1b50437d1cf954d652ab/adev/src/content/guide/testing/components-basics.md?plain=1#L7-L10
[vue-simple-expressions]: https://github.com/vuejs/docs/blob/40aa88af0094f7bab4aaf786e55c748a6a251d88/src/style-guide/rules-strongly-recommended.md?plain=1#L605-L609
