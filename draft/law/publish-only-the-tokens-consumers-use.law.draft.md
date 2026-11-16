# Publish only the tokens consumers use

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- A design system publishes the tokens its consumers style with; a token that only its own components use stays out of the published set, so renaming it breaks no one.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Enforcement

- Review only.

## Related

- [Style through the published API](style-through-published-api.law.draft.md) is the consumer's side: style a dependency only through what it publishes.
- [Own your public types](own-your-public-types.law.draft.md) keeps a library's public types narrow in the same way.
- [Deprecate before removing published API](deprecate-before-removing-published-api.law.draft.md) governs removing a token once it is published.
