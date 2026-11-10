# Name a type for one of its values

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. -->

## Rule

- A type whose value is one entity, or one choice from a set, takes a singular name: `Strategy`, `DistanceKey`, `DescriptorStatus`.
- A plural name only where one value holds many: a collection or keyed map (`Organizations = Organization[]`), or a combination of flags.
- A word plural in form but one thing in meaning (`Status`, `Settings`, `ModalOptions`, `Data`) counts as singular. Never coin a plural.
- A file is named for the type it carries.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

- **Plural means many** ([AIP-140][aip-140-repeated]):
  - "Repeated fields **must** use the proper plural form, such as `books` or `authors`."
  - "non-repeated fields **should** use the singular form such as `book` or `author`."
  - "use `repeated Book books`, **not** `Books books = 1`"
- **One choice takes a singular name** ([CA1717][ca1717]):
  - "If only one value of an enumeration can be specified at a time, the name of the enumeration should be a singular word."
- **No coined plurals** ([AIP-122][aip-122-coin]):
  - "Collection segments **must not** "coin" words by adding "s" in such cases (e.g, avoid "infos")."

## Enforcement

- **Declarations:** checked in review.

[aip-140-repeated]: https://github.com/aip-dev/google.aip.dev/blob/126508e75db9df95556dbc05e0c44bcd1b297d49/aip/general/0140.md?plain=1#L59-L63
[ca1717]: https://github.com/dotnet/docs/blob/b137906b7888973c9006d93685d29f626cb6e2e7/docs/fundamentals/code-analysis/quality-rules/ca1717.md?plain=1#L35
[aip-122-coin]: https://github.com/aip-dev/google.aip.dev/blob/8714ee319d14bffe8ee14226f5d448a2062b6b0b/aip/general/0122.md?plain=1#L79-L80
