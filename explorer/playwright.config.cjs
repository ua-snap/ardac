const { defineConfig, devices } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  fullyParallel: !process.env.CI,
  use: {
    headless: !!process.env.CI,
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
    screenshot: 'on',
    video: 'on',
    baseURL: 'http://127.0.0.1:3000',
  },
  webServer: {
    // Force Nuxt to bind exactly where Playwright will probe
    command: 'npx nuxt dev --port 3000 --host 127.0.0.1',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000, // Nuxt + Vite can be slow cold
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      NUXT_TELEMETRY_DISABLED: '1',
      NUXT_TYPECHECK: '0',
    },
  },
  projects: [
    {
      name: 'Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          args: process.env.CI
            ? [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
              ]
            : [],
        },
      },
    },
    {
      name: 'Firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
  reporter: process.env.CI
    ? [['github'], ['html']]
    : [['list'], ['html', { open: 'never' }]],
})
