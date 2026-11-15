# List dependencies by what uses them

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- List a package under `devDependencies` when only tests, tooling or build steps use it, and under `dependencies` or `peerDependencies` when shipped code imports it. Shipped code never imports a test package.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Enforcement

<!-- TODO: ruled at `error`, two ways: `no-extraneous-dependencies` allowing `devDependencies` only in test, mock, setup and config files by glob, with `packageDir` covering every manifest a published package uses; and a knix manifest check rejecting known test packages under `dependencies`. The first waits for a ruling on declaring eslint-plugin-import or eslint-plugin-import-x; both are then written from this law's Rule and probed against the declared versions. -->

## Related

- [Build versus buy, in order](build-vs-buy-order.law.draft.md) requires every imported package to be declared; this law rules which field declares it.
