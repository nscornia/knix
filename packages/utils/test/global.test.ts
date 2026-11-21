import { afterEach, describe, expect, it, vi } from 'vitest';
import { caretCompatible, install } from '../src/log/global.js';
import { log, version, versionKey } from '../src/log/logger.js';

afterEach(() => {
  vi.restoreAllMocks();
});

function fresh(): { log?: unknown } {
  return {};
}

function warnings(): ReturnType<typeof vi.spyOn> {
  return vi.spyOn(console, 'warn').mockImplementation(() => {});
}

function knixLogger(theirs: string): object {
  return Object.defineProperty({}, versionKey, { value: theirs });
}

describe('install', () => {
  it('defines log with the exact descriptor when the name is absent', () => {
    const warn = warnings();
    const target = fresh();
    install(target);
    expect(Object.getOwnPropertyDescriptor(target, 'log')).toEqual({
      value: log,
      writable: true,
      configurable: true,
      enumerable: false,
    });
    expect(warn).not.toHaveBeenCalled();
  });

  it('keeps a compatible knix logger without warning', () => {
    const warn = warnings();
    const target = fresh();
    const other = knixLogger(version);
    target.log = other;
    install(target);
    expect(target.log).toBe(other);
    expect(warn).not.toHaveBeenCalled();
  });

  it('keeps an incompatible knix logger and warns once with both versions', () => {
    const warn = warnings();
    const target = fresh();
    const other = knixLogger('9.1.0');
    target.log = other;
    install(target);
    expect(target.log).toBe(other);
    expect(warn).toHaveBeenCalledTimes(1);
    const text = String(warn.mock.calls[0]?.[0]);
    expect(text).toContain('9.1.0');
    expect(text).toContain(version);
  });

  it.each([['a string', 'nope'], ['an object', {}], ['null', null], ['a function', () => {}]])(
    'keeps a foreign value (%s) and warns once with the import',
    (_name, value) => {
      const warn = warnings();
      const target = fresh();
      target.log = value;
      install(target);
      expect(target.log).toBe(value);
      expect(warn).toHaveBeenCalledTimes(1);
      expect(String(warn.mock.calls[0]?.[0])).toContain(
        "import { log } from '@knix/utils/log'",
      );
    },
  );

  it('treats a non-string version as a foreign value', () => {
    const warn = warnings();
    const target = fresh();
    target.log = Object.defineProperty({}, versionKey, { value: 1 });
    install(target);
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

describe('caretCompatible', () => {
  it.each([
    ['1.2.0', '1.9.9', true],
    ['1.9.9', '1.2.0', true],
    ['1.0.0', '2.0.0', false],
    ['2.3.4', '1.3.4', false],
    ['0.3.1', '0.3.9', true],
    ['0.3.0', '0.4.0', false],
    ['0.0.1', '0.0.2', false],
    ['0.0.2', '0.0.2', true],
    ['0.0.0', '0.1.0', false],
    ['garbage', '1.0.0', false],
    ['garbage', 'garbage', false],
  ])('%s vs %s is %s', (a, b, expected) => {
    expect(caretCompatible(a, b)).toBe(expected);
  });
});

describe('version marker', () => {
  it('is a non-enumerable own property of log carrying the version', () => {
    expect(Object.getOwnPropertyDescriptor(log, versionKey)).toEqual({
      value: version,
      writable: false,
      configurable: false,
      enumerable: false,
    });
    expect(Object.keys(log)).not.toContain(String(versionKey));
  });

  it('is absent from scoped loggers', () => {
    expect(versionKey in log.scope('x')).toBe(false);
  });
});
