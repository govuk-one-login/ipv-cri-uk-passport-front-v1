const { Given, When, Then } = require("@cucumber/cucumber");

const { PassportPage } = require("../pages/PassportPage.js");

const { expect } = require("chai");

const { injectAxe } = require("axe-playwright");

Then(/^I can see CTA {string}$/, async function () {});

Then(
  /^I should be on the Passport details entry page (.*)$/,
  async function (PassportPageTitle) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertPageTitle(PassportPageTitle);
  }
);

Given(
  /^I run the Axe Accessibility check against the Passport details entry page$/,
  async function () {
    await injectAxe(this.page);
    // Run Axe for WCAG 2.2 AA rules
    const wcagResults = await this.page.evaluate(() => {
      return axe.run({
        runOnly: ["wcag22aa"]
      });
    });
    expect(wcagResults.violations).to.be.empty;
  }
);

Then(
  /^I see the Device Intelligence Cookie (.*)$/,
  async function (deviceIntelligenceCookieName) {
    const passportPage = new PassportPage(this.page);
    await passportPage.checkDeviceIntelligenceCookie(
      deviceIntelligenceCookieName
    );
  }
);

Then(/^User clicks on continue$/, { timeout: 2 * 5000 }, async function () {
  const passportPage = new PassportPage(this.page);
  await passportPage.clickOnContinue();
});

Given(
  /^they click Footer (.*) and assert I have been redirected correctly$/,
  async function (linkName) {
    const passportPage = new PassportPage(this.page);

    expect(passportPage.isCurrentPage()).to.be.true;

    await passportPage.assertFooterLinks(linkName);
  }
);

When(
  /^they view the Beta banner with the text as (.*)$/,
  async function (betaBannerText) {
    const passportPage = new PassportPage(this.page);

    expect(passportPage.isCurrentPage()).to.be.true;

    await passportPage.assertBetaBannerText(betaBannerText);
  }
);

Then(
  /^I select Accept analytics cookies button and see the text (.*)$/,
  async function (acceptCookiesText) {
    const passportPage = new PassportPage(this.page);

    await passportPage.assertAcceptCookies(acceptCookiesText);
  }
);

Then(
  "I select the accepted link change your cookie settings and assert I have been redirected correctly",
  async function () {
    const passportPage = new PassportPage(this.page);

    await passportPage.assertAcceptedCookiesSettingLink();
  }
);

Then(
  /^I select Reject analytics cookies button and see the text (.*)$/,
  async function (rejectCookiesText) {
    const passportPage = new PassportPage(this.page);

    await passportPage.assertRejectCookies(rejectCookiesText);
  }
);

Then(
  "I select the rejected link change your cookie settings and assert I have been redirected correctly",
  async function () {
    const passportPage = new PassportPage(this.page);

    await passportPage.assertRejectedCookiesSettingLink();
  }
);

When(
  /^they view the Beta banner with the Welsh text as (.*)$/,
  async function (betaBannerWelshText) {
    const passportPage = new PassportPage(this.page);

    await passportPage.assertBetaBannerWelshText(betaBannerWelshText);
  }
);

Given(
  /^User enters passport data as a (.*)$/,
  { timeout: 2 * 5000 },
  async function (passportSubject) {
    const passportPage = new PassportPage(this.page);
    await passportPage.userEntersData(passportSubject);
  }
);

When(
  /^they (?:have )?start(?:ed)? the Passport journey$/,
  async function () {}
);

// Re-enter test data step-defs

Then(
  /^User re-enters last name as (.*)$/,
  { timeout: 2 * 5000 },
  async function (InvalidLastName) {
    const passportPage = new PassportPage(this.page);
    await passportPage.userReEntersLastName(InvalidLastName);
  }
);

Then(
  /^User re-enters first name as (.*)$/,
  { timeout: 2 * 5000 },
  async function (InvalidFirstName) {
    const passportPage = new PassportPage(this.page);
    await passportPage.userReEntersFirstName(InvalidFirstName);
  }
);

Then(
  /^User re-enters middle names as (.*)$/,
  { timeout: 2 * 5000 },
  async function (InvalidMiddleNames) {
    const passportPage = new PassportPage(this.page);
    await passportPage.userReEntersMiddleName(InvalidMiddleNames);
  }
);

Then(
  /^User re-enters passportNumber as (.*)$/,
  { timeout: 2 * 5000 },
  async function (InvalidPassportNumber) {
    const passportPage = new PassportPage(this.page);
    await passportPage.userReEntersPassportNumber(InvalidPassportNumber);
  }
);

