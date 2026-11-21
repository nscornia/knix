import { afterEach, describe, expect, it, vi } from 'vitest';
import type { BadgeColour } from '../src/log/colour.js';
import { badgeColours, palette } from '../src/log/colour.js';
import { log } from '../src/log/index.js';

afterEach(() => {
  vi.restoreAllMocks();
});

function render(): unknown[] {
  const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
  const method = log.green;
  method('msg');
  return spy.mock.calls.at(-1) ?? [];
}

function badge(colour: BadgeColour): unknown[] {
  const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
  const method = log[colour];
  method('msg');
  return spy.mock.calls[0] ?? [];
}

describe('browser badge output', () => {
  it('takes the %c path even if a process shim exists', () => {
    expect(render()[0]).toBe('%c render ');
  });

  it.each(badgeColours)('%s passes a %c format and one CSS string', (colour) => {
    const { text, background } = palette[colour].css;
    expect(badge(colour)).toEqual([
      '%c badge ',
      `background:${background};color:${text};padding:1px 0;border-radius:2px`,
      'msg',
    ]);
  });
});
