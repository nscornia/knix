# Laws

The code-quality laws the `@knix-law` packages enforce, one file per law. Each states the general rule first, then any framework-specific narrowings.

A law under review lives in `draft/law/` and moves here once approved.

| Law | Rule in one line |
|---|---|
| [Reuse existing utilities](../../draft/law/reuse-existing-utilities.law.md) | Use the project's utility; extend it rather than bypass it. |
| [Opt-in shared configuration](../../draft/law/opt-in-shared-configuration.law.md) | New shared behaviour ships as a named unit consumers enable. |
| [Place with the owner](../../draft/law/place-with-owner.law.md) | Code lives with its owner; hoist to the nearest common owner when shared. |
| [Import by name](../../draft/law/import-by-name.law.md) | Import only what a unit uses, by name. |
| [No mutating unowned data](../../draft/law/no-mutating-unowned-data.law.md) | Copy before changing data you don't own. |
| [Own your public types](../../draft/law/own-your-public-types.law.md) | Expose owned interfaces, not a dependency's types by accident. |
| [Style through the published API](../../draft/law/style-through-published-api.law.md) | Style a dependency only through its published styling API. |
| [Derive declaratively](../../draft/law/derive-declaratively.law.md) | Compute derived values once per change; never hand-sync a copy. |
| [Expose read-only state](../../draft/law/expose-read-only-state.law.md) | The state owner is the only writer; consumers get a read-only view. |
| [Nest with meaning](../../draft/law/nest-with-meaning.law.md) | Add a nesting level only when the grouping means something. |
| [Never call framework callbacks](../../draft/law/never-call-framework-callbacks.law.md) | Lifecycle hooks are the framework's to call; share logic through named methods. |
| [Build versus buy, in order](../../draft/law/build-vs-buy-order.law.md) | Platform, installed library, new dependency, then custom code. |
