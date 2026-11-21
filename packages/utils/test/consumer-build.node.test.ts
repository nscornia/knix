import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import type { Rollup } from 'vite';
import { describe, expect, it } from 'vitest';

/**
 * Builds a fixture as a consumer would: `@knix/utils` resolves through the
 * workspace link in the root `node_modules` to the built `dist/`, and the
 * production mode is set explicitly because Vitest otherwise leaves
 * `import.meta.env.DEV` true inside a nested build.
 */
async function buildFixture(name: string): Promise<string> {
  const root = fileURLToPath(new URL(`./fixtures/${name}/`, import.meta.url));
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    const result = (await build({
      root,
      configFile: false,
      mode: 'production',
      logLevel: 'silent',
      build: {
        write: false,
        minify: false,
        lib: { entry: 'main.ts', formats: ['es'] },
      },
    })) as Rollup.RollupOutput[] | Rollup.RollupOutput;
    const outputs = Array.isArray(result) ? result : [result];
    return outputs
      .flatMap((output) => output.output)
      .map((item) => (item.type === 'chunk' ? item.code : ''))
      .join('\n');
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
}

describe('consumer production build', () => {
  it('keeps the global installer out of a plain `@knix/utils/log` import', async () => {
    const code = await buildFixture('plain-import');
    expect(code).toContain('plain import');
    // The installer's warning text and its `defineProperty` install exist only in global.ts.
    expect(code).not.toContain('@knix/utils/log/global');
    expect(code).not.toContain('already defined by something else');
    expect(code).not.toMatch(/defineProperty\([^)]*['"]log['"]/);
  }, 60_000);

  it('drops a DEV-guarded `@knix/utils/log/global` import entirely', async () => {
    const code = await buildFixture('guarded-global');
    expect(code).toContain('guarded import');
    expect(code).not.toContain('@knix/utils/log');
  }, 60_000);
});
