# Identify by key, not display text

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. -->

## Rule

- Use the stable key, never display text, as an identifier, a comparison target or a data key.
  - Display text is text written for a person to read: a catalog result, an error message, DOM text, an accessible name or a formatter's output.
  - A comparison is any check on display text: equality, a switch case or a string test such as `includes` or `startsWith`.
- Display text may be sorted for display, and matched against what a user typed to search or filter through one shared search matcher.
  - The matcher takes plain `string` parameters, and selects and grids use it as their search function.
  - It ignores case and accents the way the locale does, such as [`Intl.Collator`][collator] with `usage: 'search'` and `sensitivity: 'base'` over windows of the text.
  - An equality test through collation, such as `localeCompare(…) === 0`, is a comparison.
- **Test files:** select or assert by display text only through its key or the data it is built from, never a literal.
  - Where a test checks that an action happened, it asserts what the action produced (a request, a route, state, or a test ID), not the text shown.
  - Catalog text: through a translate call on its key.
    - The test locale maps each key to itself, or is a fixed locale, and throws on a missing key without falling back to another catalog or a default message.
    - A mode or mock that returns every key, such as i18next's `cimode`, never throws, so it does not qualify.
  - Text built from data: through the test's own data, via the formatter the app uses, if any.
    - A formatter's own tests may assert its return value as a literal, with the locale and time zone set in the test.
  - A test ID is the fallback where neither applies.
  - Shared automation code selects an element by test ID, or by role with its name through its key; never by class, tag, id or DOM structure.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Exceptions

- A producer that gives only display text: one boundary adapter maps it to a key, marked by a described disable.
- A page the codebase doesn't render, such as an external sign-in page.

## Enforcement

- **Translate calls:** `@knix-law/identify-by-key-not-display-text-restricted-syntax`, the plugin's copy of core [`no-restricted-syntax`][no-restricted-syntax], at `error` (probed).
  - `<call>` stands for each repository's translate calls, such as `CallExpression[callee.name=/^(t|\$t)$/]` and `CallExpression[callee.property.name=/^(t|\$t|formatMessage)$/]`.
    - For an optional call such as `i18n?.t('x')`, each selector is listed again with `ChainExpression` above `<call>`, taking its field: `SwitchStatement > ChainExpression.discriminant > <call>`.
  - Selectors:
    - Equality: `BinaryExpression[operator=/^[!=]==?$/] > <call>`.
    - Collation equality: `BinaryExpression[operator=/^[!=]==?$/] > CallExpression[callee.property.name='localeCompare'] > MemberExpression.callee > <call>.object`, and the same with `ChainExpression >` after `BinaryExpression >`, for `i18n?.t('a').localeCompare(b) === 0`.
    - Switch: `SwitchStatement > <call>.discriminant` and `SwitchCase > <call>.test`.
    - String tests: `CallExpression[callee.property.name=/^(includes|startsWith|endsWith|indexOf|lastIndexOf|match|matchAll|search)$/] > MemberExpression.callee > <call>.object`, on the text, and `CallExpression[callee.property.name=/^(test|exec|includes|indexOf)$/] > <call>.arguments`, against it.
    - Data key: `MemberExpression[computed=true] > <call>.property`, `Property[computed=true] > <call>.key` and `CallExpression[callee.property.name=/^(get|set|has|delete|getItem|setItem)$/] > <call>.arguments:first-child`.
  - Sorting, an ordering operator such as `<`, and `localeCompare(…) < 0` are not reported.
- **Angular templates:** the same rule, with `@angular-eslint/template-parser` on template files and `<pipe>` set to `BindingPipe[name='translate']` (probed on angular-eslint 22.6.0):
  - `Binary[operation=/^[!=]==?$/] > ParenthesizedExpression > <pipe>`.
  - `Call > PropertyRead[name=/^(includes|startsWith|endsWith|indexOf|match|search)$/] > ParenthesizedExpression > <pipe>`.
  - `SwitchBlock > ASTWithSource > <pipe>`, `SwitchBlockCase <pipe>` and `BoundAttribute[name='ngSwitch'] <pipe>`.
