import { log, version, versionKey } from './logger.js';
import type { Logger } from './logger.js';

declare global {
  interface KnixLogger extends Logger {}
  var log: KnixLogger;
}

/** The caret range of a version, as the text every compatible version shares. */
function caretKey(value: string): string | undefined {
  const match = /^(\d+)\.(\d+)\.(\d+)/.exec(value);
  if (match === null) return undefined;
  const [, major, minor, patch] = match;
  if (major !== '0') return major;
  return minor !== '0' ? `0.${minor}` : `0.0.${patch}`;
}

/** Whether two versions' caret ranges overlap. */
export function caretCompatible(a: string, b: string): boolean {
  const key = caretKey(a);
  return key !== undefined && key === caretKey(b);
}

/** Installs `log` on `target`, keeping a value already under that name. */
export function install(target: object = globalThis): void {
  if (!('log' in target)) {
    Object.defineProperty(target, 'log', {
      value: log,
      writable: true,
      configurable: true,
      enumerable: false,
    });
    return;
  }
  const existing: unknown = (target as { log: unknown }).log;
  const theirs =
    (typeof existing === 'object' || typeof existing === 'function') &&
    existing !== null
      ? (existing as Record<symbol, unknown>)[versionKey]
      : undefined;
  if (typeof theirs === 'string') {
    if (!caretCompatible(theirs, version)) {
      console.warn(
        `@knix/utils/log/global: a logger version ${theirs} is already installed as \`log\`, which is not compatible with version ${version}; keeping version ${theirs}.`,
      );
    }
    return;
  }
  console.warn(
    "@knix/utils/log/global: `log` is already defined by something else, so it was left alone. Use `import { log } from '@knix/utils/log'` instead.",
  );
}

install();
