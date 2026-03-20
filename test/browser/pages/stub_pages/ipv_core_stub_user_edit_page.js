module.exports = class IpvCoreStubUserEditPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.givenNameInput = page.locator('xpath=//*[@id="firstName"]');
    this.familyNameInput = page.locator('xpath=//*[@id="surname"]');
    this.buildingNameInput = page.locator('xpath=//*[@id="buildingName"]');
    this.buildingNumberInput = page.locator('xpath=//*[@id="buildingNumber"]');
    this.primaryPostcodeInput = page.locator('xpath=//*[@id="postCode"]');
    this.secondBuildingNameInput = page.locator(
      'xpath=//*[@id="SecondaryUKAddress.buildingName"]'
    );
    this.secondBuildingNumberInput = page.locator(
      'xpath=//*[@id="SecondaryUKAddress.buildingNumber"]'
    );
    this.secondaryPostcodeInput = page.locator(
      'xpath=//*[@id="SecondaryUKAddress.postCode"]'
    );
  }

  /**
   * Updates user details on the page.
   * Fields are only updated if a non-empty string, non-null, and non-undefined value is provided.
   *
   * @param {object} details - An object containing user details.
   * @param {string|undefined} [details.givenName] - The given name to enter.
   * @param {string|undefined} [details.familyName] - The family name to enter.
   * @param {string|undefined} [details.buildingName] - The building name to enter.
   * @param {string|undefined} [details.buildingNumber] - The building number to enter.
   * @param {string|undefined} [details.primaryPostcode] - The primary postcode to enter.
   * @param {string|undefined} [details.secondBuildingName] - The second building name to enter.
   * @param {string|undefined} [details.secondBuildingNumber] - The second building number to enter.
   * @param {string|undefined} [details.secondaryPostcode] - The secondary postcode to enter.
   */
  async updateUserDetails(details) {
    const fillIfProvided = async (locator, value) => {
      if (value !== undefined && value !== null) {
        await locator.fill(value);
      }
    };
    await fillIfProvided(this.givenNameInput, details.givenName);
    await fillIfProvided(this.familyNameInput, details.familyName);
    await fillIfProvided(this.buildingNameInput, details.buildingName);
    await fillIfProvided(this.buildingNumberInput, details.buildingNumber);
    await fillIfProvided(this.primaryPostcodeInput, details.primaryPostcode);
    await fillIfProvided(
      this.secondBuildingNameInput,
      details.secondBuildingName
    );
    await fillIfProvided(
      this.secondBuildingNumberInput,
      details.secondBuildingNumber
    );
    await fillIfProvided(
      this.secondaryPostcodeInput,
      details.secondaryPostcode
    );
  }
};
