@mock-api:passport-success
Feature: Passport CRI - Happy Path and Field Valisation Tests

  Background:
    Given Authenticatable Anita has started the Passport Journey
    And they have provided their details

  @mock-api:passport-success
  Scenario Outline: Passport CRI - Happy Path Test
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    When User clicks on continue
    Examples:
      | PassportSubject             |
      | PassportSubjectHappyKenneth |

  @mock-api:passport-success
  Scenario: Passport CRI - Check support links are correct and live
    Given The Support link in the footer reads Support (opens in new tab)
    And I assert the support link url in the footer is correct and live
    Then I assert the beta banner reads This is a new service – your feedback (opens in new tab) will help us to improve it.
    And I assert the link in the banner is correct and live

  @mock-api:passport-success
  Scenario: Passport CRI - Error Page - Contact Link
    Then I delete the session cookie
    And User clicks on continue
    Then they should see an error page
    And I see Contact the One Login team link reads Contact the GOV.UK One Login team (opens in a new tab)
    And I assert the link on the error page is correct and live

  @mock-api:passport-success
  Scenario: Passport CRI - Page Not Found - Check Links
    Given I go to page not found
    Then I assert the link on the page not found page is correct and live

  @mock-api:passport-success
  Scenario: Driving Licence - Cookies - Device Intelligence
    Given I see the Device Intelligence Cookie <DeviceIntelligenceCookieName>
    Examples:
      | DeviceIntelligenceCookieName |
      | di-device-intelligence       |

  @mock-api:passport-success
  Scenario Outline: Passport CRI - Axe Accessibility Scan - Passport Details Page
    Given I run the Axe Accessibility check against the Passport details entry page
    Then User enters passport data as a <PassportSubject>
    When User clicks on continue
    Examples:
      | PassportSubject             |
      | PassportSubjectHappyKenneth |

  @mock-api:passport-success
  Scenario: Passport CRI - Axe Accessibility Scan - Passport Error Page
    Given I delete the session cookie
    And User clicks on continue
    Then they should see an error page
    Then I run the Axe Accessibility check against the Error entry page

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
  Scenario: Passport CRI - Beta Banner
    Given they view the Beta banner with the text as This is a new service – your feedback (opens in new tab) will help us to improve it.

  @mock-api:passport-success @passport-page-element-validation
  Scenario: Passport CRI - Cookies Accept Analysis
    Given I select Accept analytics cookies button and see the text You’ve accepted additional cookies. You can change your cookie settings at any time.
    Then I select the accepted link change your cookie settings and assert I have been redirected correctly

  @mock-api:passport-success @passport-page-element-validation
  Scenario: Passport CRI - Cookies Reject Analysis
    Given I select Reject analytics cookies button and see the text You’ve rejected additional cookies. You can change your cookie settings at any time.
    Then I select the rejected link change your cookie settings and assert I have been redirected correctly

  ########### Field Validations ##########
  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Last name with numbers or special characters error validation
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    And User re-enters last name as <InvalidLastName>
    When User clicks on continue
    Then I see the Lastname error in the error summary as Enter your surname as it appears on your passport
    Then I see the Lastname error in the error field as Enter your surname as it appears on your passport
    Examples:
      | PassportSubject             | InvalidLastName |
      | PassportSubjectHappyKenneth | KYLE123         |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Last name with numbers or special characters error validation
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    And User re-enters last name as <InvalidLastName>
    When User clicks on continue
    Then I see the Lastname error in the error summary as Enter your surname as it appears on your passport
    Then I see the Lastname error in the error field as Enter your surname as it appears on your passport
    Examples:
      | PassportSubject             | InvalidLastName |
      | PassportSubjectHappyKenneth | KYLE^&(         |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport No Last name in the Last name field error validation
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    And User re-enters last name as <InvalidLastName>
    When User clicks on continue
    Then I see the Lastname error in the error summary as Enter your surname as it appears on your passport
    Then I see the Lastname error in the error field as Enter your surname as it appears on your passport
    Examples:
      | PassportSubject             | InvalidLastName |
      | PassportSubjectHappyKenneth |                 |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport First name with numberserror validation
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    And User re-enters first name as <InvalidFirstName>
    When User clicks on continue
    Then I see the Firstname error summary as Enter your first name as it appears on your passport
    Then I see the Firstname error in the error field as Enter your first name as it appears on your passport
    Examples:
      | PassportSubject             | InvalidFirstName |
      | PassportSubjectHappyKenneth | SELINA987        |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport First name with special characters error validation
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    And User re-enters first name as <InvalidFirstName>
    When User clicks on continue
    Then I see the Firstname error summary as Enter your first name as it appears on your passport
    Then I see the Firstname error in the error field as Enter your first name as it appears on your passport
    Examples:
      | PassportSubject             | InvalidFirstName |
      | PassportSubjectHappyKenneth | SELINA^&(        |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport No First name in the First name field error validation
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    And User re-enters first name as <InvalidFirstName>
    When User clicks on continue
    Then I see the Firstname error summary as Enter your first name as it appears on your passport
    Then I see the Firstname error in the error field as Enter your first name as it appears on your passport
    Examples:
      | PassportSubject             | InvalidFirstName |
      | PassportSubjectHappyKenneth |                  |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Date of birth that are not real error validation
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

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Date of birth field failure as two digits provided
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    And User re-enters day of birth as <validDayOfBirth>
    And User re-enters month of birth as <validMonthOfBirth>
    And User re-enters year of birth as <InvalidYearOfBirth>
    When User clicks on continue
    Then I see the date of birth error summary as Enter your date of birth as it appears on your passport
    Then I see the date of birth error in the field as Enter your date of birth as it appears on your passport
    Examples:
      | PassportSubject             | validDayOfBirth | validMonthOfBirth | InvalidYearOfBirth |
      | PassportSubjectHappyKenneth | 8               | 7                 | 65                 |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Expiry Date field failure as two digits provided
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

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Date of birth with special characters error validation
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
      | PassportSubjectHappyKenneth | @                 | *&                  | 19 7%              |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Date of birth in the future error validation
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
  Scenario Outline: Passport CRI - Passport - No Date in the Date of birth field error validation
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    And User re-enters day of birth as <InvalidDayOfBirth>
    And User re-enters month of birth as <InvalidMonthOfBirth>
    And User re-enters year of birth as <InvalidYearOfBirth>
    When User clicks on continue
    Then I see the date of birth error summary as Enter your date of birth as it appears on your passport
    And I see the date of birth error in the field as Enter your date of birth as it appears on your passport
    Examples:
      | PassportSubject             | InvalidDayOfBirth | InvalidMonthOfBirth | InvalidYearOfBirth |
      | PassportSubjectHappyKenneth |                   |                     |                    |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Valid to date that are not real error validation
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    And User re-enters expiry day as <InvalidExpiryDay>
    And User re-enters expiry month as <InvalidExpiryMonth>
    And User re-enters expiry year as <InvalidExpiryYear>
    When User clicks on continue
    Then I see expiry date error summary as Enter the expiry date as it appears on your passport
    And I see invalid expiry date in the field as Enter the expiry date as it appears on your passport
    Examples:
      | PassportSubject             | InvalidExpiryDay | InvalidExpiryMonth | InvalidExpiryYear |
      | PassportSubjectHappyKenneth | !@               | £$                 | %^ *              |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Valid to date with special characters error validation
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    And User re-enters expiry day as <InvalidExpiryDay>
    And User re-enters expiry month as <InvalidExpiryMonth>
    And User re-enters expiry year as <InvalidExpiryYear>
    When User clicks on continue
    Then I see expiry date error summary as Enter the expiry date as it appears on your passport
    And I see invalid expiry date in the field as Enter the expiry date as it appears on your passport
    Examples:
      | PassportSubject             | InvalidExpiryDay | InvalidExpiryMonth | InvalidExpiryYear |
      | PassportSubjectHappyKenneth | 4£               | 5!                 | 29 1@             |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport Valid to date in the past error validation
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
  Scenario Outline: Passport CRI - Passport - No date in the Valid to date field error validation
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    And User re-enters expiry day as <InvalidExpiryDay>
    And User re-enters expiry month as <InvalidExpiryMonth>
    And User re-enters expiry year as <InvalidExpiryYear>
    When User clicks on continue
    Then I see expiry date error summary as Enter the expiry date as it appears on your passport
    And I see invalid expiry date in the field as Enter the expiry date as it appears on your passport
    Examples:
      | PassportSubject             | InvalidExpiryDay | InvalidExpiryMonth | InvalidExpiryYear |
      | PassportSubjectHappyKenneth |                  |                    |                   |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport number less than 8 characters error validation
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
  Scenario Outline: Passport CRI - Passport number with special characters and spaces error validation
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    Then User re-enters passportNumber as <InvalidPassportNumber>
    When User clicks on continue
    Then I see the Passport number error summary as Your passport number should not include letters or symbols
    And I can see the Passport number error in the field as Your passport number should not include letters or symbols
    Examples:
      | PassportSubject             | InvalidPassportNumber |
      | PassportSubjectHappyKenneth | 555667^&*             |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport number with alpha numeric characters error validation
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    Then User re-enters passportNumber as <InvalidPassportNumber>
    When User clicks on continue
    Then I see the Passport number error summary as Your passport number should not include letters or symbols
    And I can see the Passport number error in the field as Your passport number should not include letters or symbols
    Examples:
      | PassportSubject             | InvalidPassportNumber |
      | PassportSubjectHappyKenneth | 555667ABC             |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport number with alpha characters error validation
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    Then User re-enters passportNumber as <InvalidPassportNumber>
    When User clicks on continue
    Then I see the Passport number error summary as Your passport number should not include letters or symbols
    And I can see the Passport number error in the field as Your passport number should not include letters or symbols
    Examples:
      | PassportSubject             | InvalidPassportNumber |
      | PassportSubjectHappyKenneth | XYZabdABC             |

  @mock-api:passport-success @passport-field-validation
  Scenario Outline: Passport CRI - Passport - No passport number in the passport number field error validation
    Given I should be on the Passport details entry page Enter your details exactly as they appear on your UK passport – GOV.UK One Login
    And User enters passport data as a <PassportSubject>
    Then User re-enters passportNumber as <InvalidPassportNumber>
    When User clicks on continue
    Then I see the Passport number error summary as Enter the number as it appears on your passport
    And I can see the Passport number error in the field as Enter the number as it appears on your passport
    Examples:
      | PassportSubject             | InvalidPassportNumber |
      | PassportSubjectHappyKenneth |                       |
