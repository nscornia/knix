# Reuse existing utilities

Reach for the project's existing utility before writing your own.

## Rule

When the project already has a utility for a job, use it. Do not write a parallel implementation.

## Why

Cross-cutting concerns such as dates, URLs and empty values carry requirements that are easy to miss, and each hand-written copy can miss a different one. A shared implementation gets them right once, is fixed in one place, and behaves the same everywhere.

- **Dates:** `Date.parse` reads a date-only string as UTC but a date-time string as local time ([MDN `Date.parse`][date-parse]). `toLocaleTimeString` uses the local time zone and, without a locale, the default locale ([MDN `toLocaleTimeString`][to-locale-time]).
- **URLs:** `encodeURI` leaves URL syntax characters in place, so a dynamic segment needs `encodeURIComponent` instead ([MDN `encodeURI`][encode-uri]).
- **Principle:** "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system." ([The Pragmatic Programmer, tips][pragprog-tips])

## Exceptions

- The utility's own implementation.
- Trivial platform calls.
- A case the utility cannot express. Meet it by extending the utility, never by bypassing it.

## Related

- [Build versus buy, in order](build-vs-buy-order.law.md) governs what to do when no project utility fits.

[date-parse]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
[to-locale-time]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
[encode-uri]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
[pragprog-tips]: https://pragprog.com/tips/
