# Use type unless extending

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. -->

## Rule

- Declare an object type with `type` by default.
- Use `interface` only where one of these holds:
  - it extends another object type (`interface Child extends Base { … }`);
  - it sits inside a `declare` block (`declare module`, `declare global` or `declare namespace`).
- Never declare one interface twice outside a `declare` block. A declaration merge there is an error.
- **Declaration files:** `*.d.ts` files are skipped.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

- **Extension checks conflicts:**
  - "Interfaces create a single flat object type that detects property conflicts, which are usually important to resolve!" ([TypeScript wiki, Performance][ts-wiki-conflicts])
  - "Using interfaces with `extends` can often be more performant for the compiler than type aliases with intersections" ([TypeScript handbook][ts-everyday-perf]).
- **Only interfaces merge** ([TypeScript handbook][ts-everyday-merge]):
  - "Type aliases may not participate in declaration merging, but interfaces can".
  - "a type cannot be re-opened to add new properties vs an interface which is always extendable." ([TypeScript handbook][ts-everyday-reopen])
- **Noted disagreement:** each of these prefers `interface` by default.
  - "If you would like a heuristic, use `interface` until you need to use features from `type`." ([TypeScript handbook][ts-everyday-heuristic])
  - "Prefer interfaces over type literal aliases" ([Google TypeScript style guide][google-ts-interfaces]).
  - typescript-eslint's `consistent-type-definitions` defaults to `'interface'` ([rule source][ctd-default]).

## Enforcement

- **Interfaces:** `@knix-law/use-type-unless-extending-restricted-syntax`, the plugin's copy of core `no-restricted-syntax`, at `error`:
  - `TSInterfaceDeclaration[extends.length=0]:not(TSModuleDeclaration[declare=true] TSInterfaceDeclaration)`, on `**/*.ts`, ignoring `**/*.d.ts`.
  - It reports a plain or generic interface, including one in a plain `namespace` (probed).
  - It passes one that extends, or sits in a `declare module`, `declare global` or `declare namespace` block (probed).
  - In a `*.d.ts` file it would report an interface in a non-`declare` `namespace`, which is ambient there; hence the skip (probed).
- **Merges:** `@typescript-eslint/no-redeclare` at `error`, `{ ignoreDeclarationMerge: false }`, with core `no-redeclare` off.
  - It reports a second interface of the same name in a module, and not an augmentation (probed).
  - Without it, `tsc` reports only a later use the merge breaks (probed).
- **Not used:** `@typescript-eslint/consistent-type-definitions` with `'type'`.
  - It reports `interface … extends`, and offers a fix for an interface in a `declare module` block (probed).
- **Intersections:** an extension written as an intersection is checked in review.

[ts-wiki-conflicts]: https://github.com/microsoft/TypeScript/wiki/Performance/66ff1e4cb40a8749dfaf07d6b22dc0c0da3771dd#preferring-interfaces-over-intersections
[ts-everyday-perf]: https://github.com/microsoft/TypeScript-Website/blob/70d14cd9d312d555876ced41c402dc529f4c526d/packages/documentation/copy/en/handbook-v2/Everyday%20Types.md?plain=1#L484
[ts-everyday-merge]: https://github.com/microsoft/TypeScript-Website/blob/70d14cd9d312d555876ced41c402dc529f4c526d/packages/documentation/copy/en/handbook-v2/Everyday%20Types.md?plain=1#L481
[ts-everyday-reopen]: https://github.com/microsoft/TypeScript-Website/blob/70d14cd9d312d555876ced41c402dc529f4c526d/packages/documentation/copy/en/handbook-v2/Everyday%20Types.md?plain=1#L408
[ts-everyday-heuristic]: https://github.com/microsoft/TypeScript-Website/blob/70d14cd9d312d555876ced41c402dc529f4c526d/packages/documentation/copy/en/handbook-v2/Everyday%20Types.md?plain=1#L486
[google-ts-interfaces]: https://github.com/google/styleguide/blob/dde305184e15530cfc321303522060b9883664ff/tsguide.html#L3125
[ctd-default]: https://github.com/typescript-eslint/typescript-eslint/blob/93a92689c215816c7e0dc011cfdd0634b3dd8edc/packages/eslint-plugin/src/rules/consistent-type-definitions.ts#L30
