# Deprecate before removing published API

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. -->

## Rule

- Deprecate every published element of a library before removing it: exports, component inputs and outputs, selectors and tokens.
  - A rename deprecates the old name, adds the new one, and removes the old one under the removal gate.
- **Removal gate:** remove a deprecated element in the next major version, or sooner once no verifiable consumer is left.
  - Removal before a major needs approval, in review, from the person the tag's `Owner:` names.
  - The commit body records the consumer search.
- **Tag:** `@deprecated Since <version>. Use {@link <replacement>} instead. Removed in <next major>.0.0, or sooner once no verifiable consumer is left. Owner: <username>.`
  - The since-version is predicted when the tag is written: the latest published version plus this change's bump.
  - The replacement is a link: `{@link …}`, `{@linkcode …}` or `{@linkplain …}`.
    - When nothing replaces the element, `No replacement. <what a consumer does instead>.` takes the place of `Use {@link <replacement>} instead.` The action is required.
  - Both versions are always written. An author without access to the registry or release tags asks someone who has it before merge.
  - The owner is a plain username, with no `@`.
    - When nobody is named, the person deprecating writes their own username. It is never derived later from history.
  - The tag cites no ticket.
- **Orphaned owner:** whoever next works on the element takes it over, and that change rewrites `Owner:` to its own author.
- **Consumers:** new uses of a deprecated element fail CI. Existing uses are recorded once in the committed suppressions file.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

- **A deprecation period with an update path** ([Angular, releases][ng-deprecation-period]):
  - Deprecated APIs remain available through a phase "which lasts a minimum one major version (approximately one year)."
  - "When we announce a deprecation, we also announce a recommended update path." ([Angular, releases][ng-update-path])
  - **Partly adopted:** "the removal of a deprecated API or feature happens only in major release" ([Angular, releases][ng-major-only]).
    - This law also removes sooner, once no verifiable consumer is left and the owner approves.
- **The removal version is stated up front:**
  - Ember's `deprecate`: "`options` should include `id` and `until` properties." ([Ember, `deprecate.ts`][ember-until])
  - Angular's deprecation table had the columns "Deprecated in" and "May be removed in" ([Angular 16.0.0, deprecations][ng-16-table]).
- **A named owner:** a Kubernetes enhancement proposal fills in "Authors" and "Owning-sig" at minimum ([KEP template][kep-owner]).
- **A squashed commit credits the merge request's creator and the squasher** ([GitLab, squash and merge][gitlab-squash]):
  - "Author: User that created the merge request"
  - "Committer: User who initiated the squash"
- **Consumers need a check:** "TypeScript doesn't report type errors for deprecated code on its own." ([`no-deprecated`][no-deprecated-why])
- **Recording existing uses:**
  - "Only rules configured as `"error"` are suppressed." ([ESLint, suppressions][eslint-suppressions-error])
  - The suppressions file "contains the list of rules that have been suppressed. You should commit this file to the repository" ([ESLint, suppressions][eslint-suppressions-file]).

## Enforcement

- **Tag format:** [`jsdoc/match-description`][jsdoc-match-description] at `error`, from eslint-plugin-jsdoc:
  - `{ contexts: ['any'], mainDescription: false, nonemptyTags: false, tags: { deprecated: '<pattern>' } }`.
  - The pattern: `^Since\s+\d+\.\d+\.\d+\.\s+(?:Use\s+\{@link(?:code|plain)?\s+[^\}\s][^\}]*\}\s+instead\.|No\s+replacement\.\s+\S[^]*?\.)\s+Removed\s+in\s+\d+\.0\.0,\s+or\s+sooner\s+once\s+no\s+verifiable\s+consumer\s+is\s+left\.\s+Owner:\s+[a-z0-9._\-]+\.$`.
  - This is the only `tags.deprecated` pattern for the rule: a second entry replaces the first rather than adding to it (probed).
  - The plugin compiles patterns with the `v` flag only ([rule docs][jsdoc-v-flag]), so `-` in a class is escaped.
  - It accepts the tag on one line or wrapped at any space, and rejects the following (probed):
    - a bare `@deprecated` or a bare `No replacement.`;
    - a replacement that is not a link, or an empty `{@link }`;
    - a missing `Owner:`, or `Owner: @name.`.
- **Tag links and versions:** planned, not yet built: `@knix-law/valid-deprecated-tag`, a typed rule at `error` for what the pattern cannot check.
  - The replacement link resolves in the file's scope, `.` and `#` members included.
  - Its target is not deprecated, following aliases and re-exports.
  - Links in a `No replacement.` action resolve.
  - The `Removed in` major is the `Since` major plus one.
  - It marks link-only imports used, which `@typescript-eslint/no-unused-vars` otherwise reports (probed).
