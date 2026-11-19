---
type: "slice"
state: "needs-info"
priority: "candidate"
kind: "enhancement"
cycle: "b7f1314c-908"
provenance: "prompted"
created: "2026-11-19T03:14:50Z"
modified: "2026-11-19T03:14:50Z"
---
# Build the @knix/utils development logger

**Goal:** `@knix/utils/log` and its opt-in `@knix/utils/log/global` entry ship a development-only `log` that names its caller automatically, as the first real release of `@knix/utils` (0.0.1) for the npm publishing proof.

- Signal: [decision log](../decision-log.md) lines 277-284, "The 0.0.1 utility": `@knix/utils` 0.0.1 ships a simple logging utility, written fresh.
- Signal: [decision log](../decision-log.md) lines 285-421 rule its design, from "Logger requirements" through "Where the ga flag lives": import and global forms, names, global install, development-only use and its lint ban, caller naming, `log.scope(owner)`, badge palette and Node colour detection.
- Open: an Angular 22.3.0 development build names classes `_CartService` (probed 2026-11-18), so the logger strips one leading `_` from class names; not yet ruled.
