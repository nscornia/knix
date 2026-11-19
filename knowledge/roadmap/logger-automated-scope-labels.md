---
type: "slice"
state: "needs-info"
priority: "candidate"
kind: "enhancement"
cycle: "4ec5a8a2-8e0"
provenance: "prompted"
created: "2026-11-19T03:14:50Z"
modified: "2026-11-19T03:14:50Z"
---
# Label logger scopes automatically

**Goal:** code that uses `log` gets its `log.scope(owner)` label without writing it by hand, through a lint autofix or a build transform that works on Angular without changing its builders.

- Signal: [decision log](../decision-log.md) lines 367-380, "How the logger names its caller": automated labelling is the next thing to prioritize after the logger. The operator's words: "that is the next thing we should prioritize after".
- Open: lint autofix or build transform. A lint autofix was suggested as the route that works on Angular without changing builders.

Blocked by [[utils-log-entry-point]]
