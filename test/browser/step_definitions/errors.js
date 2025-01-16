const { Given, When, Then } = require("@cucumber/cucumber");

const { expect } = require("chai");

const { ErrorPage } = require("../pages");

const { injectAxe } = require("axe-playwright");

Then("they should see an error page", async function () {
  const errorPage = new ErrorPage(this.page);

  const errorTitle = await errorPage.getErrorTitle();

  await injectAxe(this.page);
  // Run Axe for WCAG 2.2 AA rules
  const wcagResults = await this.page.evaluate(() => {
    return axe.run({
      runOnly: ["wcag2aa"]
    });
  });
  expect(wcagResults.violations, "WCAG 2.2 AAA violations found").to.be.empty;

  expect(errorTitle.trim()).to.equal(
    errorPage.getSomethingWentWrongMessage().trim()
  );
});
