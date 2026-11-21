/** The slice of a V8 call site the reader uses. */
export interface CallSiteLike {
  getFunctionName(): string | null;
  getMethodName(): string | null;
  getFileName(): string | null | undefined;
  isNative(): boolean;
}

interface PrepareHook {
  prepareStackTrace?: unknown;
}

const identifier = /^[\p{L}\p{N}_$]+$/u;

/**
 * Reduces a raw frame name to the one token every engine agrees on: the
 * segment after the last `.`, or '' when that is not a plain identifier
 * (anonymous, `global code`, `outer/<`). SpiderMonkey's `get `/`set ` accessor
 * prefix is dropped so an accessor reads as its property name everywhere.
 */
export function normalizeName(raw: string): string {
  const name = raw
    .slice(raw.lastIndexOf('.') + 1)
    .replace(/^(?:get|set) /, '');
  return identifier.test(name) ? name : '';
}

/**
 * Names the frame at `skip` from structured V8 call sites, crossing native
 * frames only. Index 0 is the frame that captured the stack.
 */
export function nameFromCallSites(
  sites: readonly CallSiteLike[],
  skip: number,
): string {
  for (let i = skip; i < sites.length; i++) {
    const site = sites[i];
    if (site === undefined) return '';
    if (site.isNative() || site.getFileName() == null) continue;
    return normalizeName(site.getMethodName() ?? site.getFunctionName() ?? '');
  }
  return '';
}

/**
 * Names the frame at `skip` from a Firefox or Safari `name@url:line:col`
 * stack string, crossing native frames only. A frame it cannot read yields ''.
 */
export function nameFromStackString(stack: string, skip: number): string {
  const frames = stack.split('\n').filter((line) => line.trim() !== '');
  for (let i = skip; i < frames.length; i++) {
    const frame = frames[i] ?? '';
    const at = frame.indexOf('@');
    const location = at === -1 ? frame : frame.slice(at + 1);
    if (location.includes('[native code]')) continue;
    return at === -1 ? '' : normalizeName(frame.slice(0, at).trim());
  }
  return '';
}

/**
 * Returns the name of a caller's method or function, or ''.
 * `skip` counts frames from this function (frame 0) to the caller; a getter
 * that calls this directly passes 2 to skip itself and this function.
 */
export function callerPrefix(skip = 2): string {
  const hook = Error as unknown as PrepareHook;
  const had = Object.hasOwn(hook, 'prepareStackTrace');
  const previous = hook.prepareStackTrace;
  let captured: unknown;
  try {
    hook.prepareStackTrace = (_error: Error, sites: unknown) => sites;
    captured = new Error().stack;
  } catch {
    return '';
  } finally {
    if (had) hook.prepareStackTrace = previous;
    else delete hook.prepareStackTrace;
  }
  if (Array.isArray(captured)) {
    return nameFromCallSites(captured as CallSiteLike[], skip);
  }
  return typeof captured === 'string' ? nameFromStackString(captured, skip) : '';
}
