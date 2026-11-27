/** @jest-config-loader esbuild-register */
import type { Config } from 'jest'
import config from './jest.config.ts'

process.env.NODE_TLS_REJECT_UNAUTHORIZED ??= '0'

const e2eConfig: Config = {
	...config,
	testMatch: ['<rootDir>/src/**/*.test-e2e.ts']
}

export default e2eConfig
