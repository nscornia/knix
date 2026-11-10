# One term, one concept, per bounded context

Readers take a new word to mean a new thing, so within a bounded context each concept has one name and each name one concept.

## Rule

- Each bounded context keeps a glossary: term, definition, synonyms to avoid.
  - Each context's glossary is one machine-readable file kept beside that context's code.
  - The lint for its terms is generated from that file.
  - CI fails when the generated config is stale.
- **Shared glossaries:**
  - A context's glossary inherits every shared glossary above it and adds its own terms and avoid-lists.
  - It changes an inherited term only through a declared override that says why.
  - A shared glossary may lock a term against override, and the generator reports every override.
  - A term enters a shared glossary only when it means the same in every context beneath it.
- Identifiers, UI text, documentation and commit/MR prose use the glossary's term.
- One name per concept, and one concept per name.
- A rename changes every identifier, file name and string named after the old name, in the same change.
  - Names that state a role (`source`, `target`) are exempt.
- A word from another context, a library or a protocol (ARIA `role`, OAuth `scope`) is not a synonym. A second vocabulary appears only in the boundary adapter that translates it.

## Why

Readers take a new word to mean a new thing. Two names for one concept send them looking for a difference that isn't there, and one name for two concepts hides a difference that is. People rarely pick the same name twice: in one study, two developers chose the same name a median of 6.9% of the time. A glossary makes each choice once and lets a tool check it. The glossary belongs to a bounded context, because one word can rightly mean different things in different parts of a large system. A single global list would ban correct uses, which is why Google's API guidance keeps no list of names to avoid.

- **One term, one concept:**
  - "use that term consistently across products and services, tools, websites, and marketing communications. Aim for one term, one concept." ([Microsoft Writing Style Guide][ms-terms])
  - "APIs **should** endeavor to use the same name for the same concept and different names for different concepts" ([AIP-140][aip-140]).
  - "Avoid name overloading. Use different names for different concepts." ([AIP-190][aip-190-overloading])
- **Close concepts stay apart** ([GitLab word list][gitlab-roles]):
  - "Do not use **roles** and **permissions** interchangeably. Each user is assigned a role. Each role includes a set of permissions."
- **The code speaks the same language** ([Evans, DDD Reference 2015][evans-ddd]):
  - "Speak a ubiquitous language within an explicitly bounded context."
  - "The terminology of day-to-day discussions is disconnected from the terminology embedded in the code".
  - "Within a single bounded context, language can be fractured in ways that undermine efforts to apply sophisticated modeling."
- **Per context, not global:**
  - "Different groups of people will use subtly different vocabularies in different parts of a large organization." ([Fowler, Bounded Context][fowler-bounded-context])
  - "There is no definitive list of names to avoid, as every name must be evaluated in the context of other names." ([AIP-190][aip-190-no-list])
- **Names diverge unless agreed** ([Feitelson et al.][feitelson-names]):
  - "the probability that two developers would select the same name is low"
  - "in the 47 instances in our experiments the median probability was only 6.9%"

## Enforcement

- **Generator:** planned, not yet built. It reads each context's glossary file and writes the cspell and Vale config below.
  - CI regenerates the config and fails on any difference.
  - It fails when an override targets a locked term, and prints every override with its reason.
- **Single-word terms:** cspell, over code, docs and commit messages.
  - Each avoided word becomes a `flagWords` entry, `<avoided>-><term>`, so the report names the fix.
  - A context's glossary becomes an `overrides` entry, `filename: "**/<context>/**"`, whose `flagWords` add to the inherited ones (probed).
  - A declared override drops an inherited term through that entry's `ignoreWords` (probed).
  - Commit messages are checked through `cspell lint stdin` in the commit-msg hook.
  - Known gaps (probed): multi-word terms, and a compound that is itself a dictionary word, such as `myClient`.
- **Multi-word terms:** Vale, over docs, code comments and commit messages.
  - Each glossary becomes a `substitution` style at `level: error`, with `ignorecase: true` and one `swap` entry per avoided phrase.
  - Each context is a `.vale.ini` section, `[**/<context>/**]`, listing every inherited glossary's style and its own.
    - A section glob without the leading `**/` matches nothing, and a matching section replaces the general one's styles (probed).
  - A declared override gets the context's own copy of the inherited style, without that term.
  - Known gap (probed): string literals in code, so multi-word terms in UI strings are checked in review.
- **Fallbacks:**
  - Neither tool has a suppressions file, so an adopting codebase fixes or disables existing violations before enabling them.
  - A cspell disable takes ` -- <why>`; nothing requires one, so its presence is checked in review.
  - A Vale disable is scoped to one term, `<!-- vale <Style>.Terms["<phrase>"] = NO -->` ([`file.go`][vale-control-match]), with its reason on the line above.
- **Renames:** checked in review.

[ms-terms]: https://github.com/MicrosoftDocs/microsoft-style-guide/blob/c6945c32294e845a84b192a094fb1b7c2c452a6a/styleguide/word-choice/use-technical-terms-carefully.md?plain=1#L27
[aip-140]: https://github.com/aip-dev/google.aip.dev/blob/2ccc61a4e09882bdd63aea1a42dceebc37bf3bd5/aip/general/0140.md?plain=1#L52-L53
[aip-190-overloading]: https://github.com/aip-dev/google.aip.dev/blob/2ccc61a4e09882bdd63aea1a42dceebc37bf3bd5/aip/general/0190.md?plain=1#L45
[aip-190-no-list]: https://github.com/aip-dev/google.aip.dev/blob/2ccc61a4e09882bdd63aea1a42dceebc37bf3bd5/aip/general/0190.md?plain=1#L51-L52
[gitlab-roles]: https://gitlab.com/gitlab-org/gitlab/-/blob/194ebca2ef8d04254ecaf8fe7cc906495664a5d6/doc/development/documentation/styleguide/word_list.md#L2279
[evans-ddd]: https://www.domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf
[fowler-bounded-context]: https://martinfowler.com/bliki/BoundedContext.html
[feitelson-names]: https://arxiv.org/abs/2103.07487
[vale-control-match]: https://github.com/vale-cli/vale/blob/d7a379da688e3ec07138ef94e4f0f0889954d617/internal/core/file.go#L28
