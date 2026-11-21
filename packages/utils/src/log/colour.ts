/** The badge colours, one per basic ANSI colour that works as a badge. */
export type BadgeColour =
  | 'red'
  | 'yellow'
  | 'green'
  | 'cyan'
  | 'blue'
  | 'magenta'
  | 'gray';

interface Swatch {
  /** ANSI text and background codes for Node (16-colour range). */
  readonly ansi: { readonly text: number; readonly background: number };
  /** Hex background and text for browsers; each pair reaches WCAG AA (4.5:1). */
  readonly css: { readonly text: string; readonly background: string };
}

export const palette: Readonly<Record<BadgeColour, Swatch>> = {
  red: {
    ansi: { text: 97, background: 41 },
    css: { text: '#ffffff', background: '#b3261e' },
  },
  yellow: {
    ansi: { text: 30, background: 43 },
    css: { text: '#1a1a1a', background: '#f2c94c' },
  },
  green: {
    ansi: { text: 30, background: 42 },
    css: { text: '#ffffff', background: '#2e7d32' },
  },
  cyan: {
    ansi: { text: 30, background: 46 },
    css: { text: '#00262d', background: '#26c6da' },
  },
  blue: {
    ansi: { text: 97, background: 44 },
    css: { text: '#ffffff', background: '#1a56c4' },
  },
  magenta: {
    ansi: { text: 97, background: 45 },
    css: { text: '#ffffff', background: '#a0239a' },
  },
  gray: {
    ansi: { text: 97, background: 100 },
    css: { text: '#ffffff', background: '#616161' },
  },
};

export const badgeColours = Object.keys(palette) as BadgeColour[];

/** The slice of a Node output stream the colour rule reads. */
export interface ColourStream {
  hasColors?: () => boolean;
}

const forcedOn = new Set(['', '1', 'true', '2', '3']);

/**
 * Whether Node badges print in colour. `FORCE_COLOR`, when present, decides
 * alone: an empty value, `1`, `true`, `2` or `3` is on, anything else off.
 * Otherwise the stream decides through `hasColors()`; a stream without it is
 * plain.
 */
export function nodeColour(
  env: Readonly<Record<string, string | undefined>>,
  stream: ColourStream | undefined,
): boolean {
  const forced = env['FORCE_COLOR'];
  if (forced !== undefined) return forcedOn.has(forced);
  return stream?.hasColors?.() ?? false;
}

interface NodeProcess {
  versions?: { node?: string };
  env?: Record<string, string | undefined>;
  stdout?: ColourStream;
}

// Read at call time, never imported: no `node:*` module and no `@types/node`.
function nodeProcess(): NodeProcess | undefined {
  const proc = (globalThis as { process?: NodeProcess }).process;
  return proc?.versions?.node === undefined ? undefined : proc;
}

/** The text inside a badge: the name with a space each side, or a blank block. */
export function badgeText(name: string): string {
  return name === '' ? '  ' : ` ${name} `;
}

/**
 * The leading console arguments for a badge. Browsers get `%c` plus a CSS
 * string, coloured Node an ANSI-wrapped block, and plain Node exactly the
 * `[name]` the levels print.
 */
export function badgeArgs(
  colour: BadgeColour,
  name: string,
  plain: (name: string) => string[],
): string[] {
  const swatch = palette[colour];
  const text = badgeText(name);
  const proc = nodeProcess();
  if (proc === undefined) {
    const { text: fg, background: bg } = swatch.css;
    return [
      `%c${text}`,
      `background:${bg};color:${fg};padding:1px 0;border-radius:2px`,
    ];
  }
  if (!nodeColour(proc.env ?? {}, proc.stdout)) return plain(name);
  const { text: fg, background: bg } = swatch.ansi;
  return [`\u001b[${bg};${fg}m${text}\u001b[0m`];
}
