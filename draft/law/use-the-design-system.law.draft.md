# Use the design system

Reach for the design system's component before a native element or a hand-built component.

## Rule

- **Order:** use the design system's component or directive for a need, then a native element, then a hand-built component.
- **Match the need:** choose a component by behaviour, not by look.
  - Free text with suggestions is not a fixed choice.
  - Replacing an element with a component keeps its behaviour.
- **Missing component:** build it locally as a one-off, with a one-line reason.
  - Once a second feature needs it, move it into the design system.
  - When the design system is a dependency, move it into the project's wrapping library instead.
- **Hand-built component:** follow the matching ARIA APG pattern, and build from the design system's tokens and primitives.

## Why

A browser decides how a native control looks and how much interface it offers; the HTML standard fixes only what the control means, such as a button being exposed to assistive technology as a button. A native element therefore brings consistent semantics but not a consistent look or interaction. A hand-built component brings neither until someone implements keyboard operation, focus, an accessible name and role, and announced state changes. The design system's component takes both concerns off the teams that use it: it does that work once, on a native element where it can, is fixed in one place, and is built to look and behave the same on every screen, so users recognise it.

- **Look versus meaning:**
  - "User agents are not required to present HTML documents in any particular way." ([HTML, rendering][whatwg-rendering])
  - "Whether an input element supports a picker depends on the type attribute state and implementation-defined behavior." ([HTML, input][whatwg-picker])
  - HTML-AAM maps `button` to the ARIA `button` role ([HTML-AAM, `button`][html-aam]).
    - Its normative sections "provide requirements that user agents and assistive technologies MUST follow".
  - "standard HTML controls already meet this success criterion when used according to specification" ([WCAG, SC 4.1.2][wcag-412]).
- **Consistency:**
  - "Maintain consistency within a single product or a family of products (internal consistency)." ([NN/g, heuristic 4][nng-heuristics])
  - "Users can recognize the same functionality when it appears on different web pages." ([WCAG, Understanding SC 3.2.4][wcag-324])
- **Native before hand-built** ([W3C, Using ARIA][using-aria]):
  - "If you can use a native HTML element" with the "semantics and behavior you require already built in", "then do so".
- **Native elements** ([MDN `<datalist>`][mdn-datalist]):
  - `<datalist>` "is not a replacement for" `<select>`: its control "can still accept any value that passes validation."
  - Some screen reader and browser pairs "do not announce the contents of the autosuggest popup."
  - A combobox that "supports text input" is "editable", unlike a fixed choice ([ARIA APG, combobox][apg-combobox]).
- **Native input types:**
  - "Do not use `<input type="number">` unless your user research shows that there’s a need for it." ([GOV.UK, text input][govuk-text-input])
  - "The appearance of the date picker input UI varies based on the browser and operating system." ([MDN, date input][mdn-date])
- **Browser dialogs:** `alert`, `confirm` and `prompt` "should be replaced by a more appropriate custom UI implementation" ([ESLint `no-alert`][no-alert]).
- **Missing components:**
  - A "snowflake" is "a one-off component that only really pertains to one specific product or use case" ([Brad Frost, governance process][frost-governance]).
  - Tracking snowflakes makes "refactoring into the design system easier down the road."
  - GOV.UK admits a component on "evidence that this component or pattern would be useful for many teams or services" ([contribution criteria][govuk-criteria]).
- **Hand-built components:**
  - "No ARIA is better than Bad ARIA" ([ARIA APG, Read Me First][apg-read-me-first]).
  - Home pages with ARIA averaged 59.1 detected errors, against 42 without. This is a correlation ([WebAIM Million 2026][webaim-million]).
  - Widget roles "act as standalone user interface widgets or as part of larger, composite widgets" ([WAI-ARIA 1.2, widget roles][aria-widget-roles]).

## Exceptions

