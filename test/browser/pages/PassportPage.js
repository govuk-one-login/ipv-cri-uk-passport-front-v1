const { expect: expect } = require("chai");
const moment = require("moment");
const TestDataCreator = require("../util/TestDataCreator");

exports.PassportPage = class PlaywrightDevPage {
  constructor(page) {
    this.page = page;
    this.url = "http://localhost:5050/details";

    this.passportNumber = this.page.locator('xpath=//*[@id="passportNumber"]');

    this.skipToMainContent = this.page.locator("xpath=//html/body/a");

    this.lastName = this.page.locator('xpath=//*[@id="surname"]');
    this.firstName = this.page.locator('xpath=//*[@id="firstName"]');
    this.middleNames = this.page.locator('xpath=//*[@id="middleNames"]');

    this.birthDay = this.page.locator('xpath=//*[@id="dateOfBirth-day"]');
    this.birthMonth = this.page.locator('xpath=//*[@id="dateOfBirth-month"]');
    this.birthYear = this.page.locator('xpath=//*[@id="dateOfBirth-year"]');

    this.footerLinks = {
      Accessibility: this.page.locator(
        "xpath=/html/body/footer/div/div/div[1]/ul/li[1]/a"
      ),
      Cookies: this.page.locator(
        "xpath=/html/body/footer/div/div/div[1]/ul/li[2]/a"
      ),
      TsAndCs: this.page.locator(
        "xpath=/html/body/footer/div/div/div[1]/ul/li[3]/a"
      ),
      Privacy: this.page.locator(
        "xpath=/html/body/footer/div/div/div[1]/ul/li[4]/a"
      ),
      Support: this.page.locator(
        "xpath=/html/body/footer/div/div/div[1]/ul/li[5]/a"
      ),
      OGL: this.page.locator("xpath=/html/body/footer/div/div/div[1]/span/a"),
      CrownCopyright: this.page.locator(
        "xpath=/html/body/footer/div/div/div[2]/a"
      )
    };

    this.passportValidToDay = this.page.locator(
      'xpath=//*[@id="expiryDate-day"]'
    );
    this.passportValidToMonth = this.page.locator(
      'xpath=//*[@id="expiryDate-month"]'
    );
    this.passportValidToYear = this.page.locator(
      'xpath=//*[@id="expiryDate-year"]'
    );
    this.supportLink = this.page.locator(
      "xpath=/html/body/footer/div/div/div[1]/ul/li[5]/a"
    );

    this.header = this.page.locator('xpath=//*[@id="header"]');

    // Error summary items

    this.invalidLastNameErrorInSummary = this.page.locator(
      'xpath=//*[@class="govuk-error-summary error-summary"]//*[@class="govuk-error-summary__body"]//*[@class="govuk-list govuk-error-summary__list"]//*[contains(@href,"#surname")]'
    );

    this.invalidFirstNameErrorInSummary = this.page.locator(
      'xpath=//*[@class="govuk-error-summary error-summary"]//*[@class="govuk-error-summary__body"]//*[@class="govuk-list govuk-error-summary__list"]//*[contains(@href,"#firstName")]'
    );

    this.invalidMiddleNamesErrorInSummary = this.page.locator(
      'xpath=//*[@class="govuk-error-summary error-summary"]//*[@class="govuk-error-summary__body"]//*[@class="govuk-list govuk-error-summary__list"]//*[contains(@href,"#middleNames")]'
    );

    this.errorSummaryBoxPassportNumber = this.page.locator(
      'xpath=//*[@class="govuk-error-summary error-summary"]//*[@class="govuk-error-summary__body"]//*[@class="govuk-list govuk-error-summary__list"]//*[contains(@href,"#passportNumber")]'
    );

    this.invalidDobErrorInSummary = this.page.locator(
      'xpath=//*[@class="govuk-error-summary error-summary"]//*[@class="govuk-error-summary__body"]//*[@class="govuk-list govuk-error-summary__list"]//*[contains(@href,"#dateOfBirth-day")]'
    );

    this.invalidValidToDateErrorInSummary = this.page.locator(
      'xpath=//*[@class="govuk-error-summary error-summary"]//*[@class="govuk-error-summary__body"]//*[@class="govuk-list govuk-error-summary__list"]//*[contains(@href,"#expiryDate-day")]'
    );

    this.invalidValidToDateFieldError = this.page.locator(
      'xpath=//*[@id="expiryDate-error"]'
    );

    // Field errors

    this.invalidLastNameFieldError = this.page.locator(
      'xpath=//*[@id="surname-error"]'
    );
    this.invalidFirstNameFieldError = this.page.locator(
      'xpath=//*[@id="firstName-error"]'
    );
    this.invalidMiddleNamesFieldError = this.page.locator(
      'xpath=//*[@id="middleNames-error"]'
    );
    this.passportNumberFieldError = this.page.locator(
      'xpath=//*[@id="passportNumber-error"]'
    );

    this.passportNumberFieldError = this.page.locator(
      'xpath=//*[@id="passportNumber-error"]'
    );
    this.invalidDobFieldError = this.page.locator(
      'xpath=//*[@id="dateOfBirth-error"]'
    );

    this.Continue = this.page.locator('xpath=//*[@id="submitButton"]');

    // Content Fields

    this.betaBannerReads = this.page.locator(
      "xpath=/html/body/div[2]/div/p/span"
    );

    this.acceptCookiesButton = this.page.locator(
      "xpath=/html/body/div[1]/div[1]/div[2]/button[1]"
    );

    this.acceptCookiesMessage = this.page.locator(
      "xpath=/html/body/div[1]/div[2]/div[1]/div/div/p"
    );

    this.cookiesAcceptedSettingLink = this.page.locator(
      "xpath=/html/body/div[1]/div[2]/div[1]/div/div/p/a"
    );

    this.rejectCookiesButton = this.page.locator(
      "xpath=/html/body/div[1]/div[1]/div[2]/button[2]"
    );

    this.rejectCookiesMessage = this.page.locator(
      "xpath=/html/body/div[1]/div[3]/div[1]/div/div/p"
    );

    this.cookiesRejectedSettingLink = this.page.locator(
      "xpath=/html/body/div[1]/div[3]/div[1]/div/div/p/a"
    );

    this.betaBanner = this.page.locator("xpath=/html/body/div[2]/div");

    this.betaBannerText = this.page.locator(
      "xpath=/html/body/div[2]/div/p/span"
    );

    this.lastNameLabel = this.page.locator('xpath=//*[@id="surname-label"]');

    this.givenNameLegend = this.page.locator(
      'xpath=//*[@id="main-content"]/div/div/form/div[2]/fieldset/legend'
    );

    this.firstNameLabel = this.page.locator('xpath=//*[@id="firstName-label"]');

    this.middleNames = this.page.locator('xpath=//*[@id="middleNames-label"]');

    this.firstNameSentence = this.page.locator(
      'xpath=//*[@id="firstName-hint"]'
    );
    this.middleNameSentence = this.page.locator(
      'xpath=//*[@id="middleNames-hint"]'
    );

    this.dobFieldTitleLegend = this.page.locator(
      'xpath=//*[@id="dateOfBirth-fieldset"]/legend'
    );

    this.dobExample = this.page.locator('xpath=//*[@id="dateOfBirth-hint"]');

    this.dayLabel = this.page.locator(
      'xpath=//*[@id="dateOfBirth"]/div[1]/div/label'
    );

    this.monthLabel = this.page.locator(
      'xpath=//*[@id="dateOfBirth"]/div[2]/div/label'
    );

    this.yearLabel = this.page.locator(
      'xpath=//*[@id="dateOfBirth"]/div[3]/div/label'
    );

    this.validToFieldTitleLegend = this.page.locator(
      'xpath=//*[@id="expiryDate-fieldset"]/legend'
    );

    this.validToFieldHint = this.page.locator(
      'xpath=//*[@id="expiryDate-hint"]'
    );

    this.validTodayLabel = this.page.locator(
      'xpath=//*[@id="expiryDate"]/div[1]/div/label'
    );

    this.validToMonthLabel = this.page.locator(
      'xpath=//*[@id="expiryDate"]/div[2]/div/label'
    );

    this.validToYearLabel = this.page.locator(
      'xpath=//*[@id="expiryDate"]/div[3]/div/label'
    );

    this.passportNumberLabel = this.page.locator(
      'xpath=//*[@id="passportNumber-label"]'
    );

    this.passportNumberHint = this.page.locator(
      'xpath=//*[@id="passportNumber-hint"]'
    );

    this.retryCheckDetailsTitleLabel = this.page.locator(
      'xpath=//*[@id="header"]'
    );

    this.errorText = this.page.locator(
      'xpath=//*[@id="govuk-notification-banner-title"]'
    );

    this.thereWasAProblemFirstSentence = this.page.locator(
      'xpath=//*[@id="main-content"]/div/div/div[1]/div[2]/p[1]'
    );

    this.betaBannerLink = this.page.locator(
      "xpath=/html/body/div[2]/div/p/span/a"
    );

    this.errorLink = this.page.locator(
      'xpath=//*[@id="main-content"]/div/div/p[6]/a'
    );

    this.notFoundLink = this.page.locator(
      'xpath=//*[@id="main-content"]/div/div/p[5]/a'
    );
  }

  isCurrentPage() {
    return (
      this.page.url() === this.url || this.page.url() === this.url + "?lng=cy"
    );
  }

  async assertPageTitle(PassportPageTitle) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.page.title()).to.equal(PassportPageTitle);
  }

  async clickOnContinue() {
    await this.Continue.click();
  }

  async userEntersData(passportSubjectScenario) {
    var passportSubject = TestDataCreator.getPassportTestUserFromMap(
      passportSubjectScenario
    );
    await this.passportNumber.fill(passportSubject.getPassportNumber());
    await this.birthDay.fill(passportSubject.getBirthDay());
    await this.birthMonth.fill(passportSubject.getBirthMonth());
    await this.birthYear.fill(passportSubject.getBirthYear());

    if ((await passportSubject.getMiddleNames()) != null) {
      await this.middleNames.fill(passportSubject.getMiddleNames());
    }
    await this.firstName.fill(passportSubject.getFirstName());
    await this.lastName.fill(passportSubject.getLastName());
    await this.passportValidToDay.fill(passportSubject.getPassportValidToDay());
    await this.passportValidToMonth.fill(
      passportSubject.getPassportValidToMonth()
    );
    await this.passportValidToYear.fill(
      passportSubject.getPassportValidToYear()
    );
  }

  // Re-enter test data

  async userReEntersLastName(InvalidLastName) {
    await this.lastName.fill(InvalidLastName);
  }

  async userReEntersFirstName(InvalidFirstName) {
    await this.firstName.fill(InvalidFirstName);
  }

  async userReEntersMiddleName(InvalidMiddleNames) {
    await this.middleNames.fill(InvalidMiddleNames);
  }

  async userReEntersPassportNumber(InvalidPassportNumber) {
    await this.passportNumber.fill(InvalidPassportNumber);
  }

  async userReEntersDayOfBirth(InvalidDayOfBirth) {
    await this.birthDay.fill(InvalidDayOfBirth);
  }

  async userReEntersMonthOfBirth(InvalidMonthOfBirth) {
    await this.birthMonth.fill(InvalidMonthOfBirth);
  }

  async userReEntersYearOfBirth(InvalidYearOfBirth) {
    await this.birthYear.fill(InvalidYearOfBirth);
  }

  async userReEntersExpiryDay(InvalidExpiryDay) {
    await this.passportValidToDay.fill(InvalidExpiryDay);
  }

  async userReEntersExpiryDayAsCurrentDatePlus(days) {
    await this.passportValidToDay.fill(moment().add(days, "days").format("DD"));
  }

  async userReEntersExpiryMonth(InvalidExpiryMonth) {
    await this.passportValidToMonth.fill(InvalidExpiryMonth);
  }

  async userReEntersExpiryYear(InvalidExpiryYear) {
    await this.passportValidToYear.fill(InvalidExpiryYear);
  }

  //Field Labels and hint texts

  async assertLastNameLabel(lastNameLabelText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.lastNameLabel.innerText()).to.equal(lastNameLabelText);
  }

  async assertFirstNameLabel(firstNameLabelText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.firstNameLabel.innerText()).to.equal(firstNameLabelText);
  }

  async assertMiddleNameLabel(middleNameLabelText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.middleNames.innerText()).to.equal(middleNameLabelText);
  }

  async assertMiddleNameHint(middleNameHintText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.middleNameSentence.innerText()).to.equal(
      middleNameHintText
    );
  }

  async assertDobExample(dobExampleText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.dobExample.innerText()).to.equal(dobExampleText);
  }

  async assertDobDayLabel(dobDayLabelText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.dayLabel.innerText()).to.equal(dobDayLabelText);
  }

  async assertDobMonthLabel(dobMonthLabelText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.monthLabel.innerText()).to.equal(dobMonthLabelText);
  }

  async assertDobYearLabel(dobYearLabelText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.yearLabel.innerText()).to.equal(dobYearLabelText);
  }

  async assertDoBFieldTitle(dobTitle) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.dobFieldTitleLegend.innerText()).to.equal(dobTitle);
  }

  async assertPassportTitle(passportTitle) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.passportNumberLabel.innerText()).to.equal(passportTitle);
  }

  async assertPassportHint(passportHint) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.passportNumberHint.innerText()).to.equal(passportHint);
  }

  // Summary box errors

  async assertInvalidLastNameInErrorSummary(errorSummaryText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.invalidLastNameErrorInSummary.innerText()).to.equal(
      errorSummaryText
    );
  }

  async assertInvalidFirstNameInErrorSummary(errorSummaryText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.invalidFirstNameErrorInSummary.innerText()).to.equal(
      errorSummaryText
    );
  }

  async assertInvalidMiddleNameInErrorSummary(errorSummaryText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.invalidMiddleNamesErrorInSummary.innerText()).to.equal(
      errorSummaryText
    );
  }

  async assertInvalidPassportNumberInErrorSummary(errorSummaryText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.errorSummaryBoxPassportNumber.innerText()).to.equal(
      errorSummaryText
    );
  }

  async assertInvalidExpiryInErrorSummary(errorSummaryText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.invalidValidToDateErrorInSummary.innerText()).to.equal(
      errorSummaryText
    );
  }

  async assertInvalidDoBInErrorSummary(errorSummaryText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.invalidDobErrorInSummary.innerText()).to.equal(
      errorSummaryText
    );
  }

  async assertInvalidValidToDateInErrorSummary(errorSummaryText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.invalidValidToDateErrorInSummary.innerText()).to.equal(
      errorSummaryText
    );
  }

  // Field errors

  async assertInvalidLastNameOnField(fieldErrorText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.invalidLastNameFieldError.innerText()).to.contains(
      fieldErrorText
    );
  }

  async assertInvalidFirstNameOnField(fieldErrorText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.invalidFirstNameFieldError.innerText()).to.contains(
      fieldErrorText
    );
  }

  async assertInvalidMiddleNameOnField(fieldErrorText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.invalidMiddleNamesFieldError.innerText()).to.contains(
      fieldErrorText
    );
  }

  async assertInvalidExpiryOnField(fieldErrorText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.invalidValidToDateFieldError.innerText()).to.contains(
      fieldErrorText
    );
  }

  async assertInvalidPassportNumberOnField(fieldErrorText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.passportNumberFieldError.innerText()).to.contains(
      fieldErrorText
    );
  }

  async assertInvalidDoBOnField(fieldErrorText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.invalidDobFieldError.innerText()).to.contains(
      fieldErrorText
    );
  }

  async assertSkipToMainContent(skipToMainContent) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.skipToMainContent.textContent(skipToMainContent);
    expect(await this.skipToMainContent.textContent()).to.contains(
      skipToMainContent
    );
  }

  async assertBetaBanner(betaBannerLabel) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    await expect(await this.betaBanner.textContent()).to.contains(
      betaBannerLabel
    );
  }

  async assertAcceptCookies(acceptCookiesText) {
    await this.acceptCookiesButton.click();
    expect(await this.acceptCookiesMessage.innerText()).to.equal(
      acceptCookiesText
    );
  }

  async assertAcceptedCookiesSettingLink() {
    await this.cookiesAcceptedSettingLink.click();
    await this.page.waitForTimeout(3000); //waitForNavigation and waitForLoadState do not work in this case
    let context = this.page.context();
    let pages = context.pages();
    expect(pages[0].url()).to.equal("https://signin.account.gov.uk/cookies");
  }

  async assertRejectCookies(rejectCookiesText) {
    await this.rejectCookiesButton.click();
    expect(await this.rejectCookiesMessage.innerText()).to.equal(
      rejectCookiesText
    );
  }

  async assertRejectedCookiesSettingLink() {
    await this.cookiesRejectedSettingLink.click();
    await this.page.waitForTimeout(3000); //waitForNavigation and waitForLoadState do not work in this case
    let context = await this.page.context();
    let pages = context.pages();
    expect(pages[0].url()).to.equal("https://signin.account.gov.uk/cookies");
  }

  async assertBetaBannerWelshText(betaBannerWelshText) {
    expect(await this.betaBannerText.innerText()).to.equal(betaBannerWelshText);
  }

  async assertContactOneLoginTeamLink(contactOneLoginTeamLink) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.errorLink.innerText()).to.equal(contactOneLoginTeamLink);
  }

  async assertFooterLinkText(supportFooterLink) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.supportLink.innerText()).to.equal(supportFooterLink);
  }

  async assertFooterLinkIsCorrectAndLive() {
    await this.page.waitForLoadState("domcontentloaded");

    const newPagePromise = this.page.waitForEvent("popup");

    await this.supportLink.click();
    await this.assertNewPageIsCorrectAndLive(newPagePromise);
  }

  async assertFooterLinks(linkName) {
    const timeout = 10000;
    const linkLocator = this.footerLinks[linkName];

    if (!linkLocator) {
      throw new Error(`No locator defined for footer link: ${linkName}`);
    }

    // Define urlAssertions only once
    const urlAssertions = {
      Accessibility: "https://signin.account.gov.uk/accessibility-statement",
      Cookies: "https://signin.account.gov.uk/cookies",
      TsAndCs: "https://signin.account.gov.uk/terms-and-conditions",
      Privacy:
        "https://www.gov.uk/government/publications/govuk-one-login-privacy-notice",
      Support: "https://home.account.gov.uk/contact-gov-uk-one-login",
      OGL: "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
      CrownCopyright:
        "https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/"
    };

    // Determine if the link opens in a new tab or not
    const targetAttribute = await linkLocator.evaluate((el) =>
      el.getAttribute("target")
    );
    const newTabExpected = targetAttribute === "_blank";

    if (newTabExpected) {
      await Promise.all([
        this.page.waitForEvent("popup", { timeout }),
        linkLocator.click({ modifier: "Ctrl" })
      ]);

      const pages = this.page.context().pages();
      const newTab = pages[pages.length - 1];

      expect(await newTab.title()).to.not.equal(
        "Page not found - GOV.UK One Login"
      );

      if (urlAssertions[linkName]) {
        expect(newTab.url()).to.contain(urlAssertions[linkName]);
      } else {
        throw new Error(
          `No URL assertion defined for footer link: ${linkName}`
        );
      }
    } else {
      // Pass a URL pattern or '*' to waitForURL
      await Promise.all([
        this.page.waitForURL(/.*/, { timeout }), // Wait for any URL change
        linkLocator.click()
      ]);

      if (urlAssertions[linkName]) {
        expect(this.page.url()).to.contain(urlAssertions[linkName]);
      } else {
        throw new Error(
          `No URL assertion defined for footer link: ${linkName}`
        );
      }
    }
  }

  async assertErrorLinkIsCorrectAndLive() {
    const newPagePromise = this.page.waitForEvent("popup");

    await this.errorLink.click();
    await this.assertNewPageIsCorrectAndLive(newPagePromise);
  }

  async assertFeedbackLinkIsCorrectAndLive() {
    const timeout = 5000;
    const newPagePromise = this.page.waitForEvent("popup", { timeout });

    await this.betaBannerLink.click();
    await this.assertFeedbackPageIsCorrectAndLive(newPagePromise);
  }

  async assertNotFoundLinkIsCorrectAndLive() {
    const newPagePromise = this.page.waitForEvent("popup");

    await this.notFoundLink.click();
    await this.assertNewPageIsCorrectAndLive(newPagePromise);
  }

  async assertBannerLinkIsCorrectAndLive() {
    const newPagePromise = this.page.waitForEvent("popup");

    await this.betaBannerLink.click();
    await this.assertNewPageIsCorrectAndLive(newPagePromise);
  }

  async betaBannerDisplayed() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.betaBanner.isVisible();
  }

  async assertBetaBannerText(betaBannerText) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.betaBannerText.innerText()).to.equal(betaBannerText);
  }

  async deleteSessionCookie() {
    const cookieName = "service_session";
    const cookies = (await this.page.context().cookies()).filter(
      (cookie) => cookie.name !== cookieName
    );
    await this.page.context().clearCookies();
    await this.page.context().addCookies(cookies);
  }

  async goToPage(pageName) {
    await this.page.goto(this.page.url() + pageName);
  }

  async assertPageHeading(pageHeading) {
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.header.innerText()).to.equal(pageHeading);
  }

  async checkDeviceIntelligenceCookie(deviceIntelligenceCookieName) {
    // Wait for the page to fully load
    await this.page.waitForLoadState("networkidle", { timeout: 5000 });

    const cookies = await this.page.context().cookies();

    const cookie = cookies.find(
      (cookie) => cookie.name === deviceIntelligenceCookieName
    );

    if (!cookie) {
      throw new Error(
        `Cookie with name '${deviceIntelligenceCookieName}' not found.`
      );
    }

    if (
      cookie.value === undefined ||
      cookie.value === null ||
      cookie.value.trim() === ""
    ) {
      // Check for undefined, null, or empty string in value field of the cookie
      throw new Error(
        `Cookie with name '${deviceIntelligenceCookieName}' has no value.`
      );
    }

    return true;
  }

  async assertNewPageIsCorrectAndLive(newPagePromise) {
    const newPage = await newPagePromise;
    await newPage.waitForLoadState("domcontentloaded");

    const expectedURL = "https://home.account.gov.uk/contact-gov-uk-one-login";
    const unexpectedTitle = "Page not found - GOV.UK One Login";

    const actualTitle = await newPage.title();
    expect(actualTitle).to.not.equal(unexpectedTitle);

    const actualURL = await newPage.url();
    expect(actualURL).to.equal(expectedURL);

    await newPage.close();
  }

  async assertFeedbackPageIsCorrectAndLive(expectedURL) {
    const newPagePromise = this.page.waitForEvent("popup");

    await this.betaBannerLink.click();

    const newPage = await newPagePromise;
    await newPage.waitForLoadState("domcontentloaded");

    const actualURL = await newPage.url();

    expect(actualURL).to.contain(expectedURL); // Use to.equal for exact URL match

    await newPage.close();
  }
};
