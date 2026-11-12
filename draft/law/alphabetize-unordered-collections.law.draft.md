# Alphabetize unordered collections

A collection whose order means nothing is kept in one order, so every entry has one place to go.

<!-- TODO: the title is a working title, pending a ruling. -->

## Rule

- Keep a collection whose order means nothing in alphabetical order, so each entry has one place to go and a duplicate sits beside its twin. A collection whose order means something (execution, override, display or dependency order) keeps that order. Mark each unordered collection, so a tool sorts exactly those.

## Why

When order carries no meaning, any order works, so each author picks their own and a reader can't tell whether an order is deliberate. Sorting gives every entry one place: a reader finds an entry without scanning, an author adds one without choosing where, and a duplicate lands beside its twin. Order that does mean something is left alone, so each unordered collection is marked: a tool can't tell the two apart, and the marker records what only the author knows. The check fixes the order itself, so a sorted collection costs nothing to keep sorted.

- **Finding and diffing:** some developers sort property names "to more easily find and/or diff necessary properties at a later time" ([`sort-keys`][sort-keys]).
- **Noted disagreement:** "Others feel that it adds complexity and becomes burden to maintain." ([`sort-keys`][sort-keys])
- **Faster to find:** "Finding declarations in a sorted, large list is a little faster." ([perfectionist][perfectionist-readability])
- **One way to do it:** "If you set rules that say you can only do things one way, no one will have to spend time thinking about how to do it." ([perfectionist][perfectionist-review])
- **Fixed automatically:** "All rules are automatically fixable." ([perfectionist][perfectionist-fixable])

## Enforcement

- **Marker:** a TypeScript type `type Unordered<T> = T`, applied with `satisfies` to a value or wrapped around a union type.
  <!-- TODO: where `Unordered<T>` is declared is pending a ruling. -->
- **Plugin:** `eslint-plugin-perfectionist` 5.13.0, a dependency of `@knix-law/eslint-config`. Each rule below is opted in by [`matchesAstSelector`][arrays-selector] on the marker.
- `perfectionist/sort-arrays` at `error`: `{ type: 'alphabetical', useConfigurationIf: { matchesAstSelector: "TSSatisfiesExpression[typeAnnotation.typeName.name='Unordered'] > ArrayExpression" } }`.
  - It reports a marked array and `new Set([…] satisfies Unordered<…>)`; an unmarked array is left alone (probed).
  - It needs no fallback: an array no configuration matches "is left unsorted" ([`useConfigurationIf`][arrays-no-fallback]).
- `perfectionist/sort-objects` at `error`: `{ type: 'alphabetical', useConfigurationIf: { matchesAstSelector: "TSSatisfiesExpression[typeAnnotation.typeName.name='Unordered'] > ObjectExpression" } }, { type: 'unsorted' }`.
  - The `unsorted` fallback is required: an object no configuration matches takes the default options ([`useConfigurationIf`][objects-fallback]), whose `type` defaults to `'alphabetical'` ([`type`][objects-type]).
- `perfectionist/sort-union-types` at `error`: `{ type: 'alphabetical', useConfigurationIf: { matchesAstSelector: "TSTypeReference[typeName.name='Unordered'] > TSTypeParameterInstantiation > TSUnionType" } }, { type: 'unsorted' }`.
  - The `unsorted` fallback is required for the same reason ([`useConfigurationIf`][unions-fallback], [`type`][unions-type]).
- Sorting puts duplicate entries next to each other (probed).
- **Known gaps (probed):**
  - The marker as a type annotation, `const a: Unordered<string[]> = […]`, or an `as` cast is not reported.
  - A collection nested inside a marked one is not reported unless it carries its own marker.
  - A union inside the marker's argument but under another type, such as `Unordered<('b' | 'a')[]>`, is not reported.
- **Review only:** plain JavaScript, JSON and CSS collections, which have no type to mark.

[sort-keys]: https://github.com/eslint/eslint/blob/e36873082f0b565a68d3f8aa48a91a9aae34c2ac/docs/src/rules/sort-keys.md?plain=1#L10
[arrays-selector]: https://github.com/azat-io/eslint-plugin-perfectionist/blob/8174f2fe73b73eb00643d7dad874707ddd81d1b3/docs/content/rules/sort-arrays.mdx?plain=1#L335-L336
[arrays-no-fallback]: https://github.com/azat-io/eslint-plugin-perfectionist/blob/8174f2fe73b73eb00643d7dad874707ddd81d1b3/docs/content/rules/sort-arrays.mdx?plain=1#L302
[objects-fallback]: https://github.com/azat-io/eslint-plugin-perfectionist/blob/8174f2fe73b73eb00643d7dad874707ddd81d1b3/docs/content/rules/sort-objects.mdx?plain=1#L412
[objects-type]: https://github.com/azat-io/eslint-plugin-perfectionist/blob/8174f2fe73b73eb00643d7dad874707ddd81d1b3/docs/content/rules/sort-objects.mdx?plain=1#L159
[unions-fallback]: https://github.com/azat-io/eslint-plugin-perfectionist/blob/8174f2fe73b73eb00643d7dad874707ddd81d1b3/docs/content/rules/sort-union-types.mdx?plain=1#L277
[unions-type]: https://github.com/azat-io/eslint-plugin-perfectionist/blob/8174f2fe73b73eb00643d7dad874707ddd81d1b3/docs/content/rules/sort-union-types.mdx?plain=1#L98
[perfectionist-readability]: https://github.com/azat-io/eslint-plugin-perfectionist/blob/8174f2fe73b73eb00643d7dad874707ddd81d1b3/readme.md?plain=1#L27-L28
[perfectionist-review]: https://github.com/azat-io/eslint-plugin-perfectionist/blob/8174f2fe73b73eb00643d7dad874707ddd81d1b3/readme.md?plain=1#L34-L35
[perfectionist-fixable]: https://github.com/azat-io/eslint-plugin-perfectionist/blob/8174f2fe73b73eb00643d7dad874707ddd81d1b3/readme.md?plain=1#L21