- **Test files:** the same rule, in a `files` override for test files, with `<literal>` set to `:matches(Literal, TemplateLiteral[expressions.length=0])` (probed):
  - Queries: `CallExpression[callee.property.name=<query>] > <literal>.arguments:first-child` and `CallExpression[callee.property.name=<role>] > ObjectExpression.arguments Property:matches([key.name=/^(name|description)$/], [key.value=/^(name|description)$/]) > <literal>.value`, each also with `callee.name`.
    - `<query>` is `/^(getBy|getAllBy|queryBy|queryAllBy|findBy|findAllBy|toContainAnyBy|toContainOneBy)(Text|LabelText|Label|PlaceholderText|Placeholder|DisplayValue|AltText|Title)$/`, and `<role>` the same prefixes before `Role`.
  - Playwright: `CallExpression > ObjectExpression.arguments > Property:matches([key.name=/^has(Not)?Text$/], [key.value=/^has(Not)?Text$/]) > <literal>.value`, for `hasText` and `hasNotText`, and `CallExpression > :matches(Literal[value=/^text=/], TemplateLiteral[expressions.length=0][quasis.0.value.raw=/^text=/]).arguments`, for a `text=` selector, and `CallExpression[callee.property.name=/^(locator|filter|getByRole)$/] > :matches(Literal[value=/:(has-text|text|text-is|text-matches)\(/], TemplateLiteral[expressions.length=0][quasis.0.value.raw=/:(has-text|text|text-is|text-matches)\(/]).arguments:first-child`, for a [text pseudo-class][playwright-text-pseudo].
  - Assertions:
    - Text: `CallExpression[callee.property.name=/^(toHaveText|toContainText|toHaveTextContent|toHaveAccessibleName|toHaveAccessibleDescription|toHaveAccessibleErrorMessage|toHaveErrorMessage|toHaveDescription|toHaveSelection|toHaveTitle|toHaveDisplayValue)$/] > <literal>.arguments`, and `CallExpression[callee.property.name=/^(toHaveText|toContainText|toHaveDisplayValue)$/] > ArrayExpression.arguments > <literal>` for an array.
    - Attributes: `CallExpression[callee.property.name='toHaveAttribute'][arguments.0.value=/^(aria-label|aria-description|alt|title|placeholder)$/] > <literal>.arguments:nth-child(2)`, and `CallExpression[callee.property.name='toHaveJSProperty'][arguments.0.value=/^(title|textContent|innerText|innerHTML|placeholder|alt|ariaLabel|ariaDescription)$/] > <literal>.arguments:nth-child(2)` for a property.
    - HTML: `CallExpression[callee.property.name='toContainHTML'] > :matches(Literal[value=/(^|>)\s*[^<\s]/], TemplateLiteral[expressions.length=0][quasis.0.value.raw=/(^|>)\s*[^<\s]/]).arguments`, for markup with text at its start or after a `>`.
    - Errors: `CallExpression[callee.property.name=/^toThrow(Error)?$/] > <literal>.arguments`.
  - Cypress, with `<should>` set to `CallExpression[callee.property.name=/^(should|and)$/]` and `<name>` to `/^(aria-label|aria-description|alt|title|placeholder|textContent|innerText|innerHTML|ariaLabel|ariaDescription)$/`:
    - `contains`, with `<cy>` set to `CallExpression[callee.property.name='contains']:has(Identifier[name='cy'])`: `<cy>:matches([arguments.length=1], [arguments.1.type='ObjectExpression']) > <literal>.arguments:first-child` and `<cy>[arguments.length>=2]:not([arguments.1.type='ObjectExpression']) > <literal>.arguments:nth-child(2)`; the second form reads the content after a selector, as in `cy.contains('button', 'Save')`, so the selector is not reported; a `:contains()` selector string is reported by `CallExpression[callee.property.name=/^(get|find|filter|not)$/] > :matches(Literal[value=/:contains\(/], TemplateLiteral[expressions.length=0][quasis.0.value.raw=/:contains\(/]).arguments:first-child`.
    - Text: `<should>[arguments.0.value=/^(not\.)?(have\.(text|html)|(contain|include)\.(text|html)|contain)$/]:not(:has(MemberExpression.callee > CallExpression[callee.object.name='cy'][callee.property.name=/^(url|location|hash|request|getCookie|getCookies)$/])) > <literal>.arguments:nth-child(2)`; a URL, location, request or cookie subject is not display text, so it is not reported.
    - Attributes: `<should>[arguments.0.value=/^(not\.)?have\.(attr|prop)$/][arguments.1.value=<name>] > <literal>.arguments:nth-child(3)`.
    - Chains: `<should>[arguments.0.value=/^(not\.)?(eq|equal|equals|eql|include|match|matches|have\.string|string)$/]:has(MemberExpression.callee > <text>) > <literal>.arguments:nth-child(2)`, where `<text>` is a step that yields display text: `:matches(<should>[arguments.length=2][arguments.0.value=/^have\.(attr|prop)$/][arguments.1.value=<name>], CallExpression[callee.property.name='invoke'][arguments.0.value=/^(text|html)$/], CallExpression[callee.property.name='invoke'][arguments.0.value=/^(attr|prop)$/][arguments.1.value=<name>], CallExpression[callee.property.name='its'][arguments.0.value=/(^|\.)(textContent|innerText|innerHTML)$/], CallExpression[callee.object.name='cy'][callee.property.name='title'])`; a two-argument `have.attr` or `have.prop` changes the subject to the value ([Cypress][cypress-have-attr]).
    - Callbacks: `CallExpression[callee.property.name=/^(text|html)$/]:has(CallExpression[callee.name='expect']) > <literal>.arguments:first-child` and `CallExpression[callee.property.name=/^(attr|prop)$/][arguments.0.value=<name>]:has(CallExpression[callee.name='expect']) > <literal>.arguments:nth-child(2)`.
  - A regex literal is reported, and so is a key written as a literal.
    - For catalog text, pass the key through the translate call; for text built from data, pass the test's own data.
