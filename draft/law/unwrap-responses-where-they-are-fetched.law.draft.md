# Unwrap responses where they are fetched

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- A method that fetches data returns what its callers use: it unwraps the response and reshapes it once, so no caller reads `response.x`. When the backend serves this frontend, shape the response there and pass it through.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Enforcement

- Review only.

## Related

- [Type values precisely](type-values-precisely.law.draft.md) validates a response once where it enters; this law decides what the fetching method returns.
- [Fetch data from its owning system](fetch-data-from-its-owning-system.law.draft.md) decides which system the data comes from.
- [Call backends through the gateway](call-backends-through-the-gateway.law.draft.md) decides the route a fetching method's request takes.