- **Overdue removals:** the release step fails a major release while any `@deprecated` tag names that major or an earlier one. <!-- TODO: the mechanism, once a release tool is verified to expose the next version before publishing. -->
  - The release step is the only point where the version being released is always known.
  - The owner removes the element, or records a described exception for it.
  - Exceptions live in a committed file the release check reads.
    - Each entry names the element, the major it is kept past, the reason and the owner.
    - An entry the check does not use fails it, like an unused disable.
- **Not used:** `jsdoc/no-undefined-types` reports a missing name, but misses a missing member and a mismatched major (probed).
- **Consumers:** [`@typescript-eslint/no-deprecated`][no-deprecated] at `error` (type-aware).
  - Only typescript-eslint's `strict-type-checked` and `all` presets include it, so it is enabled explicitly.
  - Existing uses are recorded with `eslint --suppress-rule @typescript-eslint/no-deprecated` ([ESLint, suppressions][eslint-suppress-rule]).
  - Suppressions count per file and rule, not per element, so the removal search still looks for each element's name.
- **Known gaps (probed):**
  - A `@deprecated` on `export { a as b }` is not seen; `export const b = a` is.
  - A named re-export of a deprecated element reports in the library; `export *` does not.
- **Templates:** <!-- TODO: pending the operator's decision on whether knix states the template generator generically. angular-eslint 22.6.0 has no template deprecation rule. -->
- Review checks:
  - The consumer search in the commit body, and the owner's approval, for a removal before a major.
  - An `Owner:` rewritten by the change that finds the owner gone.

## Related

- [Explain every disable](explain-every-disable.law.draft.md) owns the checks on a disable that keeps a deprecated use.
- [Own your public types](own-your-public-types.law.draft.md) decides what a library publishes.
- [Publish only the tokens consumers use](publish-only-the-tokens-consumers-use.law.draft.md) decides which tokens a design system publishes.

[ng-deprecation-period]: https://github.com/angular/angular/blob/38afab7a24488c568e28ef969e8c615551b0e375/adev/src/content/reference/releases.md?plain=1#L116
[ng-update-path]: https://github.com/angular/angular/blob/38afab7a24488c568e28ef969e8c615551b0e375/adev/src/content/reference/releases.md?plain=1#L122
[ng-major-only]: https://github.com/angular/angular/blob/38afab7a24488c568e28ef969e8c615551b0e375/adev/src/content/reference/releases.md?plain=1#L123
[ember-until]: https://github.com/emberjs/ember.js/blob/6772f7b2ba13521ce0d1b78e6e48906ecf16b03c/packages/@ember/debug/lib/deprecate.ts#L175
[ng-16-table]: https://github.com/angular/angular/blob/03c9bf2353148a8f5cb57a9beb21b4ea54f11038/aio/content/guide/deprecations.md?plain=1#L44
[kep-owner]: https://github.com/kubernetes/enhancements/blob/a904b50283fe82d0d4f46988d0fd9d1a35a86c25/keps/NNNN-kep-template/README.md?plain=1#L26-L27
[gitlab-squash]: https://gitlab.com/gitlab-org/gitlab/-/blob/311fea1fc538c493e1f1fc92232024455d7c4388/doc/user/project/merge_requests/squash_and_merge.md#L37-38
[no-deprecated-why]: https://github.com/typescript-eslint/typescript-eslint/blob/4ad6b7553781fa3c93fc26642d7219d2e6624504/packages/eslint-plugin/docs/rules/no-deprecated.mdx?plain=1#L17-L18
[no-deprecated]: https://typescript-eslint.io/rules/no-deprecated/
[eslint-suppressions-error]: https://github.com/eslint/eslint/blob/4637f9827a1ba137498eaee70957850621082815/docs/src/use/suppressions.md?plain=1#L15
[eslint-suppress-rule]: https://github.com/eslint/eslint/blob/4637f9827a1ba137498eaee70957850621082815/docs/src/use/suppressions.md?plain=1#L26-L29
[eslint-suppressions-file]: https://github.com/eslint/eslint/blob/4637f9827a1ba137498eaee70957850621082815/docs/src/use/suppressions.md?plain=1#L40
[jsdoc-match-description]: https://github.com/gajus/eslint-plugin-jsdoc/blob/44a3c45d39de9ad5748e4a185a18e6382a6fb99e/docs/rules/match-description.md
[jsdoc-v-flag]: https://github.com/gajus/eslint-plugin-jsdoc/blob/44a3c45d39de9ad5748e4a185a18e6382a6fb99e/docs/rules/match-description.md?plain=1#L34-L36
