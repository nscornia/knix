# Call backends through the gateway

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- Call a backend only through the API gateway, by a relative path such as `/api/<service>/…` or a gateway host from runtime config; never send a request from front-end code to an internal service's own host.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Enforcement

- Review only.

## Related

- [Fetch data from its owning system](fetch-data-from-its-owning-system.law.draft.md) says which system data comes from; this law says the route a request takes to reach it.
- [Unwrap responses where they are fetched](unwrap-responses-where-they-are-fetched.law.draft.md) governs what the fetching method returns.
