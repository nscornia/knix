import { afterEach, describe, expect, it, vi } from 'vitest';
import { log } from '../src/log/index.js';
import type { ScopedLogger } from '../src/log/index.js';

type Level = 'log' | 'warn' | 'error';
const levels: Level[] = ['log', 'warn', 'error'];

const prepareHook = Error as unknown as { prepareStackTrace?: unknown };

afterEach(() => {
  vi.restoreAllMocks();
});

// Each helper reads the logger into a local and calls it from a named frame.
function fromFunction(level: Level): unknown[] {
  const spy = vi.spyOn(console, level).mockImplementation(() => {});
  const method = log[level];
  method('x');
  return spy.mock.calls.at(-1) ?? [];
}

class CartService {
  add(level: Level, scoped?: ScopedLogger): unknown[] {
    const spy = vi.spyOn(console, level).mockImplementation(() => {});
    const method = (scoped ?? log)[level];
    method('x');
    return spy.mock.calls.at(-1) ?? [];
  }

  scopedAdd(level: Level): unknown[] {
    const spy = vi.spyOn(console, level).mockImplementation(() => {});
    const method = log.scope(this)[level];
    method('x');
    return spy.mock.calls.at(-1) ?? [];
  }

  tapAdd(scoped?: ScopedLogger): unknown[] {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    (scoped ?? log).tap('v');
    return spy.mock.calls.at(-1) ?? [];
  }
}

class _Hidden extends CartService {}
class __Double extends CartService {}

function plainTap(scoped?: ScopedLogger): unknown[] {
  const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
  (scoped ?? log).tap('v');
  return spy.mock.calls.at(-1) ?? [];
}

describe('log shape', () => {
  it('is frozen', () => {
    expect(Object.isFrozen(log)).toBe(true);
    expect(Object.isFrozen(log.scope('s'))).toBe(true);
  });

  it('exposes the levels as getters', () => {
    for (const level of levels) {
      const descriptor = Object.getOwnPropertyDescriptor(log, level);
      expect(typeof descriptor?.get).toBe('function');
      expect(descriptor?.set).toBeUndefined();
    }
    expect(typeof log.tap).toBe('function');
    expect(typeof log.scope).toBe('function');
  });

  it('restores Error.prepareStackTrace after each read', () => {
    const before = prepareHook.prepareStackTrace;
    for (const level of levels) {
      void log[level];
      void log.scope('s')[level];
      expect(prepareHook.prepareStackTrace).toBe(before);
    }
  });

  it('scoped loggers have no scope method', () => {
    expect('scope' in log.scope('s')).toBe(false);
  });
});

describe('bound, not wrapped', () => {
  it('leaves no knix frame in a stack captured inside the spy', () => {
    const stacks: string[] = [];
    for (const level of levels) {
      vi.spyOn(console, level).mockImplementation(() => {
        stacks.push(new Error().stack ?? '');
      });
    }
    for (const level of levels) {
      const method = log[level];
      method('x');
      const scoped = log.scope('s')[level];
      scoped('x');
    }
    expect(stacks).toHaveLength(6);
    for (const stack of stacks) {
      expect(stack).not.toMatch(/src\/log\//);
    }
  });
});

describe('printed form', () => {
  it('leads with [name] from a method', () => {
    for (const level of levels) {
      expect(new CartService().add(level)).toEqual(['[add]', 'x']);
    }
  });

  it('leads with [name] from a plain function', () => {
    for (const level of levels) {
      expect(fromFunction(level)).toEqual([`[fromFunction]`, 'x']);
    }
  });

  it('binds no prefix argument when there is no name', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const method = log.log;
    // An anonymous arrow function has no name to read.
    (() => {
      method('x');
    })();
    expect(spy.mock.calls[0]).toEqual(['x']);
  });
});

describe('scope', () => {
  it('prints a string label as written, plus the member', () => {
    expect(plainTap(log.scope('_Raw.label'))[0]).toBe('[_Raw.label.plainTap]');
  });

  it('prints the label alone when the stack gives no member', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const method = log.scope('Label').log;
    (() => {
      method('x');
    })();
    expect(spy.mock.calls[0]).toEqual(['[Label]', 'x']);
  });

  it('reads the class name from an instance, as Class.method', () => {
    for (const level of levels) {
      expect(new CartService().scopedAdd(level)).toEqual([
        '[CartService.scopedAdd]',
        'x',
      ]);
    }
  });

  it('reads the class name from a class', () => {
    const calls = new CartService().add('log', log.scope(CartService));
    expect(calls).toEqual(['[CartService.add]', 'x']);
  });

  it('strips exactly one leading underscore from a class or instance', () => {
    expect(new CartService().add('log', log.scope(_Hidden))[0]).toBe(
      '[Hidden.add]',
    );
    expect(new CartService().add('log', log.scope(new __Double()))[0]).toBe(
      '[_Double.add]',
    );
  });
});

describe('tap', () => {
  it('returns its value', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const object = {};
    expect(log.tap(object)).toBe(object);
    expect(log.tap(3, 'rest')).toBe(3);
    expect(log.scope('s').tap(null)).toBeNull();
  });

  it('leads with [name] from a method and a function', () => {
    expect(new CartService().tapAdd()).toEqual(['[tapAdd]', 'v']);
    expect(plainTap()).toEqual(['[plainTap]', 'v']);
  });

  it('scoped, reads Class.method', () => {
    const calls = new CartService().tapAdd(log.scope(CartService));
    expect(calls).toEqual(['[CartService.tapAdd]', 'v']);
    expect(plainTap(log.scope('S'))).toEqual(['[S.plainTap]', 'v']);
  });

  it('prints no prefix when there is no name', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    (() => {
      log.tap('v');
    })();
    expect(spy.mock.calls[0]).toEqual(['v']);
  });

  it('shows empty-ish strings as quoted text, in value and rest', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    log.tap('', '', 'null', 'undefined', 'plain', null, undefined);
    expect(spy.mock.calls[0]).toEqual([
      "''",
      "''",
      "'null'",
      "'undefined'",
      'plain',
      null,
      undefined,
    ]);
  });
});
