# Use as const, not enum

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. -->

## Rule

- Never write an `enum`: string, numeric, mixed or `const`, ambient `const enum` included.
- Write an enumeration as an `as const` object or array.
- **Allowed:** `declare enum`, and a non-`const` enum inside a `declare` block (`declare module`, `declare global` or `declare namespace`).
- **Declaration files:** `*.d.ts` files are skipped, except that `const enum` is banned there too.

## Examples

**Never write an `enum`**, incorrect: a string enum, which a runtime that strips types cannot run.

```ts
export enum Status {
  Active = 'active',
  Closed = 'closed',
}
```

Correct: an `as const` object, with its type derived from it.

```ts
export const Status = { Active: 'active', Closed: 'closed' } as const;
export type Status = (typeof Status)[keyof typeof Status];
```

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

- **`as const` suffices:** "In modern TypeScript, you may not need an enum when an object with `as const` could suffice" ([TypeScript handbook, Enums][ts-enums-as-const]).
- **Runtimes that strip types** ([Node.js, TypeScript][node-ts]):
  - "any TypeScript features that involve replacing TypeScript syntax with new JavaScript syntax will error."
  - "The most prominent features that require transformation are:" the first listed is "`Enum` declarations".
  - "Type stripping is now stable." (v25.2.0 and v24.12.0, [Node.js, TypeScript][node-ts])
- **Const enums** ([TypeScript handbook, Enums][ts-enums-const]):
  - `isolatedModules` "is fundamentally incompatible with ambient const enums."
  - "You can easily ban const enums with the help of a linter." ([TypeScript handbook, Enums][ts-enums-ban])
- **Noted disagreement:**
  - "Code *must not* use `const enum`; use plain `enum` instead." ([Google TypeScript style guide][google-ts-const-enum])
  - "If you don't mind enums being treated as a namespaced bag of values, rather than opaque identifiers, you likely don't need this rule." ([`no-unsafe-enum-comparison`][tse-enum-comparison])

## Caveat

An `as const` union is structural. It accepts a matching string literal, and a member of another enumeration with the same value, where a string enum rejects both on assignment (probed). Comparing members of two enumerations is no longer an error either (probed). The law gives up those checks and adds no replacement. A misspelt literal still fails, since it matches no member (probed). A numeric enum never rejected a `number` variable (probed).

## Enforcement

- `@knix-law/use-as-const-not-enum-restricted-syntax`, the plugin's copy of core `no-restricted-syntax`, at `error`:
  - **Source files** (`**/*.ts`, ignoring `**/*.d.ts`), two selectors:
    - `TSEnumDeclaration:not([const=true]):not([declare=true]):not(TSModuleDeclaration[declare=true] TSEnumDeclaration)`, for a written enum;
    - `TSEnumDeclaration[const=true]`, for every `const enum`, ambient included.
  - **Declaration files** (`**/*.d.ts`): `TSEnumDeclaration[const=true]` only.
    - An `export enum` there is ambient, but its `declare` flag is `false`, so the first selector would report it (probed).
  - It reports string, numeric, mixed, `const` and `declare const` enums (probed).
  - It passes `declare enum`, an enum in a `declare module`, `declare global` or `declare namespace` block, and an `as const` object (probed).
- **Missing `as const`:** planned, not yet built: `@knix-law/require-as-const`, a typed rule at `error`, whose message is "Declare `X` with `as const`."
  - It reports a type alias `ValueOf<typeof X>`, `(typeof X)[number]` or `(typeof X)[keyof typeof X]` that resolves to a widened `string` or `number` (probed).
  - It passes the `as const` forms and `keyof typeof X` (probed).
  - It skips a value with a type annotation, whose widened type is the author's choice.
  - Without type information, it checks a same-file object or array literal with no `as const`, looking through `satisfies`.
    - It skips a literal whose every property ends in `as const`, which keeps literal types (probed).
  - A list with no type derived from it is checked in review.
- **Not used:** `erasableSyntaxOnly`. It rejects the same written enums, but also a runtime `namespace`, so it is wider than this law (probed).

[ts-enums-as-const]: https://github.com/microsoft/TypeScript-Website/blob/70d14cd9d312d555876ced41c402dc529f4c526d/packages/documentation/copy/en/reference/Enums.md?plain=1#L412
[ts-enums-const]: https://github.com/microsoft/TypeScript-Website/blob/70d14cd9d312d555876ced41c402dc529f4c526d/packages/documentation/copy/en/reference/Enums.md?plain=1#L373
[ts-enums-ban]: https://github.com/microsoft/TypeScript-Website/blob/70d14cd9d312d555876ced41c402dc529f4c526d/packages/documentation/copy/en/reference/Enums.md?plain=1#L385
[node-ts]: https://nodejs.org/docs/v26.13.0/api/typescript.html
[google-ts-const-enum]: https://github.com/google/styleguide/blob/dde305184e15530cfc321303522060b9883664ff/tsguide.html#L2557
[tse-enum-comparison]: https://github.com/typescript-eslint/typescript-eslint/blob/bdf0a9c5fc58bbba7199106b7fb1346d4cfef822/packages/eslint-plugin/docs/rules/no-unsafe-enum-comparison.mdx?plain=1#L90
