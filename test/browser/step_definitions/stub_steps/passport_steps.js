const { Given, When, Then, And } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const {
  IpvCoreStubCredentialIssuerPage,
  IpvCoreStubUserSearchPage,
  IpvCoreStubUserEditPage,
  PassportDetailsPage,
  IpvCoreStubVerfiyVcPage
} = require("../../pages/stub_pages");
const ConfigurationReader = require("../../support/configuration-reader");

require("dotenv").config();

Given("I navigate to the IPV Core Stub", async function () {
  await this.context.clearCookies();

  let coreStubUrl = ConfigurationReader.get("CORE_STUB_URL");
  const coreStubUsername = ConfigurationReader.get("CORE_STUB_USERNAME");
  const coreStubPassword = ConfigurationReader.get("CORE_STUB_PASSWORD");

  if (coreStubUsername && coreStubPassword) {
    const urlRegex = /^(https?:\/\/)?(.*)$/;
    const urlParts = urlRegex.exec(coreStubUrl);
    const protocol = urlParts[1] || "https://";
    const domain = urlParts[2];
    coreStubUrl = `${protocol}${coreStubUsername}:${coreStubPassword}@${domain}`;
  }

  await this.page.goto(coreStubUrl);
  /** @type {IpvCoreStubPage} */
  this.ipvCoreStubCredentialIssuerPage = new IpvCoreStubCredentialIssuerPage(
    this.page
  );
  await this.ipvCoreStubCredentialIssuerPage.assertOnIpvCoreStubPage();
});

Given("I click the Passport CRI for the testEnvironment", async function () {
  if (!this.ipvCoreStubCredentialIssuerPage) {
    this.ipvCoreStubCredentialIssuerPage = new IpvCoreStubCredentialIssuerPage(
      this.page
    );
  }
  const testEnvironment = ConfigurationReader.get("ENVIRONMENT");
  await this.ipvCoreStubCredentialIssuerPage.clickVisitCredentialIssuers();
  await this.ipvCoreStubCredentialIssuerPage.clickCRIForEnvironment(
    testEnvironment
  );
  await expect(this.page).toHaveURL(/credential-issuer\?cri=passport-v1-cri/);
});

Given(
  "I search for user number {int} in the ThirdParty table",
  async function (userNumber) {
    if (!this.ipvCoreStubCredentialIssuerPage) {
      this.ipvCoreStubCredentialIssuerPage =
        new IpvCoreStubCredentialIssuerPage(this.page);
    }
    await this.ipvCoreStubCredentialIssuerPage.searchForUATUser(
      String(userNumber)
    );
  }
);

Given(
  /^I search for user name (.*) in the ThirdParty table$/,
  async function (userName) {
    if (!this.ipvCoreStubCredentialIssuerPage) {
      this.ipvCoreStubCredentialIssuerPage =
        new IpvCoreStubCredentialIssuerPage(this.page);
    }
    await this.ipvCoreStubCredentialIssuerPage.searchForUATUserByUserName(
      String(userName)
    );
  }
);

When(/^User clicks the Go to Passport CRI button$/, async function () {
  if (!this.ipvCoreStubUserSearchPage) {
    this.ipvCoreStubUserSearchPage = new IpvCoreStubUserSearchPage(this.page);
  }
  await this.ipvCoreStubUserSearchPage.userSearchGoToPassportCri();
});

When(/^User clicks Edit User button$/, async function () {
  if (!this.ipvCoreStubUserSearchPage) {
    this.ipvCoreStubUserSearchPage = new IpvCoreStubUserSearchPage(this.page);
  }
  await this.ipvCoreStubUserSearchPage.userSearchEditUser();
});

When(
  /^I update the user details with given name (.*), family name (.*)$/,
  async function (givenName, familyName) {
    this.ipvCoreStubUserEditPage = new IpvCoreStubUserEditPage(this.page);

    const detailsToUpdate = {
      givenName: givenName,
      familyName: familyName
    };
    await this.ipvCoreStubUserEditPage.updateUserDetails(detailsToUpdate);
  }
);

Then(/^User is navigated to the Passport (.*) Page$/, async function (path) {
  if (!this.passportDetailsPagePage) {
    this.passportDetailsPagePage = new PassportDetailsPage(this.page);
  }
  await this.passportDetailsPagePage.assertUrlPathContains(path);
});

Then(/^User clicks the passport continue button$/, async function () {
  this.passportDetailsPagePage = new PassportDetailsPage(this.page);

  await this.passportDetailsPagePage.clickContinue();
});

Then(
  /^User enter data as a (.*)$/,
  { timeout: 2 * 5000 },
  async function (passportSubject) {
    this.passportDetailsPagePage = new PassportDetailsPage(this.page);
    await this.passportDetailsPagePage.userEntersData(passportSubject);
  }
);

Then(
  /^User is navigated to the Verifiable Credential Issuers Page$/,
  async function () {
    this.ipvCoreStubVerifyVcPage = new IpvCoreStubVerfiyVcPage(this.page);
    const expectedSubstring = "callback";

    await this.ipvCoreStubVerifyVcPage.verifyCurrentUrlContains(
      expectedSubstring
    );
  }
);

Then(
  /^The VC contains the expected response for (.+) (.+) with (.*) (.*) and (.*)$/,
  async function (
    expectedGivenName,
    expectedFamilyName,
    expectedStrengthScore,
    expectedValidityScore,
    expectedCi
  ) {
    this.ipvCoreStubVerifyVcPage = new IpvCoreStubVerfiyVcPage(this.page);
    await this.ipvCoreStubVerifyVcPage.validateJsonResponseFromPassportCri(
      expectedGivenName,
      expectedFamilyName,
      expectedStrengthScore,
      expectedValidityScore,
      expectedCi
    );
    await expect(this.page).toHaveURL(/callback\?client_id=/);
  }
);
