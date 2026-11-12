# Assert only what the checker cannot know

A type assertion is never checked at runtime, so it states only what the compiler cannot work out.

## Rule

- Remove an assertion that does not change the type.
- Type a literal by annotating its target (`const x: T = …`, `Record<K, T>`) or with `satisfies`, never `as`.
- Narrow with a runtime check (type guard, `instanceof`, `in`) or fix the upstream type, never with an assertion.
- A type guard (`x is T`) returns `true` exactly when `x` is a `T`, and `false` exactly when it is not, since TypeScript checks neither. Where a check can't be exact both ways, return `boolean`, or leave the return type off so TypeScript infers a predicate only when it is exact.
- Where an assertion is still needed, a comment says why it is safe. A double assertion goes through `unknown`, never `any`.
- Set `strict: true` explicitly, and set no strict-family flag to `false`.
- `as const` is exempt.
- **Test files:**
  - Prefer the real implementation, then a fake the owning library ships, then a stub.
  - A stub types every member it supplies, then may be asserted to `T` once, with no comment.
    - It is typed with `Partial<T>`, `PartialDeep<T>` for nested shapes, or a typed helper such as `createSpyObj<T>` or `vi.fn<T>()`.
  - Never a double assertion (`as unknown as`, `as never as`) in tests.
  - A stub repeated across files moves into one shared typed factory holding its one commented assertion.

## Why

A type assertion is a claim the compiler takes on trust and the runtime never checks, so a wrong one hides an error instead of reporting it. An annotation, `satisfies` or a runtime check can prove what the assertion only claims, and an assertion that seems needed often means a type earlier in the chain is wrong. The `!` operator and definite assignment are assertions too, and banning them holds only while `strictPropertyInitialization` stops a bare field from making the same claim unchecked.

- **Assertions are unchecked:**
  - Type and non-null assertions "only silence the TypeScript compiler, but do not insert any runtime checks to match these assertions" ([Google TypeScript style guide][google-ts-assertions]).
  - "Because type assertions are removed at compile-time, there is no runtime checking associated with a type assertion." ([TypeScript handbook][ts-assertions])
  - `!` "is effectively a type assertion that the value isn't `null` or `undefined`" ([TypeScript handbook][ts-non-null]).
  - A definite assignment `!` tells TypeScript a variable "is indeed assigned", "even if TypeScript's analyses cannot detect so" ([TypeScript 2.7][ts-definite]).
  - A `declare` modifier marks "that a property should have no emit" ([TypeScript 3.7][ts-declare]).
- **Compiler prerequisite:**
  - With `strictPropertyInitialization`, "TypeScript will raise an error when a class property was declared but not set in the constructor" ([TSConfig reference][ts-spi]).
  - "`strict` is now `true` by default" ([TypeScript 6.0][ts-strict-default]).
  - Under `strict`, "You can then turn off individual strict mode family checks as needed." ([TSConfig reference][ts-strict])
  - "Turning on `noUncheckedIndexedAccess` will add `undefined` to any un-declared field in the type." ([TSConfig reference][ts-nuia])
- **Unneeded assertions:** "it's generally best practice to remove them if they don't change the type of an expression" ([`no-unnecessary-type-assertion`][no-unnecessary-type-assertion]).
- **Literals:**
  - "Use type annotations (`: Foo`) instead of type assertions (`as Foo`) to specify the type of an object literal." ([Google TypeScript style guide][google-ts-literals])
  - An object-literal assertion "is either unnecessary or will probably hide an error" ([`consistent-type-assertions`][consistent-type-assertions]).
    - "`const x: { foo: number } = {};` will fail to compile, but `const x = {} as { foo: number }` will succeed."
  - `satisfies` validates "that the type of an expression matches some type, without changing the resulting type of that expression" ([TypeScript 4.9][ts-satisfies]).
  - `as const`: const assertions "are always allowed" by [`consistent-type-assertions`][consistent-type-assertions], which calls them "beneficial".
  - **Not adopted:** "There is no need to use an explicit `:` type annotation" on a literal-initialized variable ([`no-inferrable-types`][no-inferrable-types]).
    - The annotation is how this law types a literal, so the rule is off.
- **Narrowing:**
  - "the best answer is to explicitly write a runtime check that performs that check" ([Google TypeScript style guide][google-ts-assertions]).
  - "Instead of using type assertions to narrow a type, it's better to rely on type guards" ([`no-unsafe-type-assertion`][no-unsafe-type-assertion]).
