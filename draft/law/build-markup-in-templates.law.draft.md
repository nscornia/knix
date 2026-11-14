# Build markup in templates

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- Build markup in a template, never as an HTML string in code. Never write HTML through a DOM or renderer API (`innerHTML`, `outerHTML`, `insertAdjacentHTML`), bind a string as HTML (`[innerHTML]`, `[srcdoc]`), or bypass the framework's sanitizer. Content that must arrive as HTML, such as rendered Markdown, goes through a sanitizer, under a disable comment that explains why.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Enforcement

<!-- TODO: ruled at `error`. The checks wait for a ruling on declaring sonarjs and @angular-eslint/eslint-plugin-template, then are written from this law's Rule and probed against the declared versions. -->

## Related

- [Build versus buy, in order](build-vs-buy-order.law.draft.md) names the sanitizer to use for content that must arrive as HTML.
- [Explain every disable](explain-every-disable.law.draft.md) governs the disable comment that content arriving as HTML takes.
