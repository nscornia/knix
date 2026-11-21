import { afterEach, describe, expect, it, vi } from 'vitest';
import { badgeColours, palette } from '../src/log/colour.js';
import type { BadgeColour } from '../src/log/colour.js';
import { log } from '../src/log/index.js';
import type { ScopedLogger } from '../src/log/index.js';

const inBrowser = typeof document !== 'undefined';
const esc = String.fromCharCode(27);

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

function luminance(hex: string): number {
  const channel = (offset: number): number => {
    const c = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
}

class CartService {
  add(colour: BadgeColour, scoped?: ScopedLogger): unknown[] {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const method = (scoped ?? log)[colour];
    method('x');
    return spy.mock.calls.at(-1) ?? [];
  }
}

function fromFunction(colour: BadgeColour): unknown[] {
  const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
  const method = log[colour];
  method('x');
  return spy.mock.calls.at(-1) ?? [];
}

function anonymous(colour: BadgeColour, scoped?: ScopedLogger): unknown[] {
  const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
  (() => {
    const method = (scoped ?? log)[colour];
    method('x');
  })();
  return spy.mock.calls.at(-1) ?? [];
}

describe('badge shape', () => {
  it('has seven getters on log and on a scoped logger', () => {
    expect(badgeColours).toHaveLength(7);
    for (const colour of badgeColours) {
      for (const target of [log, log.scope('s')]) {
        const descriptor = Object.getOwnPropertyDescriptor(target, colour);
        expect(typeof descriptor?.get).toBe('function');
        expect(descriptor?.set).toBeUndefined();
      }
    }
  });

  it('is bound: no knix frame in a stack captured inside the spy', () => {
    const stacks: string[] = [];
    vi.spyOn(console, 'log').mockImplementation(() => {
      stacks.push(new Error().stack ?? '');
    });
    for (const colour of badgeColours) {
      const method = log[colour];
      method('x');
      const scoped = log.scope('s')[colour];
      scoped('x');
    }
    expect(stacks).toHaveLength(14);
    for (const stack of stacks) {
      expect(stack).not.toMatch(/src\/log\//);
    }
  });
});

describe('contrast', () => {
  it.each(badgeColours)('%s reaches WCAG AA (4.5:1)', (colour) => {
    const { text, background } = palette[colour].css;
    expect(contrast(text, background)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('badge text', () => {
  const cases: [BadgeColour, string][] = badgeColours.map((c) => [c, c]);

  // Node: stub FORCE_COLOR for the colour and plain forms.
  // Browsers: the `%c` form and one CSS argument.
  function check(colour: BadgeColour, args: unknown[], name: string): void {
    const text = name === '' ? '  ' : ` ${name} `;
    if (inBrowser) {
      const { text: fg, background: bg } = palette[colour].css;
      expect(args[0]).toBe(`%c${text}`);
      expect(args[1]).toContain(`background:${bg}`);
      expect(args[1]).toContain(`color:${fg}`);
      expect(args[2]).toBe('x');
      return;
    }
    const { text: fg, background: bg } = palette[colour].ansi;
    expect(args).toEqual([`${esc}[${bg};${fg}m${text}${esc}[0m`, 'x']);
  }

  it.each(cases)('%s, from a method', (colour) => {
    if (!inBrowser) vi.stubEnv('FORCE_COLOR', '1');
    check(colour, new CartService().add(colour), 'add');
  });

  it.each(cases)('%s, from a function', (colour) => {
    if (!inBrowser) vi.stubEnv('FORCE_COLOR', '1');
    check(colour, fromFunction(colour), 'fromFunction');
  });

  it.each(cases)('%s, scoped, reads Class.method', (colour) => {
    if (!inBrowser) vi.stubEnv('FORCE_COLOR', '1');
    const args = new CartService().add(colour, log.scope(CartService));
    check(colour, args, 'CartService.add');
  });

  it.each(cases)('%s with no name is a short blank block', (colour) => {
    if (!inBrowser) vi.stubEnv('FORCE_COLOR', '1');
    check(colour, anonymous(colour), '');
  });

  it.skipIf(inBrowser)('prints the plain [name] form when colour is off', () => {
    vi.stubEnv('FORCE_COLOR', '0');
    expect(new CartService().add('red')).toEqual(['[add]', 'x']);
    expect(anonymous('red')).toEqual(['x']);
    expect(anonymous('red', log.scope('S'))).toEqual(['[S]', 'x']);
  });
});
