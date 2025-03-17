const { Before, BeforeAll, AfterAll, After } = require("@cucumber/cucumber");
const { chromium } = require("playwright");
const axios = require("axios");

BeforeAll(async function () {
  // Browsers are expensive in Playwright so only create 1
  global.browser = process.env.GITHUB_ACTIONS
    ? await chromium.launch()
    : await chromium.launch({
        // Not headless so we can watch test runs
        headless: true,
        // Slow so we can see things happening
        slowMo: 0
      });
});

AfterAll(async function () {
  await global.browser.close();
});

// Add scenario header
Before(async function ({ pickle } = {}) {
  const tags = pickle.tags || [];
  const tag = tags.find((tag) => tag.name.startsWith("@mock-api:"));

  if (!tag) {
    return;
  }

  const header = tag?.name.substring(10);
  if (!header) {
    return;
  }

  this.SCENARIO_ID_HEADER = header;

  const url = `http://localhost:8050/__reset/${header}`;

  try {
    await axios.get(url);
  } catch (e) {
    console.log(`Error fetching ${url}`); // eslint-disable-line no-console
    console.log(`${e.message}`); // eslint-disable-line no-console
  }
});

// Create a new test context and page per scenario
Before(async function () {
  this.context = await global.browser.newContext({});

  if (this.SCENARIO_ID_HEADER) {
    await this.context.setExtraHTTPHeaders({
      "x-scenario-id": this.SCENARIO_ID_HEADER
    });
  }

  this.page = await this.context.newPage();
});

//Cleanup after each scenario
After(async function () {
  await this.page.close();
  await this.context.close();
});
