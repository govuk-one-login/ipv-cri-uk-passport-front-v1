const { expect } = require("@playwright/test");

module.exports = class IpvCoreStubVerfiyVcPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    // Selectors for elements on the IPV Core Stub page
    this.JsonResponseFromPassportCri = page.locator(
      'xpath=//*[@id="main-content"]/div/details/summary'
    );
    this.jsonDataElement = page.locator('xpath=//*[@id="data"]');
  }

  async ensureJsonDataElementAvailable() {
    try {
      if (await this.JsonResponseFromPassportCri.isVisible()) {
        await this.JsonResponseFromPassportCri.click();
      } else {
        await this.page.evaluate(() => {
          const summary = document.querySelector(
            "#main-content div details summary"
          );
          if (summary && typeof summary.click === "function") {
            summary.click();
          }
        });
      }
    } catch (err) {
      throw new Error(
        `Failed to reveal JSON data element before reading it: ${err.message}`,
        { cause: err }
      );
    }
  }

  async readVcPayload() {
    await this.ensureJsonDataElementAvailable();

    const jsonString = (await this.jsonDataElement.textContent())?.trim();
    if (!jsonString) {
      const currentUrl = this.page.url();
      const elementExists = (await this.jsonDataElement.count()) > 0;
      throw new Error(
        `No JSON content found in the data element ("#data"). ` +
          `Element exists: ${elementExists}, Current URL: ${currentUrl}`
      );
    }
    try {
      const parsed = JSON.parse(jsonString);
      return parsed;
    } catch (err) {
      throw new Error(
        `Failed to parse JSON from VC payload: ${err.message}\nContent: ${jsonString}`,
        { cause: err }
      );
    }
  }

  async verifyCurrentUrlContains(expectedSubstring, timeout = 40000) {
    await this.page.waitForURL(`**/*${expectedSubstring}*`, { timeout });

    const currentUrl = this.page.url();
    if (!currentUrl.includes(expectedSubstring)) {
      throw new Error(
        `Expected URL to contain "${expectedSubstring}", but found "${currentUrl}"`
      );
    }
  }

  /**
   * Extracts name parts from the VC credential subject
   * @param {Object} parsedJson - The parsed VC JSON
   * @returns {Object} Object containing actualGivenName and actualFamilyName
   */
  extractNameParts(parsedJson) {
    const credentialSubjectName =
      parsedJson?.vc?.credentialSubject?.name?.[0]?.nameParts;
    if (!credentialSubjectName) {
      throw new Error(
        "Could not find vc.credentialSubject.name[0].nameParts in the JSON response. Check JSON structure."
      );
    }

    const actualGivenName = credentialSubjectName.find(
      (part) => part.type === "GivenName"
    )?.value;
    const actualFamilyName = credentialSubjectName.find(
      (part) => part.type === "FamilyName"
    )?.value;

    return { actualGivenName, actualFamilyName };
  }

  /**
   * Extracts evidence data from the VC
   * @param {Object} parsedJson - The parsed VC JSON
   * @returns {Object} The evidence object
   */
  extractEvidence(parsedJson) {
    const evidence = parsedJson?.vc?.evidence?.[0];
    if (!evidence) {
      throw new Error(
        "Could not find vc.evidence[0] in the JSON response. Check JSON structure."
      );
    }
    return evidence;
  }

  /**
   * Validates name fields against expected values
   * @param {string} actualGivenName - Actual given name from VC
   * @param {string} actualFamilyName - Actual family name from VC
   * @param {string} expectedGivenName - Expected given name
   * @param {string} expectedFamilyName - Expected family name
   */
  validateNames(
    actualGivenName,
    actualFamilyName,
    expectedGivenName,
    expectedFamilyName
  ) {
    expect(
      actualGivenName,
      `GivenName mismatch. Expected "${expectedGivenName}", but found "${actualGivenName}"`
    ).toEqual(expectedGivenName);
    expect(
      actualFamilyName,
      `FamilyName mismatch. Expected "${expectedFamilyName}", but found "${actualFamilyName}"`
    ).toEqual(expectedFamilyName);
  }

  /**
   * Validates a numeric score field against expected value
   * @param {number} actualScore - Actual score from VC
   * @param {number|string} expectedScore - Expected score
   * @param {string} fieldName - Field name for error messages
   * @param {Object} evidence - Evidence object for error context
   */
  validateScore(actualScore, expectedScore, fieldName, evidence) {
    const isMasked = (v) => !v || String(v).toUpperCase() === "MASKED";

    if (isMasked(expectedScore)) {
      if (actualScore === undefined || actualScore === null) {
        throw new Error(
          `${fieldName} is missing from the VC payload while examples expect it to be present (MASKED). JSON keys: ` +
            JSON.stringify(Object.keys(evidence || {}))
        );
      }
      expect(String(actualScore)).toMatch(/^\d+$/, "score should be numeric");
    } else {
      expect(
        actualScore,
        `${fieldName} mismatch. Expected "${expectedScore}", but found "${actualScore}"`
      ).toEqual(Number(expectedScore));
    }
  }

  /**
   * Validates CI field against expected value
   * @param {string|string[]} actualCi - Actual CI from VC
   * @param {string|string[]} expectedCi - Expected CI value(s)
   */
  validateCi(actualCi, expectedCi) {
    const isMasked = (v) => !v || String(v).toUpperCase() === "MASKED";

    if (isMasked(expectedCi)) {
      expect(actualCi).toBeDefined();
    } else if (expectedCi === "") {
      expect(actualCi).toEqual([]);
    } else if (Array.isArray(actualCi)) {
      if (typeof expectedCi === "string") {
        expect(actualCi).toContain(expectedCi);
      } else if (Array.isArray(expectedCi)) {
        expectedCi.forEach((val) => expect(actualCi).toContain(val));
      }
    } else if (typeof actualCi === "string") {
      expect(actualCi).toEqual(expectedCi);
    } else {
      throw new Error(
        `Unexpected type for 'ci' in JSON. Expected string or array, but found ${typeof actualCi} (${JSON.stringify(actualCi)}).`
      );
    }
  }

  /**
   * Validates specific fields within the JSON response (VC) from Passport CRI using Playwright expect assertions.
   * @param {string} expectedGivenName - The expected GivenName
   * @param {string} expectedFamilyName - The expected FamilyName
   * @param {number|string} expectedStrengthScore - The expected strengthScore
   * @param {number|string} expectedValidityScore - The expected validityScore
   * @param {string|string[]} expectedCi - The expected 'ci' value(s)
   */
  async validateJsonResponseFromPassportCri(
    expectedGivenName,
    expectedFamilyName,
    expectedStrengthScore,
    expectedValidityScore,
    expectedCi
  ) {
    const parsedJson = await this.readVcPayload();

    const { actualGivenName, actualFamilyName } =
      this.extractNameParts(parsedJson);

    const evidence = this.extractEvidence(parsedJson);
    const actualCi = evidence.ci;

    this.validateNames(
      actualGivenName,
      actualFamilyName,
      expectedGivenName,
      expectedFamilyName
    );
    this.validateScore(
      evidence.strengthScore,
      expectedStrengthScore,
      "strengthScore",
      evidence
    );
    this.validateScore(
      evidence.validityScore,
      expectedValidityScore,
      "validityScore",
      evidence
    );
    this.validateCi(actualCi, expectedCi);
  }
};
