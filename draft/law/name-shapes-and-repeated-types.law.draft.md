# Name shapes and repeated types

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. -->

## Rule

- Give an object shape with 3 or more members a named `type`, exported or not, instead of an inline or inferred shape.
  - Members count the same way in an inline object type and in an inferred object literal.
  - A shape whose only members are index signatures does not count.
  - A shape nested inside a named `type` or `interface` counts.
    - A type alias's own body, and that body's top-level union and intersection members, are already named.
- Give a concept written 3 or more times in a file, or in 2 or more files of a repository, one named `type`.
  - Compare expressions by the type they resolve to, not by their text.
  - Counted: unions, intersections, object types, tuples, function and constructor types, `keyof`, `typeof`, indexed access, mapped, conditional and template-literal types.
  - Not counted: a plain name, a name with type arguments, `T[]`, `readonly` on any of those, or a type joined with `null` or `undefined`.
- Where the repository already has a named type for the concept, use it. A dependency's types do not count.
- Shapes that match by coincidence keep separate names.

## Why

A named type says once what a shape is, so every place that uses it is checked against one declaration and changes with it. A shape written inline must be repeated wherever it is needed, and another module can reach it only by deriving it, such as `ReturnType<typeof f>`, never by importing its name. When a value fails against a named type, the error names the type; against an inline one, it prints the whole structure. Giving a literal a declared type also moves checking to where the literal is written: a missing property is reported at the declaration instead of where the value is later used, and a misspelled extra property is reported at all, where an inferred literal passes it silently. Shapes that match by coincidence keep separate names, because the name tells readers which concept a value is.

- **One name for a reused type:**
  - "it's common to want to use the same type more than once and refer to it by a single name." ([TypeScript handbook, Type Aliases][ts-type-aliases])
  - "Use type aliases for types that are repetitive to write." ([Google TypeScript style guide][google-ts-repetitive])
- **Checking at the declaration** ([Google TypeScript style guide, Use structural types][google-ts-structural]):
  - "explicitly include the type at the declaration of the symbol (this allows more precise type checking and error reporting)."
  - "the error will be at the function call site, rather than at the object declaration site." ([Google TypeScript style guide][google-ts-call-site])
- **Excess properties** ([TypeScript handbook, Excess Property Checks][ts-excess]):
  - "Object literals get special treatment and undergo _excess property checking_ when assigning them to other variables, or passing them as arguments."
- **Partly adopted:**
  - "Whether an annotation is required is decided by the code reviewer." The law decides it at 3 members. ([Google TypeScript style guide][google-ts-reviewer])
  - "Or use inline object types for complex returns." ([Google TypeScript style guide][google-ts-repetitive])
  - "try using fewer type annotations than you think" ([TypeScript handbook, Everyday Types][ts-fewer-annotations])

## Exceptions

- **Function-local variables:** a local's inferred shape is exempt, unmarked.
  - A local's shape leaves its function only through a return or a field, both checked, or through an argument, which the parameter's type checks.
- **A coincidental match:** an inline expression that matches a named type for a different concept takes a disable comment that says why.

## Enforcement

- **Inline shapes:** `@knix-law/name-shapes-and-repeated-types-restricted-syntax`, the plugin's copy of core `no-restricted-syntax`, at `error`, with one selector:
  - `TSTypeLiteral[members.length>=3]:has(> :not(TSIndexSignature)):not(TSTypeAliasDeclaration > TSTypeLiteral):not(TSTypeAliasDeclaration > TSIntersectionType > TSTypeLiteral):not(TSTypeAliasDeclaration > TSUnionType > TSTypeLiteral)`
  - It reports a shape with 3 or more members (probed).
    - It checks a variable, a parameter, a return type, a type argument, a class field and `satisfies` (probed).
    - Inside a named type, it checks properties, function types, methods, type arguments, tuples, mapped and conditional types, and constraints (probed).
    - Two properties with an index signature count as 3 members (probed).
  - It passes a 2-member shape, an index-signature-only shape, a type alias's body, and that body's top-level union and intersection members (probed).
