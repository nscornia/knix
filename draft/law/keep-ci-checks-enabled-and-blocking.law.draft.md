# Keep CI checks enabled and blocking

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- Keep every CI job that checks the change itself — lint, type-check, unit tests, build — enabled and blocking. Never comment one out or set `allow_failure` on it; when a gate fails, fix the code, or narrow the check with a described disable.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

## Enforcement

- Review only.

## Related

- [Explain every disable](explain-every-disable.law.draft.md) governs the described disable that narrows a failing check instead of turning its job off.
