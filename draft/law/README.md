# Draft laws

Laws under review. None is approved until every draft has been walked and the reviewing peer has explicitly confirmed the walk is done. Then each moves to [`knowledge/law/`](../../knowledge/law/README.md) with its row.

| Law | Rule in one line |
|---|---|
| [Reuse existing utilities](reuse-existing-utilities.law.draft.md) | Use the designated utility for a job; never write a parallel implementation. |
| [Use the design system](use-the-design-system.law.draft.md) | Design-system component, then native element, then a hand-built component. |
| [Opt-in shared configuration](opt-in-shared-configuration.law.draft.md) | New shared behaviour ships as a named unit consumers enable. |
| [Place with the owner](place-with-owner.law.draft.md) | Code lives with its owner; hoist to the nearest common owner when shared. |
| [Import by name](import-by-name.law.draft.md) | Import only what a unit uses, by name. |
| [Only the owner writes](only-the-owner-writes.law.draft.md) | Owners keep the writable source private; consumers copy before changing. |
| [Own your public types](own-your-public-types.law.draft.md) | Expose owned types, not a dependency's types by accident. |
| [Export only what another module imports](export-only-what-another-module-imports.law.draft.md) | Export a symbol only when another module imports it. |
| [Style through the published API](style-through-published-api.law.draft.md) | Style a dependency only through its published styling API. |
| [Derive declaratively](derive-declaratively.law.draft.md) | Compute derived values once per change; never hand-sync a copy. |
| [Nest with meaning](nest-with-meaning.law.draft.md) | Add a nesting level only when the grouping means something. |
| [Type values precisely](type-values-precisely.law.draft.md) | No `any` or type suppression; `unknown`, narrowed, where untyped data enters. |
| [Assert only what the checker cannot know](assert-only-what-the-checker-cannot-know.law.draft.md) | Prefer an annotation, `satisfies` or a runtime check; assert only what none of them can establish. |
| [Name values descriptively](name-values-descriptively.law.draft.md) | A word for every value; a single letter only where the letter is the convention. |
| [Never call framework callbacks](never-call-framework-callbacks.law.draft.md) | Lifecycle hooks are the framework's to call; share logic through named methods. |
| [Build versus buy, in order](build-vs-buy-order.law.draft.md) | Platform, installed library, new dependency, then custom code. |
| [One term, one concept, per bounded context](one-term-one-concept-per-bounded-context.law.draft.md) | Each context's glossary gives one name per concept and one concept per name. |
| [Name a type for one of its values](name-a-type-for-one-of-its-values.law.draft.md) | Singular unless one value holds many; never coin a plural. |
| [Explain every disable](explain-every-disable.law.draft.md) | A disable names its rules and says why; remove one that changes nothing. |
| [Deprecate before removing published API](deprecate-before-removing-published-api.law.draft.md) | Deprecate a published element first; remove it at the next major, or sooner once no verifiable consumer is left. |
| [Use type unless extending](use-type-unless-extending.law.draft.md) | `type` by default; `interface` only to extend or augment, never merged. |
| [Use as const, not enum](use-as-const-not-enum.law.draft.md) | No written `enum`; an `as const` object or array instead. |
| [Name shapes and repeated types](name-shapes-and-repeated-types.law.draft.md) | Name a 3-member object shape and a repeated type; reuse a named type that exists. |
| [Identify by key, not display text](identify-by-key-not-display-text.law.draft.md) | Use the stable key, never display text, as an identifier, comparison target or data key. |
| [Assert exact values, not truthiness](assert-exact-values-not-truthiness.law.draft.md) | A test asserts the exact expected value, not truthiness; presence and absence stay allowed. |
| [Use design tokens for style values](use-design-tokens-for-style-values.law.draft.md) | Color, spacing, border radius and typography come from design tokens, never literals. |
| [Set backgrounds through longhands](set-backgrounds-through-longhands.law.draft.md) | `background-color` or `background-image`, never the `background` shorthand except `background: none`. |
| [Handle errors where the fallback belongs](handle-errors-where-the-fallback-belongs.law.draft.md) | Put `catchError` where its fallback belongs; write a shared fallback once. |
| [Batch bulk actions into one request](batch-bulk-actions-into-one-request.law.draft.md) | A bulk action is one request to a list endpoint; a per-item loop until then is tracked tech debt. |
| [Alphabetize unordered collections](alphabetize-unordered-collections.law.draft.md) | Sort a marked collection whose order means nothing; one whose order means something keeps it. |
