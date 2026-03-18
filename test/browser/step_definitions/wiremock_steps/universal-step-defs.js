const { Given, When, Then } = require("@cucumber/cucumber");
const {
  UniversalSteps
} = require("../../pages/wiremock_pages/universal-steps");

Then(
  /^I add a cookie to change the language to (.*)$/,
  { timeout: 2 * 5000 },
  async function (language) {
    const universalSteps = new UniversalSteps(this.page, this.page.url());
    await universalSteps.changeLanguageTo(language);
  }
);
