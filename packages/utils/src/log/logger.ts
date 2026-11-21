import { callerPrefix } from './caller.js';
import { badgeArgs } from './colour.js';
import type { BadgeColour } from './colour.js';

/** A bound console method: takes the same arguments as `console.log`. */
export type LogMethod = (...data: unknown[]) => void;

/** The level, tap and badge members shared by `log` and every scoped logger. */
export interface ScopedLogger extends Readonly<Record<BadgeColour, LogMethod>> {
  readonly log: LogMethod;
  readonly warn: LogMethod;
  readonly error: LogMethod;
  /** Logs `value` (and `rest`) through `console.log`, then returns `value`. */
  tap<T>(value: T, ...rest: unknown[]): T;
}

export interface Logger extends ScopedLogger {
  /** Prefixes output with `owner`: a string, a class or an instance. */
  scope(owner: string | object): ScopedLogger;
}

/**
 * The text printed before the message: `Label.member`, the label alone, the
 * member alone, or '' when neither is known.
 */
export function displayName(label: string, member: string): string {
  if (label === '') return member;
  return member === '' ? label : `${label}.${member}`;
}

/** The leading console arguments for a name: `[name]`, or none. */
export function prefixArgs(name: string): string[] {
  return name === '' ? [] : [`[${name}]`];
}

/** The label of a scope owner; a class or instance loses one leading `_`. */
export function scopeLabel(owner: string | object): string {
  if (typeof owner === 'string') return owner;
  const raw =
    typeof owner === 'function'
      ? owner.name
      : (owner as { constructor?: { name?: unknown } }).constructor?.name;
  const name = typeof raw === 'string' ? raw : '';
  return name.startsWith('_') ? name.slice(1) : name;
}

const emptyish = new Set(['', 'null', 'undefined']);

/** Quotes the strings that would otherwise read as nothing or as a real null. */
export function visible(value: unknown): unknown {
  return typeof value === 'string' && emptyish.has(value)
    ? `'${value}'`
    : value;
}

// Every getter and `tap` reads the caller into a local before doing anything
// else: JavaScriptCore drops the frame of a function that returns a call, so
// `callerPrefix` must never sit in tail position. Frame 0 is `callerPrefix`,
// frame 1 the getter or `tap`, frame 2 the caller, hence `skip` 2.
function methods(label: string): ScopedLogger {
  return {
    get log(): LogMethod {
      const name = displayName(label, callerPrefix(2));
      return console.log.bind(console, ...prefixArgs(name));
    },
    get warn(): LogMethod {
      const name = displayName(label, callerPrefix(2));
      return console.warn.bind(console, ...prefixArgs(name));
    },
    get error(): LogMethod {
      const name = displayName(label, callerPrefix(2));
      return console.error.bind(console, ...prefixArgs(name));
    },
    get red(): LogMethod {
      const name = displayName(label, callerPrefix(2));
      return console.log.bind(console, ...badgeArgs('red', name, prefixArgs));
    },
    get yellow(): LogMethod {
      const name = displayName(label, callerPrefix(2));
      return console.log.bind(console, ...badgeArgs('yellow', name, prefixArgs));
    },
    get green(): LogMethod {
      const name = displayName(label, callerPrefix(2));
      return console.log.bind(console, ...badgeArgs('green', name, prefixArgs));
    },
    get cyan(): LogMethod {
      const name = displayName(label, callerPrefix(2));
      return console.log.bind(console, ...badgeArgs('cyan', name, prefixArgs));
    },
    get blue(): LogMethod {
      const name = displayName(label, callerPrefix(2));
      return console.log.bind(console, ...badgeArgs('blue', name, prefixArgs));
    },
    get magenta(): LogMethod {
      const name = displayName(label, callerPrefix(2));
      return console.log.bind(console, ...badgeArgs('magenta', name, prefixArgs));
    },
    get gray(): LogMethod {
      const name = displayName(label, callerPrefix(2));
      return console.log.bind(console, ...badgeArgs('gray', name, prefixArgs));
    },
    tap<T>(value: T, ...rest: unknown[]): T {
      const name = displayName(label, callerPrefix(2));
      console.log(...prefixArgs(name), visible(value), ...rest.map(visible));
      return value;
    },
  };
}

function createLogger(): Logger {
  const logger = Object.defineProperties(
    {},
    {
      ...Object.getOwnPropertyDescriptors(methods('')),
      scope: {
        enumerable: true,
        value: (owner: string | object): ScopedLogger =>
          Object.freeze(methods(scopeLabel(owner))),
      },
    },
  ) as Logger;
  return Object.freeze(logger);
}

export const log: Logger = createLogger();
