import { defineConfig } from '@playwright/test';
export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    workers: 4,
    use: {
        baseURL: 'http://127.0.0.1:4173',
        headless: true,
        channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
        screenshot: 'only-on-failure',
    },
    webServer: {
        command: 'python3 -m http.server 4173 --bind 127.0.0.1 --directory build',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: !process.env.CI,
        stdout: 'ignore',
        stderr: 'ignore',
    },
});
