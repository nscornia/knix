# Fetch data from its owning system

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- Data another system owns, such as country lists, currencies or product catalogs, comes from that system at runtime; never paste a copy into code, where it goes stale. Data the code itself owns lives in its own module beside the code that uses it, not inline in a component or service.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Enforcement

- Review only.

## Related

- [Place with the owner](place-with-owner.law.draft.md) governs where code and resources live; this law applies it to data the code owns.
- [Derive declaratively](derive-declaratively.law.draft.md) forbids a copy that code syncs by hand; this law applies that to data another system owns.
