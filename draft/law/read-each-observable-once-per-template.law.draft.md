# Read each observable once per template

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- In an Angular template, read each observable through `async` once: bind it with `@let` or `@if (…; as x)`, and use that name everywhere else in the template.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Enforcement

<!-- TODO: ruled at `error`: a knix template rule reporting a repeated `x | async` on the same component member, matched by text, across views; template-local names, calls and keyed reads are exempt. Written from this law's Rule and probed against the declared @angular-eslint/template-parser once built. -->

## Related

- [Only the owner writes](only-the-owner-writes.law.draft.md) builds the observable a template reads as a field once, so `async` keeps one subscription.
