# Opt-in shared configuration

New behaviour in shared configuration is something consumers enable, not something they inherit unannounced.

## Rule

Ship each addition to shared configuration as a named unit that consumers opt into.

## Why

Not every consumer wants every addition, and each one relies on the shared layer behaving as it did when they adopted it. An addition that is on by default changes their builds on an upgrade they took for another reason; an opt-in addition keeps the upgrade backward compatible, which is what a minor release promises.

Semantic Versioning defines a minor version as adding "functionality in a backward compatible manner" and a major version as making "incompatible API changes" ([semver.org][semver]). The exception below is released as a major for that reason.

## Exceptions

- Security, compliance and safety rails, but only when declared mandatory and released as a breaking change.

## Narrowings

- **GitLab CI:** ship new jobs as hidden templates that consumers extend.
- **Lint packages:** ship optional rule sets as separate entry points.

[semver]: https://semver.org/
