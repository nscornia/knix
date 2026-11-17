# Reuse existing utilities

Reach for the designated utility before writing your own.

## Rule

- Use the designated utility for a job; never write a parallel implementation.
- A utility is designated when the codebase names it for the job, in its docs, a lint message or an import ban.
  - It may live in the codebase's own source or in an installed shared package.
- Callers use a designated wrapper, never the library it wraps.
- **Optional fields:** Build an object with optional fields by assigning each field, then remove absent entries in one call to the designated helper, picking the helper whose definition of empty matches the fields.
- **Type aliases:** Where the codebase designates a type alias for a type form, write the alias, never the spelled-out form.
  - Replace a form only where the alias resolves to the same type there.
- **[Test files](README.md#test-files):** A fixture repeated across test cases comes from one factory function that returns a new object per call, or the cases run as a parameterized table.

## Examples

**Optional fields**, incorrect: each field is guarded by hand, and `_.isEmpty` treats every number as empty, so `page` is always dropped.

```ts
const query: Query = {};
if (search !== undefined) query.search = search;
const filters = _.omitBy({ page, active }, _.isEmpty);
```

Correct: one call to the helper whose definition of empty is `undefined`.

```ts
import { dropUndefined } from '@acme/objects';

const query = dropUndefined({ search, page, active });
```

## Why

Cross-cutting concerns such as dates, URLs and empty values carry requirements that are easy to miss, and each hand-written copy can miss a different one. A shared implementation gets them right once, is fixed in one place, and behaves the same everywhere.

- **Dates:**
  - With no offset, "date-only forms are interpreted as a UTC time and date-time forms are interpreted as a local time" ([ECMA-262 `Date.parse`][ecma-date-offset]).
  - Any other format may fall back to "implementation-specific heuristics" ([ECMA-262 `Date.parse`][ecma-date-heuristics]).
  - `toLocaleTimeString` formats "in the local timezone" ([MDN `toLocaleTimeString`][to-locale-time]).
    - Without a locale, "The runtime's default locale is used" ([MDN `Intl.DateTimeFormat`][date-time-format]).
- **URLs:**
  - `encodeURI` encodes fewer characters than `encodeURIComponent`, "preserving those that are part of the URI syntax" ([MDN `encodeURI`][encode-uri]).
  - RFC 3986 "reserves `!`, `'`, `(`, `)`, and `*`", which `encodeURIComponent` leaves unencoded ([MDN `encodeURIComponent`][encode-uri-component]).
- **Empty values:**
  - `??` "returns its right-hand side operand when its left-hand side operand is `null` or `undefined`" ([MDN `??`][nullish-coalescing]).
  - Lodash's falsey values are "`false`, `null`, `0`, `""`, `undefined`, and `NaN`" ([lodash `compact`][lodash-compact]).
  - `_.isEmpty(true)` and `_.isEmpty(1)` are both `true` ([lodash `isEmpty`][lodash-is-empty]).
- **Principle:** "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system." ([The Pragmatic Programmer, tips][pragprog-tips])
- **Where shared code lives:** "Does this change belong in your codebase, or in a library?" ([Google code review guide][google-design])
- **Duplication first:**
  - "Encourage developers to solve the problem they know needs to be solved *now*" ([Google code review guide][google-over-engineering]).
  - "prefer duplication over the wrong abstraction" ([Sandi Metz][wrong-abstraction]).

## Exceptions

- The utility's own implementation: each banned use in its source is marked by a described disable.
- Code written before any utility is designated for the job. Nothing marks it: no ban exists yet.
  - Designate a utility once the shared need is proven, then move the copies onto it.
- A case the utility cannot express. Never bypass the utility:
  - **Same job:** extend the utility.
  - **Different job:** split or reshape the utility rather than adding a flag.
    - Shared code grown by "passing parameters and adding conditional paths through shared code" becomes "the wrong abstraction" ([Sandi Metz][wrong-abstraction]).

## Enforcement

- Each repository lists what its designated utilities replace, each with a message naming the utility.
- **Imports:** `@knix-law/reuse-existing-utilities-restricted-imports`, the plugin's copy of core [`no-restricted-imports`][no-restricted-imports], at `error`, banning a wrapped library outside its wrapper:
  - `{ paths: [{ name: '<library>', message: 'Use <utility> from <package>.', allowTypeImports: true }], patterns: [{ group: ['<library>/*'], message: 'Use <utility> from <package>.' }] }`.
  - A pattern with `allowImportNames` bans a library's other exports, default import included; `importNames` on a path misses the default (probed).
  - It also reports `import x = require('<library>')` (probed).
- **Dynamic loads:** `@knix-law/reuse-existing-utilities-restricted-syntax`, the plugin's copy of core [`no-restricted-syntax`][no-restricted-syntax], at `error`, for what `no-restricted-imports` does not cover (probed):
  - `ImportExpression[source.value=/^<library>(\/|$)/]`.
  - `CallExpression[callee.name='require'][arguments.0.value=/^<library>(\/|$)/]`.
  - `TSImportType[argument.literal.value=/^<library>(\/|$)/]`.
  - `CallExpression[callee.property.name='toLocaleTimeString'][arguments.length=0]`, for a time formatted without a locale.
- **Built-ins:** at `error`, each the plugin's copy of a core rule, listing the built-ins a utility replaces:
  - `@knix-law/reuse-existing-utilities-restricted-globals`, from core [`no-restricted-globals`][no-restricted-globals]: `{ globals: [{ name: 'encodeURI', message: 'Use <utility>.' }], checkGlobalObject: true, globalObjects: ['window', 'self', 'global'] }`.
    - `checkGlobalObject` also reports `globalThis.encodeURI`; `window` and `self` forms are reported only where those globals are declared (probed).
  - `@knix-law/reuse-existing-utilities-restricted-properties`, from core [`no-restricted-properties`][no-restricted-properties]: `[{ object: 'Date', property: 'parse', message: 'Use <utility>.' }]`, which also reports `const { parse } = Date` (probed).
- **Type aliases:** `@knix-law/reuse-existing-utilities-type-alias` at `error`: `{ aliases: [{ name: '<alias>', from: '<module>' }] }`.
  - It is a typed rule. It reports a spelled-out form that matches a listed alias's body, with the alias's type parameters as holes.
    - A conditional alias also matches each of its branches; only the outermost match is reported.
    - A union body with one bare type parameter also matches a wider union, binding the extra members to it (probed).
  - It reports only where the form and the alias, applied to the matched arguments, are assignable both ways (probed).
    - This leaves out a wider alias, such as `Nullable<T>` for `T | null`, and a conditional alias in a generic body.
  - Its suggestion writes the alias and imports it (probed).
- **Configuration:**
  - **Per-law rules:** a later config entry for a core rule replaces an earlier one's list (probed).
    - Each law configures its own copy, so no other law's entry replaces this one.
  - **Wrapper source:** each described disable names the rule it turns off, such as `@knix-law/reuse-existing-utilities-restricted-imports`.
- **Known gaps (probed):**
  - A call through a local alias (`const enc = encodeURI; enc(s)`) is reported only at the assignment.
  - A global object reached through a variable (`const g = globalThis; g.encodeURI(s)`) is not reported.
  - A renamed or reimplemented duplicate is not reported.
- Review checks for parallel implementations the lists do not name, and for a fixture repeated across test cases.

## Related

- [Build versus buy, in order](build-vs-buy-order.law.draft.md) governs a job with no designated utility; a designation outranks its order.
- [Explain every disable](explain-every-disable.law.draft.md) governs the disable each banned use in the utility's own implementation takes.
- [Use the design system](use-the-design-system.law.draft.md) applies the same principle to UI components.

[ecma-date-offset]: https://github.com/tc39/ecma262/blob/40ce6f206b5669e69bf010a38267ae24a2843404/spec.html#L35043
[ecma-date-heuristics]: https://github.com/tc39/ecma262/blob/40ce6f206b5669e69bf010a38267ae24a2843404/spec.html#L35042
[to-locale-time]: https://github.com/mdn/content/blob/02f40534e1bbe121c49f8c045c5a16120f0b02f7/files/en-us/web/javascript/reference/global_objects/date/tolocaletimestring/index.md?plain=1#L10
[date-time-format]: https://github.com/mdn/content/blob/02f40534e1bbe121c49f8c045c5a16120f0b02f7/files/en-us/web/javascript/reference/global_objects/intl/datetimeformat/datetimeformat/index.md?plain=1#L55
[encode-uri]: https://github.com/mdn/content/blob/02f40534e1bbe121c49f8c045c5a16120f0b02f7/files/en-us/web/javascript/reference/global_objects/encodeuri/index.md?plain=1#L9
[encode-uri-component]: https://github.com/mdn/content/blob/02f40534e1bbe121c49f8c045c5a16120f0b02f7/files/en-us/web/javascript/reference/global_objects/encodeuricomponent/index.md?plain=1#L93
[nullish-coalescing]: https://github.com/mdn/content/blob/02f40534e1bbe121c49f8c045c5a16120f0b02f7/files/en-us/web/javascript/reference/operators/nullish_coalescing/index.md?plain=1#L10-L11
[lodash-compact]: https://github.com/lodash/lodash/blob/f299b52f39486275a9e6483b60a410e06520c538/lodash.js#L6924-L6925
[lodash-is-empty]: https://github.com/lodash/lodash/blob/f299b52f39486275a9e6483b60a410e06520c538/lodash.js#L11535-L11539
[pragprog-tips]: https://pragprog.com/tips/
[google-design]: https://github.com/google/eng-practices/blob/3bb3ec25b3b0199f4940b1aa75f0ac5c5753301c/review/reviewer/looking-for.md?plain=1#L12-L14
[google-over-engineering]: https://github.com/google/eng-practices/blob/3bb3ec25b3b0199f4940b1aa75f0ac5c5753301c/review/reviewer/looking-for.md?plain=1#L54-L61
[wrong-abstraction]: https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction
[no-restricted-imports]: https://github.com/eslint/eslint/blob/4637f9827a1ba137498eaee70957850621082815/docs/src/rules/no-restricted-imports.md
[no-restricted-syntax]: https://github.com/eslint/eslint/blob/4637f9827a1ba137498eaee70957850621082815/docs/src/rules/no-restricted-syntax.md
[no-restricted-globals]: https://github.com/eslint/eslint/blob/4637f9827a1ba137498eaee70957850621082815/docs/src/rules/no-restricted-globals.md
[no-restricted-properties]: https://github.com/eslint/eslint/blob/4637f9827a1ba137498eaee70957850621082815/docs/src/rules/no-restricted-properties.md
