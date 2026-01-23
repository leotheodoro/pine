import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    dir: 'src',
    coverage: {
      include: ['src/**/*.{ts,spec.ts}'],
    },
    workspace: [
      {
        extends: true,
        test: {
          name: 'unit',
          dir: 'src/services',
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          dir: 'src/http/controllers',
          environment: './prisma/vitest-environment-prisma/prisma-test-environment.ts',
        },
      },
    ],
  },
})
