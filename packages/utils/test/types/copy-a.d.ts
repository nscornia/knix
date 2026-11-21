// One installed copy's global.d.ts: its own Logger, the shared global names.
import type { Logger } from './logger-a.js';

declare global {
  interface KnixLogger extends Logger {}
  var log: KnixLogger;
}
