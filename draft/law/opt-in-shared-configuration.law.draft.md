# Opt-in shared configuration

New behaviour in shared configuration is something consumers enable, not something they inherit unannounced.

## Rule

Ship each addition to shared configuration as a named unit that consumers opt into.

## Why

Not every consumer wants every addition, and each one relies on the shared layer behaving as it did when they adopted it. An addition that is on by default changes their builds on an upgrade they took for another reason; an opt-in addition keeps the upgrade backward compatible, which is what a minor release promises.

- **Semantic Versioning:** a minor version adds "functionality in a backward compatible manner"; a major version makes "incompatible API changes" ([semver.org][semver]).
- **ESLint** ([semantic versioning policy][eslint-semver]):
  - "A new rule is created" is a minor release.
  - `eslint:recommended` gaining rules that "may result in new linting errors" is a major.

## Exceptions

- Security, compliance and safety rails, but only when declared mandatory and released as a breaking change.

## Narrowings

- **GitLab CI:** ship new jobs as hidden templates that consumers extend.
  - Hidden jobs "are not processed by GitLab CI/CD, but they can be used as templates for reusable configuration" ([GitLab jobs][gitlab-jobs]).
- **Lint packages:** ship optional rule sets as separate entry points.
  - A plugin can "bundle configurations inside a plugin by specifying them under the configs key" ([ESLint plugins][eslint-plugin-configs]).

[semver]: https://semver.org/
[eslint-semver]: https://github.com/eslint/eslint#semantic-versioning-policy
[gitlab-jobs]: https://docs.gitlab.com/ci/jobs/
[eslint-plugin-configs]: https://eslint.org/docs/latest/extend/plugins
