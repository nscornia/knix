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
| [Translate user-facing text](translate-user-facing-text.law.draft.md) | Text a user reads comes from the translation catalog; a message with variable parts is one catalog entry. |
| [Import within a package by relative path](import-within-a-package-by-relative-path.law.draft.md) | A file in the same package is imported by relative path, never a root path or alias; another package by its name. |
| [Return early and keep nesting shallow](return-early-and-keep-nesting-shallow.law.draft.md) | Return or throw once a case is settled, with no `else` after it; nest blocks at most four deep in a function. |
| [Keep CI checks enabled and blocking](keep-ci-checks-enabled-and-blocking.law.draft.md) | CI jobs that check the change stay enabled and blocking; a failing gate is fixed or narrowed with a described disable. |
| [Add a file only when it has content](add-a-file-only-when-it-has-content.law.draft.md) | Never commit an empty or placeholder file; a file a tool requires to exist is the one exception. |
| [Measure before optimizing](measure-before-optimizing.law.draft.md) | Add an optimization layer only for a measured problem whose gain outweighs its complexity; framework memoisation is not one. |
| [Fetch data from its owning system](fetch-data-from-its-owning-system.law.draft.md) | Data another system owns comes from it at runtime; data the code owns lives in its own module beside its user. |
| [Build markup in templates](build-markup-in-templates.law.draft.md) | Markup comes from a template, never an HTML string written or bound in code; HTML content goes through a sanitizer. |
| [Build arrays with map and filter](build-arrays-with-map-and-filter.law.draft.md) | Build an array from another with `map` and `filter`, not by pushing from a loop; a loop doing more stays a loop. |
| [Default with nullish coalescing](default-with-nullish-coalescing.law.draft.md) | Default a missing value with `??`, never `\|\|`; a deliberate `\|\|` takes a disable comment that says so. |
| [Ship no debug console output](ship-no-debug-console-output.law.draft.md) | Browser code calls only `console.warn` or `console.error`; code that never ships is exempt by path. |
| [List dependencies by what uses them](list-dependencies-by-what-uses-them.law.draft.md) | `devDependencies` for packages only tests, tooling or builds use; shipped code never imports a test package. |
| [Read each observable once per template](read-each-observable-once-per-template.law.draft.md) | Read an observable through `async` once per template; bind it with `@let` or `@if (…; as x)` and reuse the name. |
| [Name the public surface for its users](name-public-surface-for-its-users.law.draft.md) | Name public tokens, inputs, outputs and configuration keys for what they mean to users, not how they're built. |
| [Publish only the tokens consumers use](publish-only-the-tokens-consumers-use.law.draft.md) | Publish the tokens consumers style with; a token only the design system's own components use stays unpublished. |
