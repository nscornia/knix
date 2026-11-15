# Ship no debug console output

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- Code that ships to a browser calls `console` only as `console.warn` or `console.error`; delete debug output such as `console.log`, `console.debug` and `console.dir` before merging. Code that never ships to a browser, such as sandboxes, test automation and Node tooling, is exempt by path in the lint config.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Enforcement

- `no-console` at `error`, with `allow: ['warn', 'error']`.
  - Its only option is `allow` (probed).
  - It only suggests removing a call. `--fix` never deletes one (probed).
- Each project turns `no-console` off in an override listing its own non-shipping paths, since knix can't know them.