Then(
  /^User re-enters day of birth as (.*)$/,
  { timeout: 2 * 5000 },
  async function (InvalidDayOfBirth) {
    const passportPage = new PassportPage(this.page);
    await passportPage.userReEntersDayOfBirth(InvalidDayOfBirth);
  }
);

Then(
  /^User re-enters month of birth as (.*)$/,
  { timeout: 2 * 5000 },
  async function (InvalidMonthOfBirth) {
    const passportPage = new PassportPage(this.page);
    await passportPage.userReEntersMonthOfBirth(InvalidMonthOfBirth);
  }
);

Then(
  /^User re-enters year of birth as (.*)$/,
  { timeout: 2 * 5000 },
  async function (InvalidYearOfBirth) {
    const passportPage = new PassportPage(this.page);
    await passportPage.userReEntersYearOfBirth(InvalidYearOfBirth);
  }
);

Then(
  /^User enters expiry date as current date$/,
  { timeout: 2 * 5000 },
  async function () {
    const passportPage = new PassportPage(this.page);
    await passportPage.userReEntersExpiryDateAsCurrentDate();
  }
);

Then(
  /^User re-enters expiry day as (.*)$/,
  { timeout: 2 * 5000 },
  async function (InvalidExpiryDay) {
    const passportPage = new PassportPage(this.page);
    await passportPage.userReEntersExpiryDay(InvalidExpiryDay);
  }
);

Then(
  /^User re-enters expiry month as (.*)$/,
  { timeout: 2 * 5000 },
  async function (InvalidExpiryMonth) {
    const passportPage = new PassportPage(this.page);
    await passportPage.userReEntersExpiryMonth(InvalidExpiryMonth);
  }
);

Then(
  /^User re-enters expiry year as (.*)$/,
  { timeout: 2 * 5000 },
  async function (InvalidExpiryYear) {
    const passportPage = new PassportPage(this.page);
    await passportPage.userReEntersExpiryYear(InvalidExpiryYear);
  }
);

Then(
  /^User enters expiry day as current day minus (.*)$/,
  { timeout: 2 * 5000 },
  async function (daysToSubtract) {
    const passportPage = new PassportPage(this.page);
    await passportPage.userReEntersExpiryDayAsCurrentDateMinus(daysToSubtract);
  }
);

Then(
  /^User enters expiry day as current day plus (.*)$/,
  { timeout: 2 * 5000 },
  async function (daysToAdd) {
    const passportPage = new PassportPage(this.page);
    await passportPage.userReEntersExpiryDayAsCurrentDatePlus(daysToAdd);
  }
);

Then(
  /^User enters year of issue as current year minus (.*)$/,
  { timeout: 2 * 5000 },
  async function (yearsToSubtract) {
    const passportPage = new PassportPage(this.page);
    await passportPage.userReEntersExpiryYearAsCurrentDateMinus(
      yearsToSubtract
    );
  }
);

Then(
  /^User enters expiry month as current month minus (.*)$/,
  { timeout: 2 * 5000 },
  async function (monthToSubtract) {
    const passportPage = new PassportPage(this.page);
    await passportPage.userReEntersExpiryMonthAsCurrentDateMinus(
      monthToSubtract
    );
  }
);

// Summary box and field errors step-defs

Then(
  /^I see the Lastname error in the error summary as (.*)$/,
  async function (errorSummaryText) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertInvalidLastNameInErrorSummary(errorSummaryText);
  }
);

Then(
  /^I see the Lastname error in the error field as (.*)$/,
  async function (fieldErrorText) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertInvalidLastNameOnField(fieldErrorText);
  }
);

Then(
  /^I see the Firstname error summary as (.*)$/,
  async function (errorSummaryText) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertInvalidFirstNameInErrorSummary(errorSummaryText);
  }
);

Then(
  /^I see the Firstname error in the error field as (.*)$/,
  async function (fieldErrorText) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertInvalidFirstNameOnField(fieldErrorText);
  }
);

Then(
  /^I see the middlenames error summary as (.*)$/,
  async function (errorSummaryText) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertInvalidMiddleNameInErrorSummary(errorSummaryText);
  }
);

Then(
  /^I see the middlenames error in the error field as (.*)$/,
  async function (fieldErrorText) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertInvalidMiddleNameOnField(fieldErrorText);
  }
);

Then(
  /^I see the Passport number error in the summary as (.*)$/,
  async function (errorSummaryText) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertInvalidPassportNumberInErrorSummary(
      errorSummaryText
    );
  }
);

