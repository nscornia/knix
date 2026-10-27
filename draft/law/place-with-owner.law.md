# Place with the owner

Code and resources live with the unit that owns them, and move up only when they become shared.

## Rule

- Place code and resources with their owner.
- When two or more owners share something, hoist it to their nearest common owner.
- Give a surprising placement a one-line reason.
- Apply the rule to code you touch. Do not relocate everything at once.

## Why

Code that lives with its owner is found, changed and removed together with that owner. When several owners share code, it moves to their nearest common owner and is passed down to them. Siblings then never reach into one another, so each can change or be removed without breaking the others.

- **Angular:** "Organize your project into subdirectories based on the features of your application or common themes to the code in those directories", and avoid subdirectories "based on the type of code that lives in those directories" ([Angular style guide][ng-style]).
- **Terraform:** "Instead of a module embedding its dependencies, creating and managing its own copy, the module receives its dependencies from the root module, which can therefore connect the same modules in different ways to produce different results." ([Terraform module composition][tf-composition])

## Exceptions

- View-scoped units.
- A deliberate public entry point.
- A speculative second consumer. Never hoist ahead of one.

## Narrowings

- **Angular:** move a service up once a sibling feature imports it.
- **Terraform:** shared infrastructure goes in the common parent module and is passed down as inputs. Child modules never read each other's outputs.
  - Sibling modules stay structurally parallel. Low confidence: one review signal.

## Enforcement

- `eslint-plugin-boundaries` at `warn`, with element roots configured per repository.

[ng-style]: https://github.com/angular/angular/blob/8260542/adev/src/content/best-practices/style-guide.md
[tf-composition]: https://developer.hashicorp.com/terraform/language/modules/develop/composition
