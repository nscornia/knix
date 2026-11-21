import { describe, expect, it } from 'vitest';

// Reads the runner's own `log` before the entry is imported.
const before = Object.getOwnPropertyDescriptor(globalThis, 'log');

describe('the global entry', () => {
  it('installs the exported log on globalThis', async () => {
    const { log } = await import('../src/log/logger.js');
    await import('../src/log/global.js');
    if (before !== undefined) {
      expect(globalThis.log).toBe(before.value);
      return;
    }
    expect(Object.getOwnPropertyDescriptor(globalThis, 'log')).toEqual({
      value: log,
      writable: true,
      configurable: true,
      enumerable: false,
    });
  });

  it('reports whether the runner defines its own log', () => {
    expect(before).toBeUndefined();
  });
});
