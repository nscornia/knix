# Import by name

A unit names each dependency it uses instead of pulling in an aggregate.

## Rule

- **Named imports:** import named members from a package's ES-module entry.
  - Never default-import a library's aggregate object, the default export that bundles every function.
  - Never import a package's CommonJS entry when it ships an ES-module one.
- **Namespace imports:** `import * as ns` is allowed only while every use is a static member access, `ns.name`.
  - Banned: a computed key `ns[k]`, passing or assigning `ns` as a value, and spreading it.
  - Also banned: `Object.keys`, `Object.values` or `Object.entries` of `ns`.
- **Lazy loading:** `import()` names the narrowest ES-module path, a per-function or per-feature module, not the package's main barrel.
- **Publishing:** a library publishes ES modules, not CommonJS compiled from them.
  - It defines `exports` and declares an accurate `sideEffects`.

## Why

Two reasons. Explicitness: naming each member keeps a unit's dependencies visible where it imports them. Size: bundlers drop unused code from ES modules they can analyse statically, and whether they can from CommonJS depends on the bundler and how the module is written. A CommonJS entry, a library's aggregate default export, or a namespace object used as a value can keep the whole library in the bundle, and the build still succeeds. Smaller bundles download faster and cost less CPU. Lodash's chain wrapper assumes the whole library is loaded, so imported by name it type-checks, then fails at runtime once bundled.

- **Static analysis:**
  - Tree shaking "relies on the static structure of ES2015 module syntax" ([webpack, tree shaking][wp-tree-shaking]).
  - "tree shaking works with ECMAScript modules but not with CommonJS modules" ([esbuild API][esbuild-api]).
  - webpack 5 supports "some CommonJs constructs"; on "not analysable code, webpack bails out" ([webpack 5 release][wp5-release]).
- **Cost** ([V8, the cost of JavaScript in 2019][v8-cost]):
  - "the dominant costs of processing scripts are now download and CPU execution time."
  - "Small bundles improve download speeds, lower memory usage, and reduce CPU costs."
- **Lodash chain** (lodash maintainer):
  - On using `chain` with `lodash-es` while tree shaking: "The short answer is you can't." ([lodash#3298][lodash-3298])
  - "chaining assumes a monolithic library state" ([lodash#5692][lodash-5692]).

## Exceptions

- Type-only imports.
- A deliberate package-boundary barrel.
- Aggregates a tool requires.

## Narrowings

- **Angular:** never import `CommonModule`. Use `@if` and `@for`, and import pipes and directives by name.
  - A lint rule flags `CommonModule` imports.
  - Bundle size is not a reason for this narrowing. An AOT compile emits only the pipes a template uses.
- **Lodash:** use `lodash-es` with named imports.
  - Never `lodash`, the CommonJS build.
  - Never `chain` or the `_()` wrapper.
- **webpack Module Federation:** by default, don't share a library. Each build keeps its own tree-shaken copy and deploys on its own schedule.
  - Share a library only when it must be one instance at runtime, or when measured savings outweigh coupling the builds' deployments.
  - A shared library ships whole, whatever the import form, unless the federation runtime's shared tree shaking is in use ([Module Federation, shared][mf-shared]).
  - A shared singleton ties every build sharing it to one version ([webpack, Module Federation][wp-mf]).
    - With `strictVersion`, a mismatch throws at runtime.
    - Without it, a build runs a version it wasn't built against, with only a warning.

## Enforcement

- **Not bundler warnings:** the Angular CLI's CommonJS warning only warns ([build guide][ng-build]).
  - Allow-listing a package silences its deep paths too ([`common-js-usage-warn-plugin.js`][ng-cjs-warn]).
- **`lodash`:** `@knix-law/import-by-name-restricted-imports`, the plugin's copy of core `no-restricted-imports`, at `error` with a `paths` entry, per package ([rule docs][no-restricted-imports]).
- **`lodash-es` default import:** `@knix-law/import-by-name-restricted-syntax`, the plugin's copy of core `no-restricted-syntax`, at `error` on `ImportDefaultSpecifier` and on an `ImportSpecifier` named `default`.
  - Not `no-restricted-imports` with `importNames: ["default"]`. It also reports `import * as _`, which the namespace rule allows ([rule docs][no-restricted-imports]).
- **Namespace used as a value:** a `@knix-law` rule flags each banned use of a namespace binding.
- **CommonJS-only entry:** a `@knix-law` rule reads the resolved package manifest's `type`, `module` and `exports`.
  - `eslint-plugin-lodash`'s `import-scope` doesn't cover this. Its `member` mode accepts `import {map} from 'lodash'` ([rule docs][lodash-import-scope]).

[wp-tree-shaking]: https://github.com/webpack/webpack.js.org/blob/04fe6d689ccfbe7c7097ad3ff96ba2e15e388675/src/content/guides/tree-shaking.mdx
[esbuild-api]: https://esbuild.github.io/api/
[wp5-release]: https://github.com/webpack/webpack.js.org/blob/04fe6d689ccfbe7c7097ad3ff96ba2e15e388675/src/content/blog/2020-10-10-webpack-5-release.mdx
[v8-cost]: https://github.com/v8/v8.dev/blob/031a6578036da033a0c3fb728ec58527345336b6/src/blog/cost-of-javascript-2019.md
[lodash-3298]: https://github.com/lodash/lodash/issues/3298#issuecomment-319978917
[lodash-5692]: https://github.com/lodash/lodash/issues/5692#issuecomment-1729742563
[mf-shared]: https://github.com/module-federation/core/blob/512bef835f1df67fdb967e54084061b8d326b970/apps/website-new/docs/en/configure/shared.mdx
[wp-mf]: https://github.com/webpack/webpack.js.org/blob/04fe6d689ccfbe7c7097ad3ff96ba2e15e388675/src/content/plugins/module-federation-plugin.mdx
[ng-build]: https://github.com/angular/angular/blob/8260542ce03780d158638723ccaf7f52e9708da1/adev/src/content/tools/cli/build.md
[ng-cjs-warn]: https://unpkg.com/@angular-devkit/build-angular@22.2.3/src/tools/webpack/plugins/common-js-usage-warn-plugin.js
[no-restricted-imports]: https://github.com/eslint/eslint/blob/161558ae1391a8649a8d69a8b2c2e555b40121b9/docs/src/rules/no-restricted-imports.md
[lodash-import-scope]: https://github.com/wix-incubator/eslint-plugin-lodash/blob/2d58f5ef9a5fa9b9749c50f0cf6db3d1dbd83a2f/docs/rules/import-scope.md
