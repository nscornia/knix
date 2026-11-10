---
type: "slice"
state: "needs-info"
priority: "candidate"
kind: "enhancement"
cycle: "6d9809a7-0dd"
provenance: "prompted"
created: "2026-10-27T14:45:21Z"
modified: "2026-10-27T14:45:21Z"
---
# Build the @knix/utils empty-value entry point

**Goal:** `@knix/utils` ships an empty-value entry point (the nullable type), and the reuse-existing-utilities law links to it as its empty-values example.

- Signal: [reuse-existing-utilities](../../draft/law/reuse-existing-utilities.law.draft.md) line 11 names "empty values" in its ruled Why with no supporting example; the operator chose to link the knix utility once it exists rather than leave a TODO in the law.
- Depends on the open question of whether knix owns `prefer-nullable` and `prefer-value-of`, with type name and import source as options defaulting to `@knix/utils`.
