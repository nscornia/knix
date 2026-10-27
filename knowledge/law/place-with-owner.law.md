# Place with the owner

Code and resources live with the unit that owns them, and move up only when they become shared.

## Rule

- Place code and resources with their owner.
- When two or more owners share something, hoist it to their nearest common owner.
- Give a surprising placement a one-line reason.
- Apply the rule to code you touch. Do not relocate everything at once.

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