- **Typed rule:** `@knix-law/identify-by-key-not-display-text` at `error`: `{ types: ['<display-text type>'] }`.
  - Each repository's translate wrappers return a branded display-text type, such as `string & { readonly [displayText]: true }`.
  - It reports that type used as a comparison, switch, string test or data key, through a variable, alias or parameter (probed).
  - Inside the checked expression, a template literal or string method such as `trim` applied to display text gives display text (probed).
  - Sorting and an ordering operator such as `<` are not reported (probed).
  - Passing display text to the search matcher's plain `string` parameters drops the brand, so the matcher's body is not reported (probed).
- **Shared automation code:** a typed rule at `error` (probed). <!-- TODO: the rule ID, and how its config marks the shared automation pattern for text-based queries, pending a ruling. -->
  - Option: `{ testIdAttribute: '<attribute>' }`, one attribute, default `data-testid`, set to the value the repository's test runner uses.
  - Files: test files, and a `files` pattern each repository sets for shared automation code, such as page objects, support commands, harnesses and fixtures.
  - Calls: only those whose signature Playwright, Cypress, Testing Library, the DOM, Angular's `By.css` or a CDK harness's `locatorFor` declares, so `Map.get` is not reported.
  - Reported:
    - A selector argument whose type doesn't prove one selector on that attribute, such as `[data-testid="save"]`, or a Cypress `@alias`.
    - That includes a plain `string`, a template with a class around its expression, and a constant or page-object field holding a class.
    - `getElementById`, `getElementsByClassName`, `getElementsByTagName`, `getElementsByTagNameNS` and `getElementsByName`.
    - A structure call, directly or through Cypress `invoke`: `nth`, `first`, `last`, `eq`, `parent`, `parents`, `parentsUntil`, `children`, `siblings`, `next`, `nextAll`, `nextUntil`, `prev`, `prevAll` or `prevUntil`.
    - Only in the shared automation pattern, any text-based query, even through a key, such as `getByText`, `getByLabel`, `hasText` or Cypress `contains`.
  - Covered elsewhere: a role query's literal name, by the Test files rule above; an `any` receiver, by `no-unsafe-call` and `no-unsafe-member-access` from [Type values precisely](type-values-precisely.law.draft.md).
