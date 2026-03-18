const { expect } = require("@playwright/test");

module.exports = class IpvCoreStubCredentialIssuerPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    // Selectors for elements on the IPV Core Stub page
    this.visitCredentialIssuersButton = page.locator(
      'button:has-text("Visit Credential Issuers")'
    );
    this.passportCRIBuildButton = page.locator(
      'xpath=//*[@id="passport-v1-cri-build"]'
    );
    this.passportCRIDevButton = page.locator(
      'xpath=//*[@id="passport-v1-cri-dev"]'
    );
    this.passportCRIStagingButton = page.locator(
      'xpath=//*[@id="passport-v1-cri-staging"]'
    );
    this.rowNumberInput = page.locator("#rowNumber");
    this.userNameInput = page.locator('xpath=//*[@id="name"]');

    this.goToPassportCriSearchButton = page.locator(
      '//*[@id="main-content"]/form[2]/div/button'
    );
    this.searchForUatUserButton = page.locator(
      '//*[@id="main-content"]/form[1]/div/button'
    );
  }

  async assertOnIpvCoreStubPage() {
    await expect(this.page).toHaveTitle(/IPV Core Stub/);
  }

  async clickVisitCredentialIssuers() {
    await this.visitCredentialIssuersButton.click();
  }

  async clickCRIForEnvironment(environment) {
    switch (environment.toLowerCase()) {
      case "dev":
        await this.passportCRIDevButton.click();
        break;
      case "build":
        await this.passportCRIBuildButton.click();
        break;
      case "staging":
        await this.passportCRIStagingButton.click();
        break;
      default:
        throw new Error(`Unsupported Passport CRI environment: ${environment}`);
    }
  }

  async searchForUATUser(userNumber) {
    await expect(this.page).toHaveURL(/credential-issuer\?cri=passport-v1-cri/);

    await this.rowNumberInput.fill(userNumber);
    await this.goToPassportCriSearchButton.click();
  }

  async searchForUATUserByUserName(userName) {
    await expect(this.page).toHaveURL(/credential-issuer\?cri=passport-v1-cri/);

    await this.userNameInput.fill(userName);
    await this.searchForUatUserButton.click();
  }
};
