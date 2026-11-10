# knix

Monorepo for three npm scopes: `@knix/*` (framework-agnostic TypeScript utilities), `@knix-law/*` (ESLint and Stylelint tooling for the code-quality laws in `knowledge/law/`) and `@knix-ai/*` (a shareable ecorn AI-config baseline).

## Decisions

- **Tooling:** npm workspaces plus Changesets, versioning each package independently. No Nx, Turborepo or git submodules until build times justify one.
- **Unreleased packages:** stay `private: true` at `0.0.0` until their first real release, so Changesets cannot publish an empty placeholder.
- **Publishing:** from GitHub Actions with Changesets, through npm trusted publishing. No stored npm token.
- **`@knix/*`:** one tree-shakable entry point per area. Each entry point depends only on what it uses, and every peer dependency is optional.
- **`@knix-ai/config`:** a complete, standalone ecorn baseline on `@ecorn/config`. It never references another baseline; consumers compose baselines at build time.

## Lint rules

- **Tool versions:** verify every rule, plugin and probe against the versions `packages/law/*/package.json` declares, and cite only plugins whose `peerDependencies` accept them.
- **ESLint IDs:** `@knix-law/<rule>`, and `@knix-law/template/<rule>` for template rules. `meta.name` is the package name and `meta.namespace` the prefix.
- **Stylelint IDs:** `@knix-law/<rule>`.
- **Source layout:** grouped by law as `rules/<law>/{rule,spec,doc}`; folders need not mirror the ID prefixes.
- **Laws:** each law has one source file, `knowledge/law/<slug>.law.md`, identified by its slug. Rule docs link to it rather than restating it.
  - `.ai/template/law.template.md` declares its required sections.
  - A law under review lives in `draft/law/`, outside the template's checks, with its row in `draft/law/README.md`.
  - No law is approved until every draft has been walked and the reviewing peer session has explicitly confirmed the walk is done.
    - Then each moves to `knowledge/law/` with its row.
  - A law's index row states nothing its `## Rule` does not.
- **Specification:** write rules and spec cases from the law text alone, never from another project's rule source, tests or fixtures.

## AI config

Edit `.ai/` and this preamble, then run `ecorn build` and `ecorn validate`. Host output (`CLAUDE.md`, `.claude/`, `.opencode/`) is generated and gitignored.

<!-- ecorn:generated-below — do not edit below this line -->

## Monorepo packages

The workspace members of this repo and what each one is built in.

| Package | Languages | Frameworks |
|---|---|---|
| `packages/ai/config` | typescript, javascript | — |
| `packages/law/eslint-config` | typescript, javascript | — |
| `packages/law/eslint-plugin` | typescript, javascript | — |
| `packages/law/stylelint-config` | typescript, javascript | — |
| `packages/law/stylelint-plugin` | typescript, javascript | — |
| `packages/utils` | typescript, javascript | — |

---

## Detailed rules

Read the linked file before working on files that match the pattern.

| Rule | Applies to | File |
|---|---|---|
| repository-boundary | `**/*` | `.ai/instructions/repository-boundary.md` |

---

What each one covers in full: `.ai/instructions/_index.md`.
