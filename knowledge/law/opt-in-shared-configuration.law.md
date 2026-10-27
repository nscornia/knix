# Opt-in shared configuration

New behaviour in shared configuration is something consumers enable, not something they inherit unannounced.

## Rule

Ship each addition to shared configuration as a named unit that consumers opt into.

## Exceptions

- Security, compliance and safety rails, but only when declared mandatory and released as a breaking change.

## Narrowings

- **GitLab CI:** ship new jobs as hidden templates that consumers extend.
- **Lint packages:** ship optional rule sets as separate entry points.
