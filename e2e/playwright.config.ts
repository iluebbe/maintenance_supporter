import { defineConfig, devices } from "@playwright/test";

// The URL the BROWSER uses (also the storageState origin). In CI the runner
// launches Chromium locally and reaches HA on localhost; locally we drive a
// browser inside the docker playwright-server, which reaches HA by its
// container name on the shared network.
const HA = process.env.E2E_HA_URL || "http://localhost:8123";
// Optional ws:// endpoint of a playwright server. When set we connect to it
// (stable full Chromium) instead of launching a local browser.
const PW_WS = process.env.E2E_PW_WS || "";

export default defineConfig({
  testDir: "./specs",
  // One HA instance with shared state -> run serially, one worker.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  // Retry the strategy dashboard's cold-start whenDefined race; a real
  // regression fails every attempt.
  retries: process.env.CI ? 3 : 1,
  timeout: 90_000,
  expect: { timeout: 20_000 },
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
  globalSetup: "./global-setup.ts",
  use: {
    baseURL: HA,
    storageState: ".auth/state.json",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    launchOptions: { args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] },
    ...(PW_WS ? { connectOptions: { wsEndpoint: PW_WS } } : {}),
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
