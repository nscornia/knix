# Reuse existing utilities

Reach for the project's existing utility before writing your own.

## Rule

When the project already has a utility for a job, use it. Do not write a parallel implementation.

## Exceptions

- The utility's own implementation.
- Trivial platform calls.
- A case the utility cannot express. Meet it by extending the utility, never by bypassing it.

## Related

Whether to build a utility or adopt a third-party one is a separate law, not yet written.
