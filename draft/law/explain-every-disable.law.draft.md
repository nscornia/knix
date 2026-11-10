# Explain every disable

A disable turns a check off where it would otherwise report a problem, so it names that check, says why, and goes once nothing needs it.

## Rule

- A disable comment names each rule it disables, never a bare disable that silences every rule.
- A disable comment says why, after ` -- ` in the same comment.
  - Where a tool's disable can't carry a reason, the reason goes in a comment on the line above it.
- Remove a disable or inline config comment that changes nothing:
  - a disable that suppresses no problem;
  - an inline config that sets a rule to the value it already has.

## Why

A disable is an exception to static analysis. Without a reason, the next reader can't tell a deliberate exception from a silenced bug, so it can be neither reviewed nor safely removed. A bare disable silences every rule, including any added after it was written, so it hides more than the problem it was meant for. A disable that no longer suppresses anything still reads as a live exception, and it hides the next problem its rule finds there.

- **Reasons:**
  - [ESLint RFC, description in directive comments][eslint-rfc-description]:
    - "Directive comments make exceptions for static analysis."
    - "The explanation of why you made the exception here helps to maintain the code."
  - Stylelint's `report*` checks "provide extra validation for `stylelint-disable` comments. This can help enforce useful and well-documented disables." ([Stylelint, configure][stylelint-report])
- **Bare disables:** "`eslint-disable` directive-comments disable all rules by default. This may cause to overlook some ESLint warnings unintentionally." ([`no-unlimited-disable`][no-unlimited-disable])
- **Stale disables:**
  - Disables: "As code changes, it's possible for these directives to no longer be needed" ([ESLint, configuration files][eslint-unused-disables]).
  - Inline configs: "it's possible for these directives to no longer be different from what was already set" ([ESLint, configuration files][eslint-unused-inline]).

## Enforcement

- **ESLint:**
  - [`@eslint-community/eslint-comments/require-description`][require-description] at `error`: `{ ignore: [] }`.
    - It is not in the plugin's `recommended` preset, so it is enabled explicitly.
  - [`@eslint-community/eslint-comments/no-unlimited-disable`][no-unlimited-disable] at `error`.
  - `linterOptions.reportUnusedDisableDirectives: "error"`, since it "defaults to `"warn"`" ([ESLint, configuration files][eslint-unused-disables-default]).
    - A command-line flag overrides it ([ESLint, configuration files][eslint-unused-disables-cli]), so CI passes none.
  - `linterOptions.reportUnusedInlineConfigs: "error"`, since it defaults to `"off"` ([ESLint, configuration files][eslint-linter-options]).
  - All four report on Angular templates as well as scripts (probed on angular-eslint 22.6.0).
- **Stylelint:** `[true, { severity: "error" }]` for each [`report*`][stylelint-report-options] check:
  - [`reportDescriptionlessDisables`][stylelint-report-checks], with the reason after ` -- ` ([Stylelint, ignoring code][stylelint-description]).
  - [`reportNeedlessDisables`][stylelint-report-checks].
  - [`reportInvalidScopeDisables`][stylelint-report-checks], which reports a disable naming a rule the configuration doesn't set.
  - [`reportUnscopedDisables`][stylelint-unscoped], which reports a disable naming no rule.
  - Known gap: Stylelint's suppressions file also records descriptionless-disable reports, so adopting a law through it grandfathers undescribed disables (probed).
- **Vale:** its comment controls can't carry a reason, so the reason goes in a comment on the line above, checked in review.
  - `vale off` and `vale on` must match exactly ([`file.go`][vale-on-off]), and a rule control ends at its value ([`file.go`][vale-control]).
- Review checks:
  - That each reason says why the exception is safe, since the tools check only that one is present.
  - That a Vale `vale off` is scoped to the rules it means, using a rule control.

## Related

- [Type values precisely](type-values-precisely.law.draft.md) owns `ban-ts-comment`, which governs `@ts-expect-error` and `@ts-ignore`.
- These laws each take a described disable for a needed exception:
  - [Assert only what the checker cannot know](assert-only-what-the-checker-cannot-know.law.draft.md);
  - [Export only what another module imports](export-only-what-another-module-imports.law.draft.md);
  - [Use the design system](use-the-design-system.law.draft.md).

[eslint-rfc-description]: https://github.com/eslint/rfcs/blob/93824bf80557507369728624ae7e3fa794f784ac/designs/2019-description-in-directive-comments/README.md?plain=1#L13
[stylelint-report]: https://github.com/stylelint/stylelint/blob/bc06c7cdb1413de3d8dc939b33af138ab7e59df1/docs/user-guide/configure.md?plain=1#L799
[stylelint-report-options]: https://github.com/stylelint/stylelint/blob/bc06c7cdb1413de3d8dc939b33af138ab7e59df1/docs/user-guide/configure.md?plain=1#L808-L817
[stylelint-report-checks]: https://github.com/stylelint/stylelint/blob/bc06c7cdb1413de3d8dc939b33af138ab7e59df1/docs/user-guide/configure.md?plain=1#L841-L871
[stylelint-unscoped]: https://github.com/stylelint/stylelint/blob/bc06c7cdb1413de3d8dc939b33af138ab7e59df1/docs/user-guide/configure.md?plain=1#L883-L885
[stylelint-description]: https://github.com/stylelint/stylelint/blob/bc06c7cdb1413de3d8dc939b33af138ab7e59df1/docs/user-guide/ignore-code.md?plain=1#L69-L74
[no-unlimited-disable]: https://github.com/eslint-community/eslint-plugin-eslint-comments/blob/de11b0e6db111ca9b605661f38521777e99d52bd/docs/rules/no-unlimited-disable.md?plain=1#L7
[require-description]: https://github.com/eslint-community/eslint-plugin-eslint-comments/blob/de11b0e6db111ca9b605661f38521777e99d52bd/docs/rules/require-description.md?plain=1#L5-L8
[eslint-unused-disables]: https://github.com/eslint/eslint/blob/4637f9827a1ba137498eaee70957850621082815/docs/src/use/configure/configuration-files.md?plain=1#L483
[eslint-unused-disables-default]: https://github.com/eslint/eslint/blob/4637f9827a1ba137498eaee70957850621082815/docs/src/use/configure/configuration-files.md?plain=1#L499
[eslint-unused-disables-cli]: https://github.com/eslint/eslint/blob/4637f9827a1ba137498eaee70957850621082815/docs/src/use/configure/configuration-files.md?plain=1#L501
[eslint-unused-inline]: https://github.com/eslint/eslint/blob/4637f9827a1ba137498eaee70957850621082815/docs/src/use/configure/configuration-files.md?plain=1#L508
[eslint-linter-options]: https://github.com/eslint/eslint/blob/4637f9827a1ba137498eaee70957850621082815/docs/src/use/configure/configuration-files.md?plain=1#L83
[vale-on-off]: https://github.com/vale-cli/vale/blob/d7a379da688e3ec07138ef94e4f0f0889954d617/internal/core/file.go#L749-L751
[vale-control]: https://github.com/vale-cli/vale/blob/d7a379da688e3ec07138ef94e4f0f0889954d617/internal/core/file.go#L24
