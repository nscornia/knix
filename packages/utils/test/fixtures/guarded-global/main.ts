/// <reference types="vite/client" />

if (import.meta.env.DEV) {
  await import('@knix/utils/log/global');
}

console.log('guarded import');
