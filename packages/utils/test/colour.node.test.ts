import { describe, expect, it } from 'vitest';
import { nodeColour } from '../src/log/colour.js';

const colourful = { hasColors: () => true };
const mono = { hasColors: () => false };

describe('nodeColour', () => {
  it.each(['', '1', 'true', '2', '3'])('FORCE_COLOR=%j is on', (value) => {
    expect(nodeColour({ FORCE_COLOR: value }, mono)).toBe(true);
    expect(nodeColour({ FORCE_COLOR: value }, undefined)).toBe(true);
  });

  it.each(['0', 'false', 'yes', 'on', 'TRUE'])(
    'FORCE_COLOR=%j is off',
    (value) => {
      expect(nodeColour({ FORCE_COLOR: value }, colourful)).toBe(false);
    },
  );

  it('lets the stream decide when FORCE_COLOR is unset', () => {
    expect(nodeColour({}, colourful)).toBe(true);
    expect(nodeColour({}, mono)).toBe(false);
    expect(nodeColour({ FORCE_COLOR: undefined }, colourful)).toBe(true);
  });

  it('is plain for a stream without hasColors', () => {
    expect(nodeColour({}, {})).toBe(false);
    expect(nodeColour({}, undefined)).toBe(false);
  });
});
