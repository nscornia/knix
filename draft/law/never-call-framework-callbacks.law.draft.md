# Never call framework callbacks

A callback the framework invokes is the framework's to call; code that needs the same logic calls a named method instead.

## Rule

- Never call a lifecycle hook or other framework-invoked callback yourself.
- Put shared logic in a named method that both the callback and other code call.

## Why

The framework guarantees when and how often a callback runs. Angular runs `ngOnInit` exactly once, after the first `ngOnChanges` ([lifecycle guide][angular-lifecycle]); a hand call breaks both guarantees. Angular's style guide puts hook logic in well-named methods that the hooks call ([style guide][angular-style]). React, Vue and custom elements frame their callbacks the same way: the framework or browser calls them ([React `Component`][react-component], [Vue lifecycle][vue-lifecycle], [MDN custom elements][mdn-custom-elements]).

## Exceptions

- `super.<hook>()` inside the override of that same hook.

## Narrowings

- **Angular:** the nine hooks are `ngOnChanges`, `ngOnInit`, `ngDoCheck`, `ngAfterContentInit`, `ngAfterContentChecked`, `ngAfterViewInit`, `ngAfterViewChecked`, `ngOnDestroy` and `ngDoBootstrap`.
- **Angular specs:** drive the component through `fixture.detectChanges()` and `fixture.componentRef.setInput()` rather than calling a hook.

## Enforcement

- **Angular:** a custom lint rule, because `@angular-eslint/no-lifecycle-call` covers only member calls inside a decorated class declaration ([rule source][no-lifecycle-call]). The custom rule covers:
  - every class form: declaration, expression and mixin, decorated or not;
  - every access form: dot, bracket, `.call` and an aliased reference;
  - calls outside any class, which is where spec code calls hooks.
- Its hook list is checked against angular-eslint's.
- **Specs:** reported at `error`, with a message naming `fixture.detectChanges()` and `fixture.componentRef.setInput()`.

[angular-lifecycle]: https://angular.dev/guide/components/lifecycle
[angular-style]: https://angular.dev/style-guide
[react-component]: https://react.dev/reference/react/Component
[vue-lifecycle]: https://vuejs.org/guide/essentials/lifecycle.html
[mdn-custom-elements]: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
[no-lifecycle-call]: https://github.com/angular-eslint/angular-eslint/blob/957c6298c949b31169b3eeb96532bb8585f165b1/packages/eslint-plugin/src/rules/no-lifecycle-call.ts
