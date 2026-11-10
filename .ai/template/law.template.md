---
docclass:
  zone: knowledge/law
  suffix: ".law.md"
  required: ["## Rule", "## Examples", "## Why", "## Exceptions", "## Caveat", "## Narrowings", "## Enforcement", "## Related"]
  optional: ["## Examples", "## Exceptions", "## Caveat", "## Narrowings", "## Enforcement", "## Related"]
  ordered: true
  posture: snapshot
  shape:
    "## Rule": bullets
    "## Why": bullets
    "## Enforcement": bullets
metadata:
  version: '1.6.0'
---

# <!-- TODO: the law's name, stated as the instruction. Laws carry no numbers. -->

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. -->

## Rule

<!-- TODO: imperative bullets, stated at the law's own scope: a TypeScript law may name TypeScript syntax, while one framework's form goes in Narrowings. No sources here. Group a scoped part under a bold label, such as "Test files:", used with the same label in Enforcement. -->

## Examples

<!-- TODO: optional. Incorrect and correct code pairs, one pair per Rule bullet that needs one, each in a fenced block with its language. Label each pair with the bold label of the Rule bullet it illustrates, or with that bullet's opening words where it has none, and say in one line what makes the incorrect block wrong. Use neutral package names such as `@acme/dates`. Filled as the law is walked. -->

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

<!-- TODO: the sources, as bullets under bold labels. Each quotes a public source, verified at a pinned commit, tag or version; the link may be that pinned source or its canonical page. A forge link to a file or tree pins its full 40-character commit sha in its URL, never a short sha, branch or tag; the link text never shows the sha. A GitHub line link to a rendered file, such as `.md` or `.mdx`, puts `?plain=1` before `#L` so it opens on that line. `npm run check:law-links` checks both. Label a source the law departs from "Noted disagreement", "Not adopted" or "Partly adopted". No probe-only facts and no inference. -->

## Exceptions

<!-- TODO: optional. Each case the rule deliberately allows, and how that case is marked in code; where nothing marks it, say why. -->

## Caveat

<!-- TODO: optional. A limit of what the rule protects, not a case where it may be broken (that is an exception). -->

## Narrowings

<!-- TODO: optional. One bold-labelled bullet per framework or tool, stating the rule's form there. -->

## Enforcement

<!-- TODO: optional. One bullet per rule: its ID, severity and full options, verbatim, so a config can be matched to it line by line. Say why a rule is enabled explicitly when its preset leaves it off. Where a file-scoped override replaces a rule whose options are a list, give the full replacement list. A law that needs a core rule whose options are a list uses the plugin's copy of it, `@knix-law/<law>-<rule>` with the rule's `no-` prefix dropped, so no other law's entry replaces its list. Where each repository supplies its own entries, give the option shape with `<placeholder>` values. Every enforced check is `error`, and a needed exception takes a disable comment that says why. A codebase adopting a law records its existing violations in the committed suppressions file. A heuristic that can't meet that bar is checked in review, never set to `warn`. For a tool that can't meet the rule, state its fallback: where a disable can't carry a reason, the reason goes in a comment on the line above it, checked in review; where a tool has no suppressions file, a codebase adopting the law fixes or disables its existing violations before the check is turned on. Then known gaps, which may come from probing the rule, and review-only checks last. Verify every config against the versions `packages/law/*/package.json` declares. -->

## Related

<!-- TODO: optional. Sibling laws, linked by bare filename. -->

<!-- TODO: reference-style link definitions for every source, at the end of the file. -->
