---
name: repository-boundary
type: instruction
description: What may enter this public repository — one-way dependencies, no organization-specific content, code written fresh
tier: file-scoped
scope:
  globs: ['**/*']
metadata:
  version: '1.0.0'
---

# Repository boundary

knix is public and organization-neutral. These rules govern every tracked file, commit message, pull request and issue.

- **Dependencies point one way.** Other repositories may depend on published knix packages. knix never depends on, imports, links to or names them.
- **No organization-specific content.** Never write an employer's or client's name, product, library, host, registry or internal path. A machine-local denylist names the specific terms, and local hooks block them at write, commit, push and pack. Never copy that list into the repository.
- **Write fresh.** Never copy code, docs, tests or fixtures from an employer-owned source. Moving existing code needs the operator's explicit clearance.
- **Public registry only.** `.npmrc` pins installs to `registry.npmjs.org`, so the lockfile names no other host.
