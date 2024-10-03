
/// <reference types="vite/client" />


import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        globalSetup: ['./globalSetup.ts'],
        environment: 'jsdom',
        setupFiles: ['./src/setupTests.ts'],
    },
})
