@mock-api:passport-success
Feature: Passport CRI - Welsh Language Tests

  Background:
    Given Authenticatable Anita is using the system
    And they have provided their details
    And they have started the Passport journey
    And I add a cookie to change the language to Welsh
    And I should be on the Passport details entry page Rhowch eich manylion yn union fel maent yn ymddangos ar eich pasbort y DU – GOV.UK One Login

  @mock-api:passport-success-supportLinks @language-regression
  Scenario: Passport CRI - Check support links
    Given The Support link in the footer reads Cymorth (agor mewn tab newydd) and assert the url is correct and live
    When I view the beta banner
    Then the beta banner reads Mae hwn yn wasanaeth newydd – bydd eich adborth (agor mewn tab newydd) yn ein helpu i’w wella.
    And I assert the link in the banner is correct and live
    Then I delete the session cookie
    And User clicks on continue
    Then I see the heading Mae’n ddrwg gennym, mae problem
    And I see Contact the One Login team link reads Cysylltu â thîm GOV.UK One Login (agor mewn tab newydd)
    And I assert the link on the error page is correct and live
    Then I go to page not found
    And I assert the link on the page not found page is correct and live

  @mock-api:passport-success-supportLinks
  Scenario: Passport CRI - Beta Banner Accept Analysis
    When they view the Beta banner with the Welsh text as Mae hwn yn wasanaeth newydd – bydd eich adborth (agor mewn tab newydd) yn ein helpu i’w wella.
    Then I select Accept analytics cookies button and see the text Rydych wedi derbyn cwcis ychwanegol. Gallwch newid eich gosodiadau cwcis unrhyw bryd.
    Then I select the accepted link change your cookie settings and assert I have been redirected correctly

  @mock-api:passport-success-supportLinks
  Scenario: Passport CRI - Beta Banner Reject Analysis
    When they view the Beta banner with the Welsh text as Mae hwn yn wasanaeth newydd – bydd eich adborth (agor mewn tab newydd) yn ein helpu i’w wella.
    Then I select Reject analytics cookies button and see the text Rydych wedi gwrthod cwcis ychwanegol. Gallwch newid eich gosodiadau cwcis unrhyw bryd.
    Then I select the rejected link change your cookie settings and assert I have been redirected correctly
    