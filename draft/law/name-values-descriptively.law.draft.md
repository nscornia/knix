# Name values descriptively

A name says what the value represents.

## Rule

- Name every value for what it represents, with no ambiguous abbreviations.
- A single letter is allowed only where the letter is itself the convention: `i`/`j`/`k` loop indices, `x`/`y`/`z` coordinates, `a`/`b` in a comparator, and single upper-case type parameters.
- Everything else gets a word, however short its scope, callback parameters included (e.g. `events.map((event) => event.id)`, not `(e) => e.id`).
- **Unused values:**
  - Leave an unused value unbound where the language allows: omit the catch binding (`catch {}`), elide array elements (`[, second]`), drop trailing parameters, and rely on rest siblings (`const { id, ...rest } = obj`).
  - Where a binding is required, name it `_`, or `_` plus a descriptive name (`(_row, _column, value)`).
  - A `_`-prefixed parameter, caught error or array element is never read.
  - These take a descriptive name, never `_`:
    - parameters of method, call, construct and index signatures in a type or interface
    - parameters of function and constructor types
    - parameters of overload signatures, `declare` functions and methods, and abstract methods
    - setter parameters and parameter properties
  - `for (const _ of xs)` is not exempt.

## Why

Readers find defects faster in code whose names are words than in code whose names are arbitrary letters or abbreviations, so each value is named for what it represents. A few single letters are conventions readers already share — loop indices, coordinates, comparator operands, type parameters — and keep their meaning without a word. Published scope-length cutoffs disagree, so the rule keys on the convention, not on how many lines a name lives. A leading `_` on a parameter, caught error or array element tells both the reader and the checker that the value is deliberately unused.

- **Descriptive names:**
  - "Give as descriptive a name as possible, within reason." ([Google JavaScript style guide][google-js])
  - "Do not use abbreviations that are ambiguous or unfamiliar to readers outside your project, and do not abbreviate by deleting letters within a word."
  - "Avoid single letter names. Be descriptive with your naming." ([Airbnb JavaScript style guide][airbnb-naming])
- **Conventional letters:**
  - "Single-letter identifiers are acceptable as integer loop variables, particularly for indices (e.g., `i`) and coordinates (e.g., `x` and `y`)." ([Google Go style decisions][google-go])
  - Type parameters "may use a single upper case character (`T`) or `UpperCamelCase`" ([Google TypeScript style guide][google-ts]).
  - A sort comparator takes `a` and `b`: "remember that `(a, b) => a - b` sorts numbers in ascending order" ([MDN `sort`][mdn-sort]).
- **Unused values:**
  - "If you don't need the exception value, you can omit it along with the enclosing parentheses." ([MDN `try...catch`][mdn-try-catch])
  - Parameters "with names starting with an underscore (`_`) are exempt from the unused parameter checking" ([TypeScript `noUnusedParameters`][ts-unused-params]).
    - "TypeScript hardcodes its exemptions to names starting with `_`" ([typescript-eslint `no-unused-vars`][tse-no-unused-vars]).
    - ESLint's `no-unused-vars` uses `"^_"` for "variables whose names begin with an underscore" ([`argsIgnorePattern`][eslint-args-ignore]).
  - **Noted disagreement:** Google's TypeScript guide bans both forms ([Google TypeScript style guide][google-ts-underscore]).
    - "Identifiers must not use `_` as a prefix or suffix."
    - "`_` must not be used as an identifier by itself (e.g. to indicate a parameter is unused)."
  - **Other meanings of `_`:**
    - lodash's documented import is `var _ = require('lodash');` ([lodash README][lodash-readme]).
    - API Extractor requires `_` on `@internal` declarations: "The name ___ should be prefixed with an underscore" ([`ae-internal-missing-underscore`][api-extractor-underscore]).
    - Angular Material prefixes private fields: `private _elementRef = inject(...)` ([`ink-bar.ts`][material-ink-bar]).
    - Google's TypeScript guide forbids that: "Do not use trailing or leading underscores for private properties or methods" ([Google TypeScript style guide][google-ts-private-underscore]).
- **Comprehension:** in a study of 72 professional C# developers ([Hofmeister, Siegmund and Holt, 2017][hofmeister]):
  - "words lead to, on average, 19% faster comprehension speed compared to letters and abbreviations".
  - "we did not find a significant difference in speed between letters and abbreviations".
  - The authors note that "the use of the letter i as an index in a for-loop can be considered idiomatic".
  - The letter version did not follow that idiom: "identifiers were named alphabetically, in the order of occurrence".
- **Scope cutoffs, not adopted:**
  - Google's JavaScript and TypeScript guides allow short names for "Variables that are in scope for 10 lines or fewer" ([Google JavaScript style guide][google-js]).
  - Google's Go guide calls a small scope "say 1-7 lines" ([Google Go style decisions][google-go-scope]).
  - The Go linter varnamelen treats 5 lines as a small scope ([`defaultMaxDistance`][varnamelen]).

## Enforcement

- ESLint [`id-length`][id-length] at `error`: `{ min: 2, properties: 'never', exceptions: ['i','j','k','x','y','z','a','b','_'] }`.
  - It is off in ESLint's `recommended`, so it is enabled explicitly.
  - It flags `catch (e)` but never checks type parameters.
- typescript-eslint [`@typescript-eslint/naming-convention`][naming-convention] at `error`, on the `typeParameter` selector only, allowing one upper-case letter or `UpperCamelCase`.
  - `{ selector: 'typeParameter', format: null, custom: { regex: '^(?:[A-Z]|[A-Z][A-Za-z0-9]+)$', match: true } }`.
  - It misses an `infer` type parameter and a mapped-type key (probed).
- typescript-eslint [`@typescript-eslint/no-unused-vars`][tse-no-unused-vars] at `error` with `{ args: 'all', argsIgnorePattern: '^_', caughtErrors: 'all', caughtErrorsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_', ignoreRestSiblings: true, reportUsedIgnorePattern: true }`.
  - This is typescript-eslint's emulation of TypeScript's `_` exemption, without `varsIgnorePattern`.
  - [`reportUsedIgnorePattern`][eslint-report-used] reports a `_`-prefixed parameter, caught error or array element that is read.
    - It also reports a `_` name on each parameter the Rule's never-`_` list names, except an index-signature key (probed).
    - typescript-eslint marks those parameters used ([`collectUnusedVariables`][tse-collect-unused]), so the message reads "is marked as ignored but is used".
  - Without `varsIgnorePattern`, a module bound to `_`, such as lodash's, is not reported when read.
- `@knix-law/name-values-descriptively-restricted-syntax`, the plugin's copy of core `no-restricted-syntax`, at `error`, for what the rules above miss (probed):
  - **Parameters:**
    - `TSIndexSignature > Identifier.parameters[name=/^_/]`: a `_` index-signature key.
    - `TSIndexSignature > Identifier.parameters[name.length=1]:not([name=/^[ijkxyzab_]$/])`: a single-letter index-signature key.
    - `:matches(TSMethodSignature, TSCallSignatureDeclaration, TSConstructSignatureDeclaration, TSFunctionType, TSConstructorType, TSDeclareFunction, TSEmptyBodyFunctionExpression) > Identifier.params[name.length=1]:not([name=/^[ijkxyzab_]$/])`: a single-letter signature parameter, which `id-length` skips except as a rest parameter.
    - `TSParameterProperty > Identifier.parameter[name.length=1]:not([name=/^[ijkxyzab_]$/])`: a single-letter parameter property, which `id-length` skips unless it has a default.
  - **Type parameters and destructuring:**
    - `TSMappedType > Identifier.key:not([name=/^(?:[A-Z]|[A-Z][A-Za-z0-9]+)$/])`: a mapped-type key that is not one upper-case letter or `UpperCamelCase`.
    - `TSInferType > TSTypeParameter > Identifier.name:not([name=/^(?:[A-Z]|[A-Z][A-Za-z0-9]+)$/])`: the same for an `infer` type parameter.
    - `ObjectPattern > Property[shorthand=true] > Identifier.value[name.length=1]:not([name=/^[ijkxyzab_]$/])`: a single-letter shorthand destructured name, which `id-length` skips under `properties: 'never'`.
