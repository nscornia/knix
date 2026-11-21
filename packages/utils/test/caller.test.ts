import { describe, expect, it } from 'vitest';
import {
  callerPrefix,
  nameFromCallSites,
  normalizeName,
  nameFromStackString,
} from '../src/log/caller.js';

// Not a tail call: JavaScriptCore drops the frame of a function that returns a call.
const getter = (): string => {
  const prefix = callerPrefix(2);
  return prefix;
};

class CartService {
  add(): string {
    const prefix = getter();
    return prefix;
  }
}

class _PrivateCart {
  add(): string {
    const prefix = getter();
    return prefix;
  }
}

function checkout(): string {
  const prefix = getter();
  return prefix;
}

const prepareHook = Error as unknown as { prepareStackTrace?: unknown };

describe('callerPrefix', () => {
  it('names a method call by the method name', () => {
    expect(new CartService().add()).toBe('add');
  });

  it('names a plain function by its name', () => {
    expect(checkout()).toBe('checkout');
  });

  it('does not leak a class name, underscored or not', () => {
    expect(new _PrivateCart().add()).toBe('add');
  });

  it('never includes a file or line', () => {
    const prefixes = [new CartService().add(), checkout(), new _PrivateCart().add()];
    for (const prefix of prefixes) {
      expect(prefix).not.toMatch(/:\d+/);
      expect(prefix).not.toMatch(/\.(ts|js)\b/);
      expect(prefix).not.toMatch(/https?:|file:/);
    }
  });

  it('leaves Error.prepareStackTrace undefined when it was undefined', () => {
    const before = prepareHook.prepareStackTrace;
    checkout();
    expect(prepareHook.prepareStackTrace).toBe(before);
  });

  it('restores a custom Error.prepareStackTrace', () => {
    const before = prepareHook.prepareStackTrace;
    const custom = (): string => 'custom';
    prepareHook.prepareStackTrace = custom;
    try {
      checkout();
      expect(prepareHook.prepareStackTrace).toBe(custom);
    } finally {
      prepareHook.prepareStackTrace = before;
    }
  });
});

class Accessors {
  get value(): string {
    const prefix = getter();
    return prefix;
  }
}

function outer(): string[] {
  return [1].map(() => {
    const prefix = getter();
    return prefix;
  });
}

describe('accessors and callbacks', () => {
  it('names an accessor by its property name', () => {
    expect(new Accessors().value).toBe('value');
  });

  it('gives no name for an anonymous arrow callback', () => {
    expect(outer()).toEqual(['']);
  });
});

describe('short or empty stacks', () => {
  it('returns an empty prefix for no call sites', () => {
    expect(nameFromCallSites([], 2)).toBe('');
  });

  it('returns an empty prefix for an empty string stack', () => {
    expect(nameFromStackString('', 2)).toBe('');
  });

  it('returns an empty prefix when the stack is shorter than skip', () => {
    expect(nameFromStackString('a@http://h/x.js:1:1', 2)).toBe('');
  });

  it('returns an empty prefix for an unreadable frame', () => {
    expect(nameFromStackString('x\ny\nnot a frame', 2)).toBe('');
  });

  it('does not throw for a huge skip', () => {
    expect(callerPrefix(10_000)).toBe('');
  });
});

describe('nameFromStackString', () => {
  it('reads a function name and drops the location', () => {
    const stack = 'callerPrefix@http://h/a.js:1:1\ngetter@http://h/a.js:2:2\ncheckout@http://h/a.js:3:3';
    expect(nameFromStackString(stack, 2)).toBe('checkout');
  });

  it('crosses native frames and stops at the first non-native one', () => {
    const stack = 'a@http://h/a.js:1:1\nb@http://h/a.js:2:2\nforEach@[native code]\nrun@http://h/a.js:3:3\nouter@http://h/a.js:4:4';
    expect(nameFromStackString(stack, 2)).toBe('run');
  });

  it('gives no name for an anonymous frame', () => {
    expect(nameFromStackString('a@u:1:1\nb@u:2:2\n@u:3:3', 2)).toBe('');
  });
});

describe('normalizeName', () => {
  it('keeps the segment after the last dot', () => {
    expect(normalizeName('Foo.prototype.bar')).toBe('bar');
    expect(normalizeName('Foo.bar')).toBe('bar');
  });

  it('gives no name for non-identifier tokens', () => {
    expect(normalizeName('outer/<')).toBe('');
    expect(normalizeName('module code')).toBe('');
    expect(normalizeName('global code')).toBe('');
    expect(normalizeName('')).toBe('');
  });

  it('drops a SpiderMonkey accessor prefix', () => {
    expect(normalizeName('get foo')).toBe('foo');
    expect(normalizeName('set foo')).toBe('foo');
  });

  it('keeps underscores, dollars and unicode letters', () => {
    expect(normalizeName('_private')).toBe('_private');
    expect(normalizeName('$el')).toBe('$el');
    expect(normalizeName('naïve')).toBe('naïve');
  });
});
