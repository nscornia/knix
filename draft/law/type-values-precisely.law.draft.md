# Type values precisely

Every value carries a type the compiler checks.

## Rule

- Use no `any`, `@ts-ignore` or `@ts-nocheck`. Give the value a precise type, a generic, or `unknown` narrowed before use.
- Type an `any` a library returns as `unknown` where it enters the code, then validate it.
- Test for `null` or `undefined` only where the type allows it. A value typed non-nullable takes no defensive check. Data from outside the program (an HTTP response, parsed JSON, storage, a third-party callback) is validated once where it enters, then trusted by its type. A value its type can't vouch for, because nothing validated it or it can still be `null` or `undefined` at runtime, is typed to include them (`T | null | undefined`) wherever it passes, so the check it needs is one the type allows.
- Exported signatures carry no `any`.
- **[Test files](README.md#test-files)** get no relaxation.
  - Test doubles are typed as the **Test files** rule of [Assert only what the checker cannot know](assert-only-what-the-checker-cannot-know.law.draft.md#rule) requires.
  - A matcher that returns `any` is library `any`, typed `unknown` at the boundary like any other library `any`.

## Why

`any` turns off type checking for the value and for every part of the program that uses it, so a typo, a wrong property or a changed API compiles and fails only at runtime. A precise type, or `unknown` narrowed before use, keeps the compiler checking. `any` also arrives without being written, from library return types and suppression comments, so the rule covers those too.

- **`any` turns checking off:**
  - The compiler treats `any` as "please turn off type checking for this thing" ([TypeScript, Do's and Don'ts][ts-dos]).
    - "It is similar to putting an `@ts-ignore` comment around every usage of the variable."
    - "you are disabling type checking for any parts of your program that use it".
  - With `$any()`, "typos, incorrect property access, and invalid method calls won't be caught until runtime" ([`no-any`][ng-no-any]).
  - typescript-eslint calls it a dangerous "escape hatch" from the type system ([`no-explicit-any`][no-explicit-any]).
  - `--noImplicitAny` "doesn't prevent `any` from being explicitly used".
- **`unknown` instead:** use it "when you want to accept anything" ([TypeScript, Do's and Don'ts][ts-dos]).
- **Library returns:**
  - `any` "can sometimes leak into your codebase", "particularly if it leaks in from an external library" ([`no-unsafe-assignment`][no-unsafe-assignment]).
  - The standard library's `JSON.parse` returns `any` ([`lib.es5.d.ts`][ts-lib-es5]), and `Response.json()` returns `Promise<any>` ([`lib.dom.d.ts`][ts-lib-dom]).
- **Test matchers:**
  - Vitest types `expect.anything()`, `expect.any()` and `expect.objectContaining()` as returning `any` ([`@vitest/expect` 4.1.10][vitest-expect-types]).
  - Jasmine's `any()` and `anything()` return `AsymmetricMatcher<any>` ([`@types/jasmine` 5.1.15][jasmine-types]).
- **Correlational evidence** from 604 GitHub projects ([Bogner and Merkel, 2022][bogner-merkel]):
  - "reducing the usage of the `any` type in TS apps was significantly correlated with all metrics except bug proneness".
  - The metrics: code smells and cognitive complexity per line of code, and bug resolution time.
- **Suppression comments:** `@ts-ignore` and `@ts-nocheck` "are reported" by default ([`ban-ts-comment`][ban-ts-comment]).
  - `@ts-expect-error` "is allowed when it includes a description".

## Exceptions

- Exceptions are typescript-eslint's three cases only (incomplete onboarding, an untyped external package, types not yet representable), each disabled on its own line with a reason, never file-wide.
  - typescript-eslint lists them as "occasional situations where it can be necessary to use `any`" ([`no-explicit-any`][no-explicit-any]).

## Narrowings

- **Angular:**
  - Templates use no `$any()`, under the same exception rules: typescript-eslint's three cases only, each disabled on its own line with a reason, never file-wide.
    - `$any` "nullifies the compile-time benefits of Angular's type system" ([`no-any`][ng-no-any]).
  - Enforced by `@angular-eslint/template/no-any` at `error`.
    - Only the `template-all` preset sets it, not `template-recommended`, so it is enabled explicitly.
    - It offers a suggestion, not an autofix.

## Enforcement

- `@typescript-eslint/no-explicit-any` and `@typescript-eslint/ban-ts-comment` at `error`, with typescript-eslint `recommended`'s defaults ([shared configs][tse-configs]).
- The `no-unsafe-*` family from `recommended-type-checked` (type-aware), which catches `any` arriving from libraries.
- `@typescript-eslint/use-unknown-in-catch-callback-variable`, so Promise `.catch` callbacks take `unknown` ([rule docs][use-unknown-catch]).
  - Only `strict-type-checked` includes it, so it is enabled explicitly.
  - `useUnknownInCatchVariables` covers `try`/`catch` only; a `.catch` callback's variable "will always have the type `any`".
- No ESLint [bulk suppressions][eslint-suppressions] file.

## Related

- [Explain every disable](explain-every-disable.law.draft.md) owns the checks that each disable under Exceptions and Narrowings names its rules and says why.
- [Assert only what the checker cannot know](assert-only-what-the-checker-cannot-know.law.draft.md) owns `strict: true`, which keeps `null` and `undefined` out of a type that doesn't name them.
- [Unwrap responses where they are fetched](unwrap-responses-where-they-are-fetched.law.draft.md) reshapes a response once, in the method that fetches it.
- [Test for a missing value with `== null`](test-for-missing-with-loose-null.law.draft.md) says how to spell a test for `null` or `undefined`.

[ts-dos]: https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html
[no-explicit-any]: https://typescript-eslint.io/rules/no-explicit-any/
[no-unsafe-assignment]: https://typescript-eslint.io/rules/no-unsafe-assignment/
[ban-ts-comment]: https://typescript-eslint.io/rules/ban-ts-comment/
[tse-configs]: https://typescript-eslint.io/users/configs/
[use-unknown-catch]: https://typescript-eslint.io/rules/use-unknown-in-catch-callback-variable/
[eslint-suppressions]: https://eslint.org/docs/latest/use/suppressions
[ng-no-any]: https://github.com/angular-eslint/angular-eslint/blob/3c302cdc266ad5564b2c95e95175751380c9e512/packages/eslint-plugin-template/docs/rules/no-any.md
[vitest-expect-types]: https://unpkg.com/@vitest/expect@4.1.10/dist/index.d.ts
[jasmine-types]: https://unpkg.com/@types/jasmine@5.1.15/index.d.ts
[bogner-merkel]: https://arxiv.org/abs/2203.11115
[ts-lib-es5]: https://github.com/microsoft/TypeScript/blob/050880ce59e30b356b686bd3144efe24f875ebc8/src/lib/es5.d.ts#L1145
[ts-lib-dom]: https://github.com/microsoft/TypeScript/blob/050880ce59e30b356b686bd3144efe24f875ebc8/src/lib/dom.generated.d.ts#L5111
