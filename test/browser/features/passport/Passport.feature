@mock-api:passport-success
Feature: Passport CRI - Happy Path and Field Valisation Tests

  Background:
    Given Authenticatable Anita has started the Passport Journey
    And they have provided their details

  @mock-api:passport-success @passport-happy-path
  Scenario Outline: Passport CRI - Happy Path Test
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    When User clicks on continue
    Examples:
      | PassportSubject             |
      | PassportSubjectHappyKenneth |

  @mock-api:passport-success @passport-support-link-validation
  Scenario: Passport CRI - Check support links are correct and live
    Given The Support link in the footer reads Support (opens in new tab)
    And I assert the support link url in the footer is correct and live

  @mock-api:passport-success @passport-happy-path
  Scenario: Passport CRI - Skip to Main Content
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    Then I see the Skip to main content Link Text

  ########### Page UI Elements (Links) ##########

  @mock-api:passport-success @passport-page-element-validation
  Scenario Outline: Passport CRI - Footer Links
    Given they click Footer <link> and assert I have been redirected correctly
    Examples:
      | link           |
      | Accessibility  |
      | Cookies        |
      | TsAndCs        |
      | Privacy        |
      | Support        |
      | OGL            |
      | CrownCopyright |

  @mock-api:passport-success @passport-page-element-validation
  Scenario Outline: Passport CRI - Beta Banner
    Given The beta banner is displayed
    And The beta banner reads This is a new service. Help us improve it and give your feedback (opens in a new tab).
    Then I assert the feedback URL <expectedPageUrl> is correct and live
    Examples:
      | expectedPageUrl                          |
      | https://signin.account.gov.uk/contact-us |

  @mock-api:passport-success @passport-page-element-validation
  Scenario: Passport CRI - Cookies Accept Analysis
    Given I select Accept analytics cookies button and see the text You've accepted additional cookies. You can change your cookie settings at any time.
    Then I select the accepted link change your cookie settings and assert I have been redirected correctly

  @mock-api:passport-success @passport-page-element-validation
  Scenario: Passport CRI - Cookies Reject Analysis
    Given I select Reject analytics cookies button and see the text You've rejected additional cookies. You can change your cookie settings at any time.
    Then I select the rejected link change your cookie settings and assert I have been redirected correctly

  ########### Field Validations ##########

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Details Validation - Last Name - Invalid Numbers/Chars/Missing Values
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    And User re-enters last name as <InvalidLastName>
    When User clicks on continue
    Then I see the Lastname error in the error summary as Enter your surname as it appears on your passport
    Then I see the Lastname error in the error field as Enter your surname as it appears on your passport
    Examples:
      | PassportSubject             | InvalidLastName |
      | PassportSubjectHappyKenneth | KYLE123         |
      | PassportSubjectHappyKenneth | KYLE^&(         |
      | PassportSubjectHappyKenneth |                 |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Details Validation - First Name - Invalid Numbers/Chars/Missing Values
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    And User re-enters first name as <InvalidFirstName>
    When User clicks on continue
    Then I see the Firstname error summary as Enter your first name as it appears on your passport
    Then I see the Firstname error in the error field as Enter your first name as it appears on your passport
    Examples:
      | PassportSubject             | InvalidFirstName |
      | PassportSubjectHappyKenneth | SELINA987        |
      | PassportSubjectHappyKenneth | SELINA^&(        |
      | PassportSubjectHappyKenneth |                  |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Details Validation - DOB - Invalid/Missing Values
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    And User re-enters day of birth as <InvalidDayOfBirth>
    And User re-enters month of birth as <InvalidMonthOfBirth>
    And User re-enters year of birth as <InvalidYearOfBirth>
    When User clicks on continue
    Then I see the date of birth error summary as Enter your date of birth as it appears on your passport
    Then I see the date of birth error in the field as Enter your date of birth as it appears on your passport
    Examples:
      | PassportSubject             | InvalidDayOfBirth | InvalidMonthOfBirth | InvalidYearOfBirth |
      | PassportSubjectHappyKenneth | 51                | 71                  | 198                |
      | PassportSubjectHappyKenneth | 8                 | 7                   | 65                 |
      | PassportSubjectHappyKenneth | @                 | *&                  | 19 7%              |
      | PassportSubjectHappyKenneth |                   |                     |                    |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Details Validation - DOB - DOB in future error validation
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    And User re-enters day of birth as <InvalidDayOfBirth>
    And User re-enters month of birth as <InvalidMonthOfBirth>
    And User re-enters year of birth as <InvalidYearOfBirth>
    When User clicks on continue
    Then I see the date of birth error summary as Your date of birth must be in the past
    And I see the date of birth error in the field as Your date of birth must be in the past
    Examples:
      | PassportSubject             | InvalidDayOfBirth | InvalidMonthOfBirth | InvalidYearOfBirth |
      | PassportSubjectHappyKenneth | 10                | 10                  | 2042               |


  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Details Validation - Expiry Date - Invalid Numbers/Chars/Missing Values
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    And User re-enters expiry day as <validDayOfExpiry>
    And User re-enters expiry month as <validMonthOfExpiry>
    And User re-enters expiry year as <InvalidYearOfExpiry>
    When User clicks on continue
    Then I see expiry date error summary as Enter the expiry date as it appears on your passport
    And I see invalid expiry date in the field as Enter the expiry date as it appears on your passport
    Examples:
      | PassportSubject             | validDayOfExpiry | validMonthOfExpiry | InvalidYearOfExpiry |
      | PassportSubjectHappyKenneth | 5                | 5                  | 25                  |
      | PassportSubjectHappyKenneth | !@               | £$                 | %^ *                |
      | PassportSubjectHappyKenneth | 4£               | 5!                 | 29 1@               |
      | PassportSubjectHappyKenneth |                  |                    |                     |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Details Validation - Expiry Date - Date in the past
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    And User re-enters expiry day as <InvalidExpiryDay>
    And User re-enters expiry month as <InvalidExpiryMonth>
    And User re-enters expiry year as <InvalidExpiryYear>
    When User clicks on continue
    Then I see expiry date error summary as Your passport must not have expired more than 18 months ago
    And I see invalid expiry date in the field as Your passport must not have expired more than 18 months ago
    Examples:
      | PassportSubject             | InvalidExpiryDay | InvalidExpiryMonth | InvalidExpiryYear |
      | PassportSubjectHappyKenneth | 10               | 01                 | 2010              |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Details Validation - Passport Number - Number too Short
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    Then User re-enters passportNumber as <InvalidPassportNumber>
    When User clicks on continue
    Then I see the Passport number error summary as Your passport number should be 9 digits long
    And I can see the Passport number error in the field as Your passport number should be 9 digits long
    Examples:
      | PassportSubject             | InvalidPassportNumber |
      | PassportSubjectHappyKenneth | 5566778               |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Details Validation - Passport Number - Invalid Numbers/Chars
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    Then User re-enters passportNumber as <InvalidPassportNumber>
    When User clicks on continue
    Then I see the Passport number error summary as Your passport number should not include letters or symbols
    And I can see the Passport number error in the field as Your passport number should not include letters or symbols
    Examples:
      | PassportSubject             | InvalidPassportNumber |
      | PassportSubjectHappyKenneth | 555667^&*             |
      | PassportSubjectHappyKenneth | 555667ABC             |
      | PassportSubjectHappyKenneth | XYZabdABC             |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Details Validation - Passport Number - Missing Value
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    Then User re-enters passportNumber as <InvalidPassportNumber>
    When User clicks on continue
    Then I see the Passport number error summary as Enter the number as it appears on your passport
    And I can see the Passport number error in the field as Enter the number as it appears on your passport
    Examples:
      | PassportSubject             | InvalidPassportNumber |
      | PassportSubjectHappyKenneth |                       |

  ########### Page Element Validations ##########

  @mock-api:passport-success @passport-error-page-validation
  Scenario: Passport CRI - Check error page following cookie deletion
    Then I delete the session cookie
    And User clicks on continue
    Then they should see an error page
    And I see Contact the One Login team link reads Contact the GOV.UK One Login team (opens in a new tab)
    And I assert the link on the error page is correct and live

  @mock-api:passport-success @passport-cookies-device-intelligence
  Scenario Outline: Passport CRI - Cookies - Device Intelligence
    Given I see the Device Intelligence Cookie <DeviceIntelligenceCookieName>
    Examples:
      | DeviceIntelligenceCookieName |
      | di-device-intelligence       |

  @mock-api:passport-success @passport-page-not-found-validation
  Scenario: Passport CRI - Page Not Found - Check Links
    Given I go to page not found
    Then I assert the link on the page not found page is correct and live

  ########### Axe Accessibility ##########

  @mock-api:passport-success @passport-accessibility
  Scenario Outline: Passport CRI - Axe Accessibility Scan - Passport Details Page
    Given I run the Axe Accessibility check against the Passport details entry page
    Then User enters passport data as a <PassportSubject>
    When User clicks on continue
    Examples:
      | PassportSubject             |
      | PassportSubjectHappyKenneth |

  @mock-api:passport-success @passport-accessibility
  Scenario: Passport CRI - Passport Error Page
    Given I delete the session cookie
    And User clicks on continue
    Then they should see an error page
    Then I run the Axe Accessibility check against the Error entry page
