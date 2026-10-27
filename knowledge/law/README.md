# Laws

The code-quality laws the `@knix-law` packages enforce, one file per law. Each states the general rule first, then any framework-specific narrowings.

| Law | Rule in one line |
|---|---|
| [Reuse existing utilities](reuse-existing-utilities.md) | Use the project's utility; extend it rather than bypass it. |
| [Opt-in shared configuration](opt-in-shared-configuration.md) | New shared behaviour ships as a named unit consumers enable. |
| [Place with the owner](place-with-owner.md) | Code lives with its owner; hoist to the nearest common owner when shared. |
| [Import by name](import-by-name.md) | Import only what a unit uses, by name. |
| [No mutating unowned data](no-mutating-unowned-data.md) | Copy before changing data you don't own. |
| [Own your public types](own-your-public-types.md) | Expose owned interfaces, not a dependency's types by accident. |
| [Style through the published API](style-through-published-api.md) | Style a dependency only through its published styling API. |
| [Derive declaratively](derive-declaratively.md) | Compute derived values once per change; never hand-sync a copy. |
| [Expose read-only state](expose-read-only-state.md) | The state owner is the only writer; consumers get a read-only view. |
| [Nest with meaning](nest-with-meaning.md) | Add a nesting level only when the grouping means something. |
