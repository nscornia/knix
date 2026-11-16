# Assert exact values, not truthiness

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. -->

## Rule

- **Test files:** assert the exact expected value, such as `toBeNull()`, `toBe(…)` or `toEqual(…)`.
  - Never assert truthiness, as `toBeTruthy()`, `toBeFalsy()`, `.ok` and `assert.ok` do.
  - Asserting that an element is present or absent is allowed.

## Why

`toBeFalsy()` passes for any of JavaScript's nine falsy values and `toBeTruthy()` for every other value, so the test still passes when the value is wrong but on the expected side. An exact matcher names the value the test expects, and fails on anything else, even where the code reads the value only as a boolean.

- **Nine falsy values:** "a complete list of JavaScript falsy values": `null`, `undefined`, `false`, `NaN`, `0`, `-0`, `0n`, `""` and `document.all` ([MDN, Falsy][mdn-falsy]).
- **Chai** ([Chai, `.ok`][chai-ok]):
  - `.ok` "Asserts that the target is a truthy value".
  - "it's often best to assert that the target is strictly (`===`) or deeply equal to its expected value."
- **Noted disagreement** ([Jest, `.toBeTruthy()`][jest-to-be-truthy]):
  - "Use `.toBeTruthy` when you don't care what a value is and you want to ensure a value is true in a boolean context."

## Enforcement

- `@knix-law/assert-exact-values-not-truthiness-restricted-syntax`, the plugin's copy of core `no-restricted-syntax`, at `error`:
  - **Test files:** in a `files` override for [test files](README.md#test-files), four selectors:
    - `CallExpression[callee.property.name=/^(toBeTruthy|toBeFalsy)$/]`, for Jest, Vitest and Jasmine, `.not.` included;
    - `MemberExpression[property.name='ok']:has(CallExpression.object[callee.name='expect'])`, for Chai's `expect(…).to.be.ok` and `to.not.be.ok`;
    - `CallExpression[callee.property.name=/^(should|and)$/][arguments.0.value=/^(not\.)?be\.ok$/]`, for Cypress `should('be.ok')` and `should('not.be.ok')`;
    - `CallExpression[callee.object.name='assert'][callee.property.name=/^(ok|notOk|isOk|isNotOk)$/]`, for Node's `assert.ok` and Chai's `assert.ok`, `notOk`, `isOk` and `isNotOk`.
  - Presence and absence pass: `should('exist')`, `should('not.exist')`, `toBeNull()` and `not.toBeNull()` (probed).
  - A codebase adopting the law records its existing violations in the committed suppressions file.
- **Known gaps:**
  - A bare `assert(x)` is not reported: it can be an exact comparison, such as `assert(a === b)`.
  - Chai's should style, `x.should.be.ok`, is not reported: the Chai selector needs an `expect` call.
  - The assert selector needs the identifier `assert`, so these are not reported (probed):
    - An `ok` imported by name, such as `ok(x)`.
    - `assert` imported under another name, such as `strict.ok(x)`.

[mdn-falsy]: https://github.com/mdn/content/blob/2547f622337d6cbf8c3794776b17ed377d6aad57/files/en-us/glossary/falsy/index.md?plain=1#L14-L26
[chai-ok]: https://github.com/chaijs/chai/blob/2cd336d5c88a4802ae69a61c44bb74ac7566f0d7/lib/chai/core/assertions.js#L644-L648
[jest-to-be-truthy]: https://github.com/jestjs/jest/blob/3487fb6c08284039dc158cc1decb130b9d107281/docs/ExpectAPI.md?plain=1#L535
