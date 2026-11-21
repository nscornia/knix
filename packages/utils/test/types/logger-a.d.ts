export interface Logger {
  readonly log: (...data: unknown[]) => void;
  scope(owner: string | object): Omit<Logger, 'scope'>;
}
