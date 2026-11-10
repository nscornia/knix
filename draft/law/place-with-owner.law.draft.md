# Place with the owner

Code and resources live with the unit that owns them, and move up only when they become shared.

## Rule

- Place code and resources with their owner.
- When two or more owners share something, hoist it to their nearest common owner.
- Pass shared code down explicitly. If middle layers only forward it, extract them and pass content as children instead.
- Use the framework's injection (context, provide/inject, a DI provider) only when many distant consumers need it.
  - Provide it at the nearest common owner, not the root.
- Give a surprising placement a one-line reason.
- Apply the rule to code you touch. Do not relocate everything at once.

## Why

Code that lives with its owner is found, changed and removed together with that owner. When several owners share code, it moves to their nearest common owner and is passed down to them. Siblings then never reach into one another, so each can change or be removed without breaking the others.

- **Colocation** ([Kent C. Dodds][colocation]):
  - "Place code as close to where it's relevant as possible."
  - A utility kept apart from its component "remains" after the component is deleted.
- **Shared state:**
  - "move it to their closest common parent, and then pass it down to them via props" ([React, sharing state][react-lifting]).
  - Passing props "makes it very clear which components use which data!" ([React, context][react-context]).
  - Layers that only forward data mean "you forgot to extract some components along the way."
  - Context fits when "some information is needed by distant components in different parts of the tree."
- **Provider scope** ([Angular, hierarchical injectors][ng-di]):
  - A service provided at the root is "visible everywhere in the application."
  - "restrict access to a service to the application domain where it belongs."
- **No sibling imports:**
  - A file in `features/aaa` "cannot import code from any file in `features/bbb`" ([Feature-Sliced Design][fsd-layers]).
  - Instead of importing across features, "compose different features at the application level" ([Bulletproof React][bulletproof]).
- **Angular** ([style guide][ng-style]):
  - "Organize your project into subdirectories based on the features of your application or common themes to the code in those directories."
  - Avoid subdirectories "based on the type of code that lives in those directories."
- **Terraform:** "the module receives its dependencies from the root module" instead of "creating and managing its own copy" ([module composition][tf-composition]).

## Exceptions

- **Per-instance state:** hoist a shared definition, but provide each instance at its own view when consumers need separate instances.
  - "each instance of `VillainsList` will have its own instance of `VillainsService`" ([Angular, hierarchical injectors][ng-di]).
  - "pressing one panel's button does not affect the other panel--they are independent" ([React, sharing state][react-lifting]).
- A deliberate public entry point.
- A speculative second consumer. Never hoist ahead of one.
  - A capability "we presume our software needs in the future should not be built now" ([Martin Fowler, Yagni][yagni]).

## Narrowings

- **Angular:**
  - Move a service up once a sibling feature imports it.
  - Hoist a shared component style to a stylesheet both components import, not into the parent's styles.
    - A component's styles "only apply to elements defined in that component's template" ([Angular, component styling][ng-styling]).
- **Terraform:** shared infrastructure goes in the common parent module and is passed down as inputs.
  - Sibling modules never call each other; the parent wires one module's outputs into another's inputs.
    - Nested modules should ideally be "composable by the caller, rather than calling directly to each other" ([standard module structure][tf-structure]).
  - Child modules live in `./modules/<module_name>` ([style guide][tf-style-modules]).
  - Within one configuration only. Separate configurations read each other's root outputs through `terraform_remote_state` or a data-only module ([output values][tf-outputs]).

## Enforcement

- `boundaries/dependencies` from `eslint-plugin-boundaries` at `error`, with element roots configured per repository ([rule docs][boundaries-dependencies]).
  - The older `boundaries/no-private` is deprecated.
- Simpler alternative: `import-x/no-restricted-paths` with path zones, needing no element configuration ([rule docs][no-restricted-paths]).
  - It needs `createNodeResolver()` in `import-x/resolver-next`. Without a resolver, nothing is reported.
- Explicit passing and provider scope: review only. No lint rule detects forward-only layers or an over-broad provider.

[colocation]: https://kentcdodds.com/blog/colocation
[react-lifting]: https://react.dev/learn/sharing-state-between-components
[react-context]: https://react.dev/learn/passing-data-deeply-with-context
[ng-di]: https://github.com/angular/angular/blob/e36a63e20e302e28b2011cc34aaf9713df8b156e/adev/src/content/guide/di/hierarchical-dependency-injection.md
[ng-styling]: https://github.com/angular/angular/blob/e36a63e20e302e28b2011cc34aaf9713df8b156e/adev/src/content/guide/components/styling.md
[fsd-layers]: https://feature-sliced.design/docs/reference/layers
[bulletproof]: https://github.com/alan2207/bulletproof-react/blob/9506629ed003a561c6627735480cce4994244bb4/docs/project-structure.md
[ng-style]: https://github.com/angular/angular/blob/8260542ce03780d158638723ccaf7f52e9708da1/adev/src/content/best-practices/style-guide.md
[tf-composition]: https://developer.hashicorp.com/terraform/language/modules/develop/composition
[tf-structure]: https://developer.hashicorp.com/terraform/language/modules/develop/structure
[tf-style-modules]: https://developer.hashicorp.com/terraform/language/style#local-modules
[tf-outputs]: https://developer.hashicorp.com/terraform/language/values/outputs
[yagni]: https://martinfowler.com/bliki/Yagni.html
[boundaries-dependencies]: https://www.jsboundaries.dev/docs/rules/dependencies/
[no-restricted-paths]: https://github.com/un-ts/eslint-plugin-import-x/blob/4b9ea02026781c4f1afd40859fb30a43722b4258/docs/rules/no-restricted-paths.md
