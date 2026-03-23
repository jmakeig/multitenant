import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	resolve: {
		alias: {
			'$env/dynamic/private': join(__dirname, 'tests/mocks/env.ts'),
			'$lib': join(__dirname, 'src/lib'),
		},
	},
	test: {
		environment: 'node',
		include: ['tests/integration/**/*.test.ts'],
		env: loadEnv('test', __dirname, ''),
	},
})
