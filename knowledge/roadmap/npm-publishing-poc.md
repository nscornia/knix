---
type: "slice"
state: "needs-info"
priority: "candidate"
kind: "enhancement"
cycle: "e1bbab25-346"
provenance: "prompted"
created: "2026-11-17T16:00:07Z"
modified: "2026-11-19T03:14:50Z"
---
# Prove the public npm publishing process

**Goal:** a knix package publishes to the public npm registry from GitHub Actions through Changesets and npm trusted publishing, with no stored npm token, and the steps are recorded so ecorn can adopt the same process.

- Signal: [AGENTS.md](../../AGENTS.md) line 9 sets publishing "from GitHub Actions with Changesets, through npm trusted publishing. No stored npm token." No `.github/workflows/` exists yet.
- Signal: [AGENTS.md](../../AGENTS.md) line 8 keeps every package `private: true` at `0.0.0` until its first real release. All six packages are empty placeholders, so the POC needs a decision on what it publishes.
- Bootstrap: a trusted publisher needs an existing package. The [`npm trust` docs](https://docs.npmjs.com/cli/v11/commands/npm-trust) say "The package you're configuring must already exist on the npm registry", and no pending-publisher feature exists. So each package needs one publish by another credential first. This was verified 2026-11-15 and should be re-checked.
  - That first publish conflicts with line 8's rule against an empty placeholder, so it needs a ruling.
- Floors: npm 11.5.1 or later to publish, 11.15.0 or later for `npm trust`, Node 22.14.0 or later, and `id-token: write` on the workflow ([npm trusted publishers](https://docs.npmjs.com/trusted-publishers)).
- Provenance: generated only from a public repository, and `repository.url` must match the GitHub repository exactly ([npm trusted publishers](https://docs.npmjs.com/trusted-publishers)).
- Open: whether `changesets/action` v2 or a plain `changeset publish` step publishes through OIDC. Reported pitfall: `actions/setup-node` with `registry-url` writes a token `.npmrc` that overrides OIDC.
- Open: whether a first publish under a non-`latest` dist-tag still becomes `latest`.

Blocked by [[utils-log-entry-point]]