- A case the component cannot express, including a component that misses the accessibility target. Never route around it:
  - Extend, split or reshape the component as [Reuse existing utilities](reuse-existing-utilities.law.draft.md#exceptions) does a utility.
- **Wrapped libraries:** native markup a wrapped library renders or requires, such as a data grid's built-in cell renderers and editors.
  - A consumer of the wrapper writes a custom cell renderer only when it needs one, never just to satisfy this law.

## Enforcement

Each repository lists what its design system replaces, at `error`, each with a message naming the component. Every check is `@knix-law/use-the-design-system-restricted-syntax`, the plugin's copy of core `no-restricted-syntax`, with Angular templates parsed by [`@angular-eslint/template-parser`][ng-template-parser], unless noted.

- **Native elements:**
  - Angular: `Element[name=/^(<tags>)$/i]`. The parser keeps a tag's case, so `<SELECT>` needs the `i` flag.
  - JSX: `JSXOpeningElement[name.name=/^(<tags>)$/]`, without the `i` flag. A capitalised name such as `<Select>` is a component.
- **Native `<input>` types:**
  - Angular: `Element[name=/^input$/i]:has(TextAttribute[name='type'][value=/^(<types>)$/i])`.
  - JSX: `JSXOpeningElement[name.name='input']:has(JSXAttribute[name.name='type'] Literal[value=/^(<types>)$/i])`.
  - Keyword values are an "ASCII case-insensitive match", so `type="DATE"` is a date input ([HTML, enumerated attributes][whatwg-enumerated]).
- **ARIA widget roles the design system provides**, which mark a hand-built component:
  - Angular: `TextAttribute[name='role'][value=/(^|\s)(<roles>)(\s|$)/i]`.
  - JSX: `JSXAttribute[name.name='role'] Literal[value=/(^|\s)(<roles>)(\s|$)/i]`.
  - The token match also catches a fallback list such as `role="switch button"`.
- **Browser dialogs:** `alert`, `confirm` and `prompt`, through core `no-alert` ([rule docs][no-alert]).
- **A `type` or `role` set at runtime:** static analysis can't read it. Each site takes an inline disable that says why.
  - Angular: `Element[name=/^input$/i]:has(BoundAttribute[name='type'])` and `BoundAttribute[name='role']`.
  - JSX: `JSXOpeningElement[name.name='input'] > JSXAttribute[name.name='type'] > JSXExpressionContainer > :not(Literal)`.
  - JSX: `JSXAttribute[name.name='role'] > JSXExpressionContainer > :not(Literal)`.
- **Everything else:** review only.

## Related

- [Reuse existing utilities](reuse-existing-utilities.law.draft.md) applies the same principle to the project's non-UI code.
- [Style through the published API](style-through-published-api.law.draft.md) governs how the design system's components are styled.
- [Use design tokens for style values](use-design-tokens-for-style-values.law.draft.md) governs the values a style takes, including a hand-built component's.
- [Build versus buy, in order](build-vs-buy-order.law.draft.md) governs what to do when neither the design system nor a native element fits.
- [Place with the owner](place-with-owner.law.draft.md) sets the second-consumer trigger for moving a one-off into the design system.
- [Explain every disable](explain-every-disable.law.draft.md) owns the checks that each inline disable names its rules and says why.

[nng-heuristics]: https://www.nngroup.com/articles/ten-usability-heuristics/
[wcag-324]: https://github.com/w3c/wcag/blob/457cece22d8219be32d29c5c1313e71aa6b61eae/understanding/20/consistent-identification.html
[using-aria]: https://github.com/w3c/using-aria/blob/002bb7a5769828d6b2dc65f2528e16951142a589/index.html
[mdn-datalist]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/datalist
[apg-combobox]: https://github.com/w3c/aria-practices/blob/0f765e4dc33e966026114ac12a8380db1de3b787/content/patterns/combobox/combobox-pattern.html
[frost-governance]: https://bradfrost.com/blog/post/a-design-system-governance-process/
[govuk-criteria]: https://github.com/alphagov/govuk-design-system/blob/14ef0f3cad54b5e42c58b4a080d2dd54617b443a/src/community/contribution-criteria/index.md
[apg-read-me-first]: https://github.com/w3c/aria-practices/blob/0f765e4dc33e966026114ac12a8380db1de3b787/content/practices/read-me-first/read-me-first-practice.html
[webaim-million]: https://webaim.org/projects/million/
[ng-template-parser]: https://github.com/angular-eslint/angular-eslint/tree/957c6298c949b31169b3eeb96532bb8585f165b1/packages/template-parser
[govuk-text-input]: https://github.com/alphagov/govuk-design-system/blob/14ef0f3cad54b5e42c58b4a080d2dd54617b443a/src/components/text-input/index.md
[mdn-date]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date
[no-alert]: https://eslint.org/docs/latest/rules/no-alert
[aria-widget-roles]: https://www.w3.org/TR/wai-aria-1.2/#widget_roles
[whatwg-enumerated]: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#keywords-and-enumerated-attributes
[whatwg-rendering]: https://html.spec.whatwg.org/multipage/rendering.html#rendering
[whatwg-picker]: https://html.spec.whatwg.org/multipage/input.html#input-support-picker
[html-aam]: https://github.com/w3c/html-aam/blob/b0b0913f994f87fa95a13fca94d6ce137dc3f614/index.html
[wcag-412]: https://github.com/w3c/wcag/blob/457cece22d8219be32d29c5c1313e71aa6b61eae/guidelines/sc/20/name-role-value.html