- **Optional, per repository:** checks that a key exists in the catalog. Each reads only a key inside a translate call (probed).
  - Typed keys: i18next's typed `resources` and FormatJS's typed message `ids` reject an unknown key at compile time.
  - Catalog lint: [`no-missing-keys`][intlify-no-missing-keys] from `@intlify/eslint-plugin-vue-i18n`, for callees named `t`, `$t`, `tc` or `$tc`.
- **Configuration:**
  - **Per-law rule:** a later config entry for a core rule replaces an earlier one's list, so this law configures its own copy.
  - **Boundary adapter:** its described disable names this law's rule.
- **Known gaps (probed):**
  - A pipe result held by `@let` and compared later is not reported; the typed rule doesn't read templates.
  - In test files, these are not reported:
    - Catalog text held in a `const` before the query.
    - A literal inside a helper call, a concatenation or an `as const`.
    - A literal asserted through `toBe`, `toEqual`, `toMatch`, a snapshot or `assert.*`, so a formatter's own tests need no disable.
    - Input values through `toHaveValue`, `toHaveValues`, `toHaveFormValues`, `have.value` or `invoke('val')`: a select's value is a key, a typed input's is not.
    - Display text in an attribute selector such as `[title="Close"]`, in an aria snapshot, or in alt text inside `toContainHTML` markup.
  - In Cypress, these are not reported:
    - `expect($el.text())` or `expect($el.attr('title'))` compared by `eq` and the like.
    - `.select(text)`, whose argument may be an option's value or its text.
  - In Cypress, these are reported though the subject is not display text, so each takes a described disable:
    - A chain whose subject changes through `then` or a new `get` before the comparison, such as `invoke('text').then(Number).should('eq', '5')`.
    - A bare `contain` on a wrapped value that is not an element, such as `cy.wrap(['a']).should('contain', 'a')`.
  - A value typed as plain `string` loses the brand, so the typed rule doesn't report it.
    - A translation stored in a plain `string` field is one case.
    - A value derived and stored before the check, such as `const u = s.trim()`, is another.
- **Review:**
  - Comparisons on `err.message`, DOM text such as `textContent`, and formatter output such as `toLocaleString()`.
    - A selector for them also reports an unrelated `message` property, such as `event.data.message` (probed).
  - The test locale's setup: it throws on a missing key and falls back to no other catalog or default message.
  - A formatter's literal asserts: the locale and time zone are set in the test, and a Node or ICU upgrade can change the literal.
  - Plain `string` parameters: only the shared search matcher compares display text through them.
  - Tests that check an action happened: they assert what it produced, not the text shown.

## Related

- [Explain every disable](explain-every-disable.law.draft.md) governs the disable the boundary adapter takes.

[no-restricted-syntax]: https://github.com/eslint/eslint/blob/4637f9827a1ba137498eaee70957850621082815/docs/src/rules/no-restricted-syntax.md
[collator]: https://github.com/mdn/content/blob/106f215d6fb32a7ee0afe09f01a82323d39cd1f0/files/en-us/web/javascript/reference/global_objects/intl/collator/collator/index.md?plain=1#L66
[cypress-have-attr]: https://github.com/cypress-io/cypress-documentation/blob/96912356b194d741b120763e22bcdf910a3efb65/docs/api/commands/should.mdx?plain=1#L162-L169
[playwright-text-pseudo]: https://github.com/microsoft/playwright/blob/df99adab7ff784412ebf5d0970a03a788184ba6a/docs/src/other-locators.md?plain=1#L43-L112
[intlify-no-missing-keys]: https://github.com/intlify/eslint-plugin-vue-i18n/blob/14cf32d4bbd1bc90e5f1b9aeab77f0735c3cd9e2/lib/rules/no-missing-keys.ts#L105
