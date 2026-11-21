import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'node',
          environment: 'node',
          include: ['test/**/*.test.ts', 'test/**/*.node.test.ts'],
          exclude: ['**/*.browser.test.ts', '**/node_modules/**'],
        },
      },
      {
        test: {
          name: 'browser',
          include: ['test/**/*.test.ts', 'test/**/*.browser.test.ts'],
          exclude: ['**/*.node.test.ts', '**/node_modules/**'],
          browser: {
            enabled: true,
            headless: true,
            screenshotFailures: false,
            provider: playwright(),
            instances: [
              { browser: 'chromium' },
              { browser: 'firefox' },
              { browser: 'webkit' },
            ],
          },
        },
      },
    ],
  },
});