- **Needed assertions:**
  - Where an assertion is locally safe, "you *should* add clarification to explain why you are ok with the unsafe behavior" ([Google TypeScript style guide][google-ts-assertions]).
  - "Use `unknown` (instead of `any` or `{}`) as the intermediate type." ([Google TypeScript style guide][google-ts-double])
  - A typescript-eslint maintainer: "the correct thing for users to do is provide an explicit comment indicating they know the risk" ([#11680][tse-11680]).
  - "`eslint-disable` directive-comments disable all rules by default." ([`no-unlimited-disable`][no-unlimited-disable])
  - **Not adopted:** "`!` non-null assertions are generally preferred for requiring less code" ([`non-nullable-type-assertion-style`][non-nullable-type-assertion-style]).
    - This law bans `!`, so the rule is off.
- **Test doubles:**
  - "Test Double is a generic term for any case where you replace a production object for testing purposes." ([Fowler][fowler-test-double])
  - Real first: "our first choice for tests is to use the real implementations of the system under test's dependencies" ([Software Engineering at Google][swe-real]).
  - Then a fake: "the best option is often to use a fake in its place" ([Software Engineering at Google][swe-fake]).
  - Stubs last: real implementations or fakes "give you more guarantees about the correctness of the code compared to stubbing" ([Software Engineering at Google][swe-stub]).
    - "A test that requires many functions to be stubbed can be a sign that stubbing is being overused".
  - "By default, `TestBed` provides the real implementations of these dependencies" ([Angular, testing services][ng-testing-services]).
    - Its stub is typed `Mocked<TaxCalculator>`, with `vi.fn()` per method.
- **Typed stubs:**
  - `PartialDeep` is for "Mocking and testing complex entities, where populating an entire object with its keys would be redundant" ([type-fest `PartialDeep`][type-fest-partial-deep]).
    - "Use `Partial<T>` if you only need one level deep."
  - Jasmine's `createSpyObj<T>` returns `SpyObj<T>`, which is `T` with a spy on each method ([`@types/jasmine`][jasmine-spy-obj]).
  - **Partly adopted:** for stub-heavy tests, the rule docs advise "Consider disabling the rule for such files" ([`no-unsafe-type-assertion`][no-unsafe-type-assertion-when-not]).
    - Test files turn it off, but still require typed stubs and ban double assertions.

## Narrowings

- **Angular:**
  - Use `input.required()`, `viewChild.required()` and `contentChild.required()` in place of definite fields with decorators.
    - A required input left unset fails the build: "Angular reports an error at build-time" ([Angular, required inputs][ng-required-inputs]).
    - "If a required query does not find a matching result, Angular reports an error" ([Angular, required queries][ng-required-queries]).
  - Enforced by [`@angular-eslint/prefer-signals`][ng-prefer-signals] at `error` with its defaults: "Use readonly signals instead of `@Input()`, `@ViewChild()` and other legacy decorators".
    - It is not in angular-eslint's `recommended`, so it is enabled explicitly.
    - Its defaults are `{ preferReadonlySignalProperties: true, preferInputSignals: true, preferQuerySignals: true, useTypeChecking: false, additionalSignalCreationFunctions: [] }` ([source][ng-prefer-signals-defaults]).
    - The `readonly` default follows [Angular's style guide][ng-style-readonly]: "Mark component and directive properties initialized by Angular as `readonly`."
    - The guide's list: "properties initialized by `input`, `model`, `output`, and queries".
    - It also asks `readonly` of `computed`, `linkedSignal`, `signal` and `toSignal` fields, beyond the style guide's list ([source][ng-prefer-signals-functions]).
  - Never set `angularCompilerOptions.strictTemplates` to `false`.
    - Strict template checking "is the default, and is enabled when the `strictTemplates` flag is `true` or not set" ([Angular, template type checking][ng-strict-templates]).
    - Without it, Angular "doesn't check embedded views, such as `@if`, `@for`, `*ngIf`, `*ngFor`" ([Angular, template type checking][ng-basic-templates]).

## Enforcement

- **Compiler:**
  - `tsconfig.json`: `strict: true`, set explicitly, with no strict-family flag set to `false`.
    - Turning off `strictNullChecks` also turns off `strictPropertyInitialization`, with no error (probed on tsc 6.0.3).
  - Planned, not yet built: `@knix-law/strict-compiler-options` at `error` (type-aware) reads each file's effective compiler options, so an override anywhere in an `extends` chain is reported.
  - `noUncheckedIndexedAccess: true` is recommended, not required; indexed access then needs a guard, since `!` and `as` are banned.
- **Assertions:**
  - [`@typescript-eslint/no-unnecessary-type-assertion`][no-unnecessary-type-assertion] at `error` (type-aware).
  - [`@typescript-eslint/consistent-type-assertions`][consistent-type-assertions] at `error`: `{ assertionStyle: 'as', objectLiteralTypeAssertions: 'never', arrayLiteralTypeAssertions: 'never' }`.
    - `assertionStyle: 'as'` goes beyond the Rule: "Type assertions *must* use the `as` syntax" ([Google TypeScript style guide][google-ts-as-syntax]).
  - [`@typescript-eslint/no-unsafe-type-assertion`][no-unsafe-type-assertion] at `error`.
    - A needed assertion carries its comment as a described disable: `// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- <why it is safe>`.
  - [`@typescript-eslint/no-non-null-assertion`][no-non-null-assertion] at `error`.
    - It is in typescript-eslint's `strict` preset, not `recommended`, so it is enabled explicitly.
    - A needed `!` takes a described disable naming every rule that reports it.
- **Preset overrides,** where typescript-eslint's `stylistic-type-checked` is spread:
  - [`@typescript-eslint/non-nullable-type-assertion-style`][non-nullable-type-assertion-style] off: its fix turns `x as T` into a banned `x!`.
  - [`@typescript-eslint/no-inferrable-types`][no-inferrable-types] off: it removes the annotation the Rule prescribes for a literal.
- `@knix-law/assert-only-what-the-checker-cannot-know-restricted-syntax`, the plugin's copy of core `no-restricted-syntax`, at `error`, with five selectors:
  - A literal asserted to a type, which no published rule catches, including unary literals and `undefined`: `TSAsExpression:not([typeAnnotation.typeName.name="const"]):matches([expression.type="Literal"], [expression.type="UnaryExpression"][expression.argument.type="Literal"], [expression.type="Identifier"][expression.name="undefined"])`.
    - Template literals (`` `a${1}` as string ``) are not `Literal` nodes, so they pass.
  - A new instance asserted instead of given type arguments (`new Map() as Map<K, V>`): `TSAsExpression > NewExpression.expression:not([typeArguments])`.
    - `no-unsafe-type-assertion` misses it, because the inferred `any` type arguments assign to anything (probed).
  - A definite field (`value!: string`): `PropertyDefinition[definite=true]`.
  - A definite variable (`let late!: string`): `VariableDeclarator[definite=true]`.
  - A `declare` field (`declare value: string`): `PropertyDefinition[declare=true]`.
    - A needed one takes a described disable: `// eslint-disable-next-line @knix-law/assert-only-what-the-checker-cannot-know-restricted-syntax -- <why it is safe>`.
- **Test files:**
  - `@typescript-eslint/no-unsafe-type-assertion` is off, so a typed stub is asserted to `T` once without a disable.
  - The law's restricted-syntax rule adds two selectors for a double assertion through any type:
    - `TSAsExpression > TSAsExpression.expression`.
    - `TSAsExpression > TSSatisfiesExpression.expression > TSAsExpression.expression`, for `x as unknown satisfies unknown as T`.
  - A test-file entry for that rule replaces the base one, so it lists all seven selectors.
- Review checks:
  - The real, fake, stub order and the shared factory.
  - Any narrowing in tests other than a typed stub.
  - That no Angular config sets `strictTemplates: false`.

## Related

- [Type values precisely](type-values-precisely.law.draft.md) owns `no-explicit-any`, `ban-ts-comment` and the `no-unsafe-*` family, which stop `any` and `@ts-ignore` from standing in for an assertion.
- [Explain every disable](explain-every-disable.law.draft.md) owns the checks that each described disable names its rules and says why.

[google-ts-assertions]: https://github.com/google/styleguide/blob/dde305184e15530cfc321303522060b9883664ff/tsguide.html#L2341-L2380
[google-ts-double]: https://github.com/google/styleguide/blob/dde305184e15530cfc321303522060b9883664ff/tsguide.html#L2415
[google-ts-as-syntax]: https://github.com/google/styleguide/blob/dde305184e15530cfc321303522060b9883664ff/tsguide.html#L2388
[google-ts-literals]: https://github.com/google/styleguide/blob/dde305184e15530cfc321303522060b9883664ff/tsguide.html#L2419-L2421
[ts-assertions]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions
[ts-definite]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#definite-assignment-assertions
[ts-declare]: https://github.com/microsoft/TypeScript-Website/blob/70d14cd9d312d555876ced41c402dc529f4c526d/packages/documentation/copy/en/release-notes/TypeScript%203.7.md?plain=1#L666
[ts-spi]: https://github.com/microsoft/TypeScript-Website/blob/70d14cd9d312d555876ced41c402dc529f4c526d/packages/tsconfig-reference/copy/en/options/strictPropertyInitialization.md?plain=1#L6
[ts-strict]: https://github.com/microsoft/TypeScript-Website/blob/70d14cd9d312d555876ced41c402dc529f4c526d/packages/tsconfig-reference/copy/en/options/strict.md?plain=1#L8
[ts-nuia]: https://github.com/microsoft/TypeScript-Website/blob/70d14cd9d312d555876ced41c402dc529f4c526d/packages/tsconfig-reference/copy/en/options/noUncheckedIndexedAccess.md?plain=1#L30
[no-inferrable-types]: https://github.com/typescript-eslint/typescript-eslint/blob/93a92689c215816c7e0dc011cfdd0634b3dd8edc/packages/eslint-plugin/docs/rules/no-inferrable-types.mdx?plain=1#L12-L13
[non-nullable-type-assertion-style]: https://github.com/typescript-eslint/typescript-eslint/blob/93a92689c215816c7e0dc011cfdd0634b3dd8edc/packages/eslint-plugin/docs/rules/non-nullable-type-assertion-style.mdx?plain=1#L17
[no-unlimited-disable]: https://github.com/eslint-community/eslint-plugin-eslint-comments/blob/de11b0e6db111ca9b605661f38521777e99d52bd/docs/rules/no-unlimited-disable.md?plain=1#L7
[ng-strict-templates]: https://github.com/angular/angular/blob/99fd45a09d4a8a8996d2801a0d01d82153aeb431/adev/src/content/tools/cli/template-typecheck.md?plain=1#L30
[ng-basic-templates]: https://github.com/angular/angular/blob/99fd45a09d4a8a8996d2801a0d01d82153aeb431/adev/src/content/tools/cli/template-typecheck.md?plain=1#L23
[ts-strict-default]: https://github.com/microsoft/TypeScript-Website/blob/70d14cd9d312d555876ced41c402dc529f4c526d/packages/documentation/copy/en/release-notes/TypeScript%206.0.md?plain=1#L417
[ng-style-readonly]: https://github.com/angular/angular/blob/99fd45a09d4a8a8996d2801a0d01d82153aeb431/adev/src/content/best-practices/style-guide.md?plain=1#L194-L195
[ng-prefer-signals-defaults]: https://github.com/angular-eslint/angular-eslint/blob/3c302cdc266ad5564b2c95e95175751380c9e512/packages/eslint-plugin/src/rules/prefer-signals.ts#L20-L26
[ng-prefer-signals-functions]: https://github.com/angular-eslint/angular-eslint/blob/3c302cdc266ad5564b2c95e95175751380c9e512/packages/eslint-plugin/src/rules/prefer-signals.ts#L28-L39
[ng-required-inputs]: https://github.com/angular/angular/blob/99fd45a09d4a8a8996d2801a0d01d82153aeb431/adev/src/content/guide/components/inputs.md?plain=1#L73-L87
[ng-required-queries]: https://github.com/angular/angular/blob/99fd45a09d4a8a8996d2801a0d01d82153aeb431/adev/src/content/guide/components/queries.md?plain=1#L143-L157
[ng-prefer-signals]: https://github.com/angular-eslint/angular-eslint/blob/3c302cdc266ad5564b2c95e95175751380c9e512/packages/eslint-plugin/docs/rules/prefer-signals.md
[ts-non-null]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-
[no-non-null-assertion]: https://typescript-eslint.io/rules/no-non-null-assertion/
[ts-satisfies]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator
[no-unnecessary-type-assertion]: https://typescript-eslint.io/rules/no-unnecessary-type-assertion/
[consistent-type-assertions]: https://typescript-eslint.io/rules/consistent-type-assertions/
[no-unsafe-type-assertion]: https://typescript-eslint.io/rules/no-unsafe-type-assertion/
[no-unsafe-type-assertion-when-not]: https://github.com/typescript-eslint/typescript-eslint/blob/93a92689c215816c7e0dc011cfdd0634b3dd8edc/packages/eslint-plugin/docs/rules/no-unsafe-type-assertion.mdx?plain=1#L59
[tse-11680]: https://github.com/typescript-eslint/typescript-eslint/issues/11680#issuecomment-3571099564
[fowler-test-double]: https://martinfowler.com/bliki/TestDouble.html
[swe-real]: https://abseil.io/resources/swe-book/html/ch13.html#real_implementations
[swe-fake]: https://abseil.io/resources/swe-book/html/ch13.html#faking-id00043
[swe-stub]: https://abseil.io/resources/swe-book/html/ch13.html#when_is_stubbing_appropriatequestion_ma
[ng-testing-services]: https://github.com/angular/angular/blob/99fd45a09d4a8a8996d2801a0d01d82153aeb431/adev/src/content/guide/testing/services.md?plain=1#L56
[type-fest-partial-deep]: https://github.com/sindresorhus/type-fest/blob/adf9875b1960305029bfb6ff827e6d3f8ac69d6a/source/partial-deep.d.ts#L53-L55
[jasmine-spy-obj]: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/3a0a6ffd801dc5f7a2b50b64c8f2fb32c93643cb/types/jasmine/index.d.ts#L1408-L1411
