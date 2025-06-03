const { Given } = require("@cucumber/cucumber");

const { RelyingPartyPage } = require("../pages");

Given(/^(.*) has started the Passport Journey$/, async function (name) {
  this.user = this.allUsers[name];
  const rpPage = new RelyingPartyPage(this.page);

  await rpPage.goto();
});

Given(
  "they have provided their details",
  { timeout: 10 * 1000 },
  async function () {}
);
