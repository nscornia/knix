# Batch bulk actions into one request

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- A bulk action over many items is one request to an endpoint that takes the list. An API whose clients act on many items at once offers that endpoint and states whether it is atomic or reports each item's success. Where no such endpoint exists yet, a client may send one request per item, handling each item's failure. That loop is tech debt: track it, and replace it with the batch call once the API's owner adds the endpoint.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

- **Batch methods:** "Some APIs need to allow users to modify a set of resources in a single transaction. A batch update method provides this functionality." ([AIP-234][aip-234-intro])
- **Atomic or partial success:**
  - "The batch update method **may** support atomic (all resources updated or none are) or partial success behavior." ([AIP-234][aip-234-atomic])
  - "Operations that are simple passthrough database transactions **should** use an atomic operation, while operations that manage complex resources **should** use partial success operations." ([AIP-234][aip-234-atomic])
  - "Synchronous batch update **must** be atomic." ([AIP-234][aip-234-sync])
  - Batch create takes the same choice ([AIP-233][aip-233-atomic]).

## Enforcement

- Review only: a lint rule can't see whether a batch endpoint exists, so it can't tell a tracked loop from a missed batch call.
  - A loop or mapped stream that sends one request per item.
  - That such a loop handles each item's failure and has a tracked item to replace it.

[aip-234-intro]: https://github.com/aip-dev/google.aip.dev/blob/2ccc61a4e09882bdd63aea1a42dceebc37bf3bd5/aip/general/0234.md?plain=1#L13-L14
[aip-234-atomic]: https://github.com/aip-dev/google.aip.dev/blob/2ccc61a4e09882bdd63aea1a42dceebc37bf3bd5/aip/general/0234.md?plain=1#L61-L67
[aip-234-sync]: https://github.com/aip-dev/google.aip.dev/blob/2ccc61a4e09882bdd63aea1a42dceebc37bf3bd5/aip/general/0234.md?plain=1#L72
[aip-233-atomic]: https://github.com/aip-dev/google.aip.dev/blob/2ccc61a4e09882bdd63aea1a42dceebc37bf3bd5/aip/general/0233.md?plain=1#L59-L73
