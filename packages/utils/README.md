# @knix/utils

Framework-agnostic TypeScript utilities, one tree-shakable entry point per area. Today the one area is `@knix/utils/log`, a development-only logger.

## `@knix/utils/log`

A logger that prefixes each message with the name of the function or method that called it, and links the DevTools console to your code rather than to the logger.

**Development only.** The logger exists to debug; production code never calls it. Load it in development builds only (see Setup).

```ts
import { log } from '@knix/utils/log';

class CartService {
  add(item: string) {
    log.log('added', item); // [add] added apple
    log.scope(this).warn('low stock'); // [CartService.add] low stock
    return log.tap(item.trim()); // logs [add] apple, returns the value
  }
}
```

- **Levels:** `log.log`, `log.warn`, `log.error`.
- **Badges:** `log.red`, `log.yellow`, `log.green`, `log.cyan`, `log.blue`, `log.magenta`, `log.gray`. A coloured label in browsers and in a Node terminal; plain `[name]` where Node prints without colour.
- **`log.scope(owner)`:** returns a logger bound to a label. `owner` is a string, a class or an instance; a class or instance gives its class name (one leading `_` removed), and the output is `Class.member`. A string prints as written.
- **`log.tap(value, ...rest)`:** logs with the prefix, shows `''`, `'null'` and `'undefined'` readably, and returns `value`, so it can sit inside an expression.

### The prefix

- **Form:** the levels and `tap` print `[name]` first; a badge colours ` name ` with no brackets.
- **Name:** the bare method or function name from the call stack, the same string in every engine. Only `log.scope` adds the class.
- **No name** (an async callback, for example): the levels and `tap` print no prefix, and a badge prints a short blank block.

### DevTools link

The levels and badges are bound `console` methods (`console.log.bind(console, ...)`), so the console link points at your call site, not at the logger.

`log.tap` is a wrapper, so its link points at the caller only where the bundler ignore-lists dependencies and the browser honours that: Chrome under Vite, Rollup, the Angular esbuild builder or Next. It points at knix in Firefox, in Safari under Vite, in webpack without an ignore-list plugin, and wherever ignore-listing is turned off.

### Colour in Node

Node follows its own colour rule: `FORCE_COLOR` decides first (empty, `1`, `true`, `2` or `3` turn colour on; `0`, `false` or any other value turn it off). Otherwise the output stream decides, and a stream that is not a terminal prints plain.

**Vitest workers write to a pipe, so run Vitest with `FORCE_COLOR=1` to get coloured badges.**

```sh
FORCE_COLOR=1 npx vitest
```

## Setup

`@knix/utils/log` works as an import. To use `log` as a global instead, load `@knix/utils/log/global` in development only. It defines a non-enumerable `globalThis.log`, and keeps any `log` already there.

- **Angular:** in `angular.json`, add `"polyfills": ["@knix/utils/log/global"]` under `configurations.development` of the build target.
- **Vite:** `if (import.meta.env.DEV) await import('@knix/utils/log/global');`. A production build drops the guarded import.
- **Vitest:** `test: { setupFiles: ['@knix/utils/log/global'] }` in the Vite or Vitest config.
- **Jest:** `setupFiles: ['<rootDir>/node_modules/@knix/utils/dist/log/global.js']` in an ESM `jest.config.js`, run with `NODE_OPTIONS=--experimental-vm-modules`. Jest does not resolve the `@knix/utils/log/global` specifier in `setupFiles`, and the ESM file needs the VM modules flag. Checked with Jest 30.5.2.
- **Storybook:** `import '@knix/utils/log/global';` in `.storybook/preview.ts`. Checked with Storybook 10.6.8 (`@storybook/html-vite`): a built story read `log` as an object.
- **Node scripts:** `node --import @knix/utils/log/global script.js`.
- **TypeScript:** add `"types": ["@knix/utils/log/global"]` to `compilerOptions` in `tsconfig.json` for the global's types.
