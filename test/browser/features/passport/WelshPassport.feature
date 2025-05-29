@mock-api:passport-success
Feature: Passport CRI - Welsh Language Tests

  Background:
    Given Authenticatable Anita has started the Passport Journey
    And they have provided their details
    And I add a cookie to change the language to Welsh
    And I should be on the Passport details entry page Rhowch eich manylion yn union fel maent yn ymddangos ar eich pasbort y DU – GOV.UK One Login

 ########### Page Element Validations ##########
 
  @mock-api:passport-success-supportLinks @language-regression
  Scenario: Passport CRI - Check support links are correct and live
    Given The Support link in the footer reads Cymorth (agor mewn tab newydd)
    Then I assert the support link url in the footer is correct and live

  @mock-api:passport-success-betaBanner @language-regression
  Scenario: Passport CRI - Beta Banner
    Given they view the Beta banner with the Welsh text as Mae hwn yn wasanaeth newydd – bydd eich adborth (agor mewn tab newydd) yn ein helpu i’w wella.
    And I assert the link in the banner is correct and live

  @mock-api:passport-success-errorPage @language-regression
  Scenario: Passport CRI - Check error page following cookie deletion
    Given I delete the session cookie
    And User clicks on continue
    Then I see the heading Mae’n ddrwg gennym, mae problem
    And I see Contact the One Login team link reads Cysylltu â thîm GOV.UK One Login (agor mewn tab newydd)
    And I assert the link on the error page is correct and live

  @mock-api:passport-success-cookieBannerAccept @language-regression
  Scenario: Passport CRI - Cookies Accept Analysis
    Given I select Accept analytics cookies button and see the text Rydych wedi derbyn cwcis ychwanegol. Gallwch newid eich gosodiadau cwcis unrhyw bryd.
    Then I select the accepted link change your cookie settings and assert I have been redirected correctly

  @mock-api:passport-success-cookieBannerReject @language-regression
  Scenario: Passport CRI - Cookies Reject Analysis
    Given I select Reject analytics cookies button and see the text Rydych wedi gwrthod cwcis ychwanegol. Gallwch newid eich gosodiadau cwcis unrhyw bryd.
    Then I select the rejected link change your cookie settings and assert I have been redirected correctly

  ########### Field Validations ##########

  @mock-api:passport-success @Language-regression
  Scenario: Passport CRI - Name fields and hints
    When I can see the lastName as Cyfenw
    And I can see the firstName as Enw cyntaf
    And I can see the middleName as Enwau canol
    And I can see the middleName hint text Gadewch hyn yn wag os nad oes gennych unrhyw enwau canol

  @mock-api:passport-success @Language-regression
  Scenario: Passport CRI - DoB Fields
    When I can see the DoB fields titled Dyddiad geni
    When I can see example as Er enghraifft, 5 9 1973
    Then I can see date as Diwrnod
    And I can see month as Mis
    And I can see year as Blwyddyn

  @mock-api:passport-success @Language-regression
  Scenario Outline: Passport CRI - Passport Date of birth in the future error validation
    And User enters passport data as a <PassportSubject>
    And User re-enters day of birth as <InvalidDayOfBirth>
    And User re-enters month of birth as <InvalidMonthOfBirth>
    And User re-enters year of birth as <InvalidYearOfBirth>
    When User clicks on continue
    Then I see the date of birth error summary as Rhaid i’ch dyddiad geni fod yn y gorffennol
    And I see the date of birth error in the field as Rhaid i’ch dyddiad geni fod yn y gorffennol
    Examples:
      | PassportSubject             | InvalidDayOfBirth | InvalidMonthOfBirth | InvalidYearOfBirth |
      | PassportSubjectHappyKenneth | 10                | 10                  | 2042               |

  @mock-api:passport-success @Language-regression
  Scenario Outline: Passport CRI - Passport - No Date in the Date of birth field error validation
    And User enters passport data as a <PassportSubject>
    And User re-enters day of birth as <InvalidDayOfBirth>
    And User re-enters month of birth as <InvalidMonthOfBirth>
    And User re-enters year of birth as <InvalidYearOfBirth>
    When User clicks on continue
    Then I see the date of birth error summary as Rhowch eich dyddiad geni fel mae’n ymddangos ar eich pasbort
    And I see the date of birth error in the field as Rhowch eich dyddiad geni fel mae’n ymddangos ar eich pasbort
    Examples:
      | PassportSubject             | InvalidDayOfBirth | InvalidMonthOfBirth | InvalidYearOfBirth |
      | PassportSubjectHappyKenneth |                   |                     |                    |

  @mock-api:passport-success @Language-regression
  Scenario Outline: Passport CRI - Passport Valid to date with special characters error validation
    And User enters passport data as a <PassportSubject>
    And User re-enters expiry day as <InvalidExpiryDay>
    And User re-enters expiry month as <InvalidExpiryMonth>
    And User re-enters expiry year as <InvalidExpiryYear>
    When User clicks on continue
    Then I see expiry date error summary as Rhowch y dyddiad dod i ben fel mae’n ymddangos ar eich pasbort
    And I see invalid expiry date in the field as Rhowch y dyddiad dod i ben fel mae’n ymddangos ar eich pasbort
    Examples:
      | PassportSubject             | InvalidExpiryDay | InvalidExpiryMonth | InvalidExpiryYear |
      | PassportSubjectHappyKenneth | 4£               | 5!                 | 29 1@             |

 @mock-api:passport-success @Language-regression
  Scenario Outline: Passport CRI - Passport Valid to date in the past error validation
    And User enters passport data as a <PassportSubject>
    And User re-enters expiry day as <InvalidExpiryDay>
    And User re-enters expiry month as <InvalidExpiryMonth>
    And User re-enters expiry year as <InvalidExpiryYear>
    When User clicks on continue
    Then I see expiry date error summary as Mae’n rhaid i’ch pasbort fod heb wedi dod i ben dros 18 mis yn ôl
    And I see invalid expiry date in the field as Mae’n rhaid i’ch pasbort fod heb wedi dod i ben dros 18 mis yn ôl
    Examples:
      | PassportSubject             | InvalidExpiryDay | InvalidExpiryMonth | InvalidExpiryYear |
      | PassportSubjectHappyKenneth | 10               | 01                 | 2010              |

  @mock-api:passport-success @Language-regression
  Scenario Outline: Passport CRI - Passport - No date in the Valid to date field error validation
    And User enters passport data as a <PassportSubject>
    And User re-enters expiry day as <InvalidExpiryDay>
    And User re-enters expiry month as <InvalidExpiryMonth>
    And User re-enters expiry year as <InvalidExpiryYear>
    When User clicks on continue
    Then I see expiry date error summary as Rhowch y dyddiad dod i ben fel mae’n ymddangos ar eich pasbort
    And I see invalid expiry date in the field as Rhowch y dyddiad dod i ben fel mae’n ymddangos ar eich pasbort
    Examples:
      | PassportSubject             | InvalidExpiryDay | InvalidExpiryMonth | InvalidExpiryYear |
      | PassportSubjectHappyKenneth |                  |                    |                   |
      
  @mock-api:passport-success @Language-regression
  Scenario Outline: Passport CRI - Passport number with special characters and spaces error validation
    And User enters passport data as a <PassportSubject>
    Then User re-enters passportNumber as <InvalidPassportNumber>
    When User clicks on continue
    Then I see the Passport number error summary as Ni ddylai rhif eich pasbort gynnwys llythrennau na symbolau
    And I can see the Passport number error in the field as Ni ddylai rhif eich pasbort gynnwys llythrennau na symbolau
    Examples:
      | PassportSubject             | InvalidPassportNumber |
      | PassportSubjectHappyKenneth | 555667^&*             |

  @mock-api:passport-success @Language-regression
  Scenario: Passport CRI - Passport Number Text
    When I can see the passport number field titled Rhif pasbort
    And I see the passport number sentence Dyma’r rhif 9 digid yng nghornel dde uchaf y dudalen llun yn eich pasbort

  @mock-api:passport-success @Language-regression
  Scenario Outline: Passport CRI - Passport number less than 8 characters error validation
    And User enters passport data as a <PassportSubject>
    Then User re-enters passportNumber as <InvalidPassportNumber>
    When User clicks on continue
    Then I see the Passport number error summary as Dylai rhif eich pasbort fod yn 9 digid o hyd
    And I can see the Passport number error in the field as Dylai rhif eich pasbort fod yn 9 digid o hyd
    Examples:
      | PassportSubject             | InvalidPassportNumber |
      | PassportSubjectHappyKenneth | 5566778               |