- **Inferred shapes:** planned, not yet built: `@knix-law/no-inferred-object-shape`, a typed rule at `error`.
  - It reports an inferred type that carries an object-literal shape with 3 or more properties, at any depth.
    - It checks a class field, a module-level variable, and a function with no return type.
    - It reports the outermost such shape; once that shape is named, the inline-shape check covers the shapes nested in it.
  - It reports the shape only where the literal is written, so a field that aliases a constant is not reported twice.
  - It skips `as const`, `satisfies` and annotated declarations.
- **Repeats in a file:** planned, not yet built: `@knix-law/no-repeated-type-expression`, a typed rule at `error`.
  - It reports a group once, at its first occurrence, and lists the other lines.
  - Its message suggests a built-in name where one fits: `Record`, `ReadonlyArray`, or `VoidFunction` where `lib` includes `dom`.
- **Existing types:** planned, not yet built: `@knix-law/use-existing-type`, a typed rule at `error`.
  - It reports an inline expression that exactly matches a non-generic `type` alias or `interface` anywhere in the repository, exported or not.
  - Its report names every matching type.
- **Type comparison**, for the repeat and existing-type rules: a structural canonical form of the resolved type.
  - Aliases are transparent and anonymous object types expand; named classes, interfaces and type parameters compare by declaration.
    - A candidate named type for the existing-type rule is itself expanded, inherited members included.
  - Union and intersection members are sorted, and `readonly` and optional flags count.
  - Types that resolve to `any`, `unknown` or `never` are skipped.
- **Known gap:** under `--cache`, the three typed rules can report stale results ([ESLint, command line interface][eslint-cache]):
  - The cache "does not track dependencies between files", and stale results include "type-aware rules".
- **Review:** a concept repeated across 2 or more files.

## Related

- [use-type-unless-extending.law.draft.md](use-type-unless-extending.law.draft.md): the named type is a `type`.
- [assert-only-what-the-checker-cannot-know.law.draft.md](assert-only-what-the-checker-cannot-know.law.draft.md): how a literal gets its type.
- [type-values-precisely.law.draft.md](type-values-precisely.law.draft.md): a value read through `any` that loses its existing type.
- [export-only-what-another-module-imports.law.draft.md](export-only-what-another-module-imports.law.draft.md): whether the named type is exported.
- [explain-every-disable.law.draft.md](explain-every-disable.law.draft.md): the disable a coincidental match takes.

[ts-type-aliases]: https://github.com/microsoft/TypeScript-Website/blob/70d14cd9d312d555876ced41c402dc529f4c526d/packages/documentation/copy/en/handbook-v2/Everyday%20Types.md?plain=1#L335
[ts-fewer-annotations]: https://github.com/microsoft/TypeScript-Website/blob/70d14cd9d312d555876ced41c402dc529f4c526d/packages/documentation/copy/en/handbook-v2/Everyday%20Types.md?plain=1#L86
[ts-excess]: https://github.com/microsoft/TypeScript-Website/blob/70d14cd9d312d555876ced41c402dc529f4c526d/packages/documentation/copy/en/handbook-v2/Object%20Types.md?plain=1#L369
[google-ts-structural]: https://github.com/google/styleguide/blob/dde305184e15530cfc321303522060b9883664ff/tsguide.html#L3032-L3034
[google-ts-call-site]: https://github.com/google/styleguide/blob/dde305184e15530cfc321303522060b9883664ff/tsguide.html#L3079-L3080
[google-ts-repetitive]: https://github.com/google/styleguide/blob/dde305184e15530cfc321303522060b9883664ff/tsguide.html#L3345-L3348
[google-ts-reviewer]: https://github.com/google/styleguide/blob/dde305184e15530cfc321303522060b9883664ff/tsguide.html#L2929
[eslint-cache]: https://github.com/eslint/eslint/blob/4637f9827a1ba137498eaee70957850621082815/docs/src/use/command-line-interface.md?plain=1#L715