Then(
  /^I can see the Passport number error in the field as (.*)$/,
  async function (fieldErrorText) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertInvalidPassportNumberOnField(fieldErrorText);
  }
);

Then(
  /^Proper error message is displayed as (.*)$/,
  async function (retryMessageHeading) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertRetryErrorMessage(retryMessageHeading);
  }
);

Then(
  /^I see the Passport number error summary as (.*)$/,
  async function (errorSummaryText) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertInvalidPassportNumberInErrorSummary(
      errorSummaryText
    );
  }
);

Then(
  /^I see the Passport number error in field as (.*)$/,
  async function (fieldErrorText) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertInvalidPassportNumberOnField(fieldErrorText);
  }
);

Then(
  /^I see the date of birth error summary as (.*)$/,
  async function (errorSummaryText) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertInvalidDoBInErrorSummary(errorSummaryText);
  }
);

Then(
  /^I see the date of birth error in the field as (.*)$/,
  async function (fieldErrorText) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertInvalidDoBOnField(fieldErrorText);
  }
);

Then(
  /^I see expiry date error summary as (.*)$/,
  async function (errorSummaryText) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertInvalidExpiryInErrorSummary(errorSummaryText);
  }
);

Then(
  /^I see invalid expiry date in the field as (.*)$/,
  async function (fieldErrorText) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertInvalidExpiryOnField(fieldErrorText);
  }
);

Then(
  /^I can see the valid to date error in the error summary as (.*)$/,
  async function (errorSummaryText) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertInvalidValidToDateInErrorSummary(errorSummaryText);
  }
);

Then(
  /^I can see the Valid to date field error as (.*)$/,
  async function (fieldErrorText) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertInvalidValidToDateOnField(fieldErrorText);
  }
);

//################### Text content comparisons ########################

Then(
  /^I view the (.*) banner$/,
  { timeout: 2 * 5000 },
  async function (betaBannerLabel) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertBetaBanner(betaBannerLabel);
  }
);

Then(/^the beta banner reads (.*)$/, async function (betaBannerText) {
  const passportPage = new PassportPage(this.page);
  await passportPage.assertBetaBannerText(betaBannerText);
});

Then(
  /^I see Contact the One Login team link reads (.*)$/,
  async function (contactOneLoginTeamLink) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertContactOneLoginTeamLink(contactOneLoginTeamLink);
  }
);

Then(/^I can see the DoB fields titled (.*)$/, async function (dobFieldTitle) {
  const passportPage = new PassportPage(this.page);
  await passportPage.assertDoBFieldTitle(dobFieldTitle);
});

Then(/^I can see example as (.*)$/, async function (dobExample) {
  const passportPage = new PassportPage(this.page);
  await passportPage.assertDobExample(dobExample);
});

Then(/^I can see date as (.*)$/, async function (day) {
  const passportPage = new PassportPage(this.page);
  await passportPage.assertDay(day);
});

Then(/^I can see month as (.*)$/, async function (month) {
  const passportPage = new PassportPage(this.page);
  await passportPage.assertMonth(month);
});

Then(/^I can see year as (.*)$/, async function (year) {
  const passportPage = new PassportPage(this.page);
  await passportPage.assertYear(year);
});

Then(/^I see error word as (.*)$/, async function (errorPrefix) {
  const passportPage = new PassportPage(this.page);
  await passportPage.assertErrorPrefix(errorPrefix);
});

Then(
  /^I see Check your details as (.*)$/,
  async function (errorSummaryMessage) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertYouWillBeAbleToFindSentence(errorSummaryMessage);
  }
);

Given(
  /^The Support link in the footer reads (.*) and assert the url is correct and live$/,
  async function (supportFooterLink) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertFooterLink(supportFooterLink);
  }
);

Given(
  /^I assert the link in the banner is correct and live$/,
  async function () {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertBannerLink();
  }
);

Given(
  /^I assert the link on the error page is correct and live$/,
  async function () {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertErrorLink();
  }
);

Given(
  /^I assert the link on the page not found page is correct and live$/,
  async function () {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertNotFoundLink();
  }
);

Given(/^I delete the session cookie$/, async function () {
  const passportPage = new PassportPage(this.page);
  await passportPage.deleteSessionCookie();
});

Given(/^I go to page not found$/, async function () {
  const passportPage = new PassportPage(this.page);
  await passportPage.goToPage("not-found");
});

Then(
  /^I see the heading (.*)$/,
  { timeout: 2 * 5000 },
  async function (pageHeading) {
    const passportPage = new PassportPage(this.page);
    await passportPage.assertPageHeading(pageHeading);
  }
);
