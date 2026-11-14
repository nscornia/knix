# Build versus buy, in order

Before writing a helper, look for one that already exists, in a fixed order.

## Rule

- **Order:** check, in order, before writing a helper:
  1. a platform feature every supported target has;
  2. a library your manifest declares;
  3. a new dependency;
  4. custom code.
- **Small needs:** a need you can write and test in a few lines is written, not depended on.
- **New dependency:** justify it on:
  - necessity, maintenance (activity and a release within 12 months) and open advisories;
  - its own dependencies, size and license;
  - that the package is the genuine one.
- **Manifest:** never import a package your manifest doesn't declare.
  - An undeclared import "may work locally but can break after dependencies are re-installed" ([`n/no-extraneous-import`][n-extraneous]).
- **Swap:** replacing code with a library call keeps its behaviour, defaults and edge cases included.
  - Example: lodash `get(object, path, fallback)` returns `fallback` only for `undefined`.
    - A hand-rolled getter ending in `|| fallback` also replaces `''`, `0` and `false`, so a straight swap changes behaviour.

## Why

Every dependency is code you ship, patch and keep current, along with everything it depends on; every hand-written helper is code you keep correct. A platform feature all your targets support costs neither, and a tiny need is cheaper to write than to depend on, so checking in this order picks the cheapest option that fits. A swap must keep behaviour, because a library's defaults and edge cases often differ from the code it replaces.

- **Upkeep** ([OWASP Top 10, A03:2025][owasp-a03]):
  - "Reduce attack surface by removing unused dependencies, unnecessary features, components, files, and documentation."
  - "Monitor for libraries and components that are unmaintained or do not create security patches for older versions."
  - "Track not just your direct dependencies, but their (transitive) dependencies, and so on."
- **Indirect dependencies:** "Flaws in indirect dependencies are just as bad for your program as flaws in direct dependencies." ([Russ Cox][cox-deps])
- **Evaluation:** the OpenSSF guide covers necessity, authenticity against typosquatting, and activity and releases "within the previous 12 months" ([OpenSSF evaluation guide][ossf-eval]).
- **Platform features:**
  - Baseline calls a feature "Newly available" once it is "supported by all of the core browsers" ([web.dev Baseline][baseline]).
  - When "you know your target browser clearly, then you may not need Lodash/Underscore" ([You Don't Need Lodash/Underscore][ydnl]).
- **Tiny needs:**
  - "A little copying is better than a little dependency." ([Russ Cox][cox-deps])
  - When a tiny package was unpublished, npm saw "hundreds of failures per minute" across its dependents ([npm blog, left-pad][left-pad]).
- **Swaps:**
  - Native alternatives to Lodash are "not a 1:1 comparison" ([You Don't Need Lodash/Underscore][ydnl]).
  - Lodash `get` returns the default only when the result is `undefined` ([`lodash-es` 4.18.1 `get.js`][lodash-get]).

## Exceptions

- **Security primitives:** never hand-write one, however small. Use the platform's, or a vetted library where the platform lacks one.
  - **Cryptography:** ad-hoc primitives are "almost certain" to be vulnerable "to attacks that are well understood by cryptographers" ([CWE-1240][cwe-1240]).
  - **Secret randomness:**
    - Non-cryptographic generators "**must not** be used for anything security critical" ([OWASP cryptographic storage][owasp-crypto]).
    - Never use `Math.random()` "for anything related to security" ([MDN][mdn-random]).
  - **Secret comparison:** `crypto.timingSafeEqual` "does not leak timing information that would allow an attacker to guess one of the values" ([Node.js][node-tse]).
  - **HTML sanitization:**
    - "OWASP recommends DOMPurify for HTML Sanitization" ([OWASP XSS prevention][owasp-xss]).
    - The platform Sanitizer API is not Baseline yet ([web-features][wf-sanitizer]).

## Enforcement

- **Manifest:** `n/no-extraneous-import` at `error` ([rule docs][n-extraneous]).
- **Platform features:**
  - `e18e/ban-dependencies` at `error` flags packages with community-recommended replacements ([`@e18e/eslint-plugin`][e18e]).
  - `compat/compat` at `error` flags APIs the declared browserslist targets lack ([`eslint-plugin-compat`][compat]).
- **Authenticity (suggested):** `npm audit signatures` in CI verifies registry signatures and provenance attestations ([npm docs][npm-audit]).
- **Security primitives:** review only. No lint rule detects a hand-written primitive.
- **Everything else:** review only.

## Related

- [Reuse existing utilities](reuse-existing-utilities.law.draft.md) covers designated utilities, from the codebase or an installed shared package, which come before this order applies.
- [Use the design system](use-the-design-system.law.draft.md) covers UI components, which come before this order applies.
- [Build markup in templates](build-markup-in-templates.law.draft.md) sends content that must arrive as HTML through the sanitizer this law names.

[n-extraneous]: https://github.com/eslint-community/eslint-plugin-n/blob/6e1353be12a49ca570b750eb7386215d881ee6a3/docs/rules/no-extraneous-import.md
[owasp-a03]: https://github.com/OWASP/Top10/blob/3a31f35346c3f4e90f350395124382fa53af2afe/2025/docs/en/A03_2025-Software_Supply_Chain_Failures.md
[cox-deps]: https://research.swtch.com/deps
[ossf-eval]: https://best.openssf.org/Concise-Guide-for-Evaluating-Open-Source-Software
[baseline]: https://web.dev/baseline
[ydnl]: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore
[left-pad]: https://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm
[lodash-get]: https://unpkg.com/lodash-es@4.18.1/get.js
[e18e]: https://github.com/e18e/eslint-plugin
[compat]: https://github.com/amilajack/eslint-plugin-compat
[npm-audit]: https://docs.npmjs.com/cli/v11/commands/npm-audit
[cwe-1240]: https://cwe.mitre.org/data/definitions/1240.html
[owasp-crypto]: https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html
[mdn-random]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
[node-tse]: https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b
[owasp-xss]: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
[wf-sanitizer]: https://github.com/web-platform-dx/web-features/blob/3bd390f10ed05626830786c4e7c1d92bd0bcdc43/features/sanitizer.yml.dist
