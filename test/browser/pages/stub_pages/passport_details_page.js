const { expect } = require("@playwright/test");
const TestDataCreator = require("../../util/TestDataCreator");

module.exports = class PassportDetailsPage {
  constructor(page) {
    this.page = page;
    this.checkYourDetailsContinueButton = page.locator(
      'xpath=//*[@id="submitButton"]'
    );
    this.passportNumber = page.locator('xpath=//*[@id="passportNumber"]');
    this.lastName = page.locator('xpath=//*[@id="surname"]');
    this.firstName = page.locator('xpath=//*[@id="firstName"]');
    this.middleNames = page.locator('xpath=//*[@id="middleNames"]');
    this.birthDay = page.locator('xpath=//*[@id="dateOfBirth-day"]');
    this.birthMonth = page.locator('xpath=//*[@id="dateOfBirth-month"]');
    this.birthYear = page.locator('xpath=//*[@id="dateOfBirth-year"]');
    this.passportValidToDay = page.locator('xpath=//*[@id="expiryDate-day"]');
    this.passportValidToMonth = page.locator(
      'xpath=//*[@id="expiryDate-month"]'
    );
    this.passportValidToYear = page.locator('xpath=//*[@id="expiryDate-year"]');
  }

  async userEntersData(passportSubject) {
    const subject = TestDataCreator.getPassportTestUserFromMap(passportSubject);
    await this.passportNumber.fill(subject.getPassportNumber());
    await this.birthDay.fill(subject.getBirthDay());
    await this.birthMonth.fill(subject.getBirthMonth());
    await this.birthYear.fill(subject.getBirthYear());
    if (subject.getMiddleNames()) {
      await this.middleNames.fill(subject.getMiddleNames());
    }
    await this.firstName.fill(subject.getFirstName());
    await this.lastName.fill(subject.getLastName());
    await this.passportValidToDay.fill(subject.getPassportValidToDay());
    await this.passportValidToMonth.fill(subject.getPassportValidToMonth());
    await this.passportValidToYear.fill(subject.getPassportValidToYear());
  }

  async assertUrlPathContains(path) {
    const escapeRegExp = (string) => {
      return string.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
    };
    const regex = new RegExp(escapeRegExp(path));
    await expect(this.page).toHaveURL(regex);
  }

  async clickContinue() {
    await Promise.all([
      this.checkYourDetailsContinueButton.click(),
      this.page.waitForNavigation({ timeout: 40000 })
    ]);
  }
};
