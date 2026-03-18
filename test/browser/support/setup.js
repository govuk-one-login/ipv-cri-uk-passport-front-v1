const { Before, BeforeAll, AfterAll, After } = require("@cucumber/cucumber");
const { setDefaultTimeout } = require("@cucumber/cucumber");
const { chromium } = require("@playwright/test");
const axios = require("axios");
const ConfigurationReader = require("./configuration-reader");

setDefaultTimeout(31 * 1000); // 60 seconds for all steps

BeforeAll(async function () {
  // Log environment at start of test execution (only for stub tests)
  if (
    process.env.TEST_TYPE === "stub" ||
    process.argv.some((arg) => arg.includes("stub"))
  ) {
    try {
      const testEnvironment = ConfigurationReader.get("ENVIRONMENT");
      // eslint-disable-next-line no-console
      console.log(`Running tests for environment: ${testEnvironment}`);
    } catch {
      // eslint-disable-next-line no-console
      console.log("ENVIRONMENT not configured");
    }
  }

  // Browsers are expensive in Playwright so only create 1

  if (process.env.BROWSER === "chrome-headless") {
    global.browser = await chromium.launch({
      // Not headless so we can watch test runs
      headless: true
    });
  } else {
    global.browser = await chromium.launch({
      // Not headless so we can watch test runs
      headless: true,
      // Slow so we can see things happening
      slowMo: 0
    });
  }
});

AfterAll(async function () {
  await globalThis.browser.close();
});

// Add scenario header
Before(async function ({ pickle } = {}) {
  const tags = pickle.tags || [];

  // Determine if this is a stub test based on the tag @stub-test
  this.isStubTest = tags.find((tag) => tag.name === "@stub-test");

  // eslint-disable-next-line no-console
  console.log(`\nRunning: ${pickle.name}`);

  // Existing logic for WireMock scenario header and reset
  const mockApiTag = tags.find((tag) => tag.name.startsWith("@mock-api:"));
  if (mockApiTag) {
    this.SCENARIO_ID_HEADER = mockApiTag.name.substring(10);
    if (this.SCENARIO_ID_HEADER && ConfigurationReader.get("API_BASE_URL")) {
      const url =
        ConfigurationReader.get("API_BASE_URL") +
        `__reset/${this.SCENARIO_ID_HEADER}`;
      try {
        await axios.get(url);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Warning: Failed to reset mock API: ${error.message}`);
      }
    }
  }
});

// Create a new test context and page per scenario
Before(async function () {
  const contextOptions = {};

  // If it's a stub test, set the baseURL from CORE_STUB_URL
  if (this.isStubTest && ConfigurationReader.get("CORE_STUB_URL")) {
    contextOptions.baseURL = ConfigurationReader.get("CORE_STUB_URL");
  } else if (ConfigurationReader.get("API_BASE_URL")) {
    contextOptions.baseURL = ConfigurationReader.get("API_BASE_URL");
  }

  // Apply scenario ID header if present
  if (this.SCENARIO_ID_HEADER) {
    contextOptions.extraHTTPHeaders = {
      ...contextOptions.extraHTTPHeaders, // Preserve any existing headers
      "x-scenario-id": this.SCENARIO_ID_HEADER
    };
  }

  this.context = await globalThis.browser.newContext(contextOptions);
  this.page = await this.context.newPage();
});

// Cleanup after each scenario
After(async function () {
  await this.page.close();
  await this.context.close();
});