- Review checks that each allowed letter is used for its convention (`i`/`j`/`k` as loop indices, `a`/`b` in a comparator, and so on). No rule sees meaning.
- Angular template aliases (`let i = $index`) are review-only.
- With unicorn's `recommended`, turn off its `i` and `j` replacements, which rename both to `index` ([`name-replacements`][unicorn-name-replacements]).
  - `replacements: { i: false, j: false }`.

[google-js]: https://github.com/google/styleguide/blob/dde305184e15530cfc321303522060b9883664ff/jsguide.md#61-rules-common-to-all-identifiers
[google-ts]: https://github.com/google/styleguide/blob/dde305184e15530cfc321303522060b9883664ff/tsguide.html#L2780
[google-go]: https://github.com/google/styleguide/blob/dde305184e15530cfc321303522060b9883664ff/go/decisions.md#single-letter-variable-names
[airbnb-naming]: https://github.com/airbnb/javascript/blob/8ed19247bef145e3cc41b24a02dd1fe6d9b5e681/README.md#naming--descriptive
[mdn-sort]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
[ts-unused-params]: https://www.typescriptlang.org/tsconfig/#noUnusedParameters
[eslint-args-ignore]: https://eslint.org/docs/latest/rules/no-unused-vars#argsignorepattern
[id-length]: https://eslint.org/docs/latest/rules/id-length
[naming-convention]: https://typescript-eslint.io/rules/naming-convention/
[unicorn-name-replacements]: https://github.com/sindresorhus/eslint-plugin-unicorn/blob/a6c2fdf97bd9a37687f31fb3807d23323d877bd8/docs/rules/name-replacements.md
[mdn-try-catch]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
[tse-no-unused-vars]: https://typescript-eslint.io/rules/no-unused-vars/
[eslint-report-used]: https://eslint.org/docs/latest/rules/no-unused-vars#reportusedignorepattern
[tse-collect-unused]: https://github.com/typescript-eslint/typescript-eslint/blob/4ad6b7553781fa3c93fc26642d7219d2e6624504/packages/eslint-plugin/src/util/collectUnusedVariables.ts#L346-L376
[google-ts-underscore]: https://github.com/google/styleguide/blob/dde305184e15530cfc321303522060b9883664ff/tsguide.html#L2792
[hofmeister]: https://www.se.cs.uni-saarland.de/publications/docs/HoSeHo17.pdf
[google-go-scope]: https://github.com/google/styleguide/blob/dde305184e15530cfc321303522060b9883664ff/go/decisions.md#variable-names
[varnamelen]: https://github.com/blizzy78/varnamelen/blob/a11a91e5dd206ae1ae00e871116dc05b1bca0eec/varnamelen.go#L96-L98
[lodash-readme]: https://github.com/lodash/lodash/blob/2b5e6f7399a7b48005140b5d5c6bc6c0e62919a8/README.md?plain=1#L50
[api-extractor-underscore]: https://github.com/microsoft/rushstack/blob/e5360c7576184d5d54eabd2a0b27555fcb938996/apps/api-extractor/src/api/ExtractorMessageId.ts#L64-L67
[material-ink-bar]: https://github.com/angular/components/blob/952685f9370ba718f832d745512db7c9a04e1bcd/src/material/tabs/ink-bar.ts#L77
[google-ts-private-underscore]: https://github.com/google/styleguide/blob/dde305184e15530cfc321303522060b9883664ff/tsguide.html#L2660
