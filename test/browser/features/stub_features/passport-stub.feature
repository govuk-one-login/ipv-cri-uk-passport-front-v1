@stub-test
Feature: Passport CRI - IPV Core Stub - Happy Path Tests

    Background:
        Given I navigate to the IPV Core Stub
        And I click the Passport CRI for the testEnvironment

    @stub-test
    Scenario Outline: Passport CRI - IPV Core Stub - Happy Path - Run Passport Journey by userId <expectedGivenName> <expectedFamilyName>
        Given I search for user number <userId> in the ThirdParty table
        Then User is navigated to the Passport <page> Page
        Then User enter data as a <passportSubject>
        Then User clicks the passport continue button
        Then User is navigated to the Verifiable Credential Issuers Page
        Then The VC contains the expected response for <expectedGivenName> <expectedFamilyName> with <expectedStrengthScoreMasked> <expectedSValidityScoreMasked> and <expectedCiMasked>
        Examples:
            | userId | page    | passportSubject | expectedGivenName | expectedFamilyName | expectedStrengthScoreMasked | expectedSValidityScoreMasked | expectedCiMasked |
            | 197    | details | primaryPassport | KENNETH           | DECERQUEIRA        | MASKED                      | MASKED                       | MASKED           |
            | 5      | details | primaryPassport | KENNETH           | DECERQUEIRA        | MASKED                      | MASKED                       | MASKED           |

    @stub-test
    Scenario Outline: Passport CRI - IPV Core Stub - Happy Path - Run Passport Journey by user search <expectedGivenName> <expectedFamilyName>
        Given I search for user name <userName> in the ThirdParty table
        When User clicks the Go to Passport CRI button
        Then User is navigated to the Passport <page> Page
        Then User enter data as a <passportSubject>
        Then User clicks the passport continue button
        Then User is navigated to the Verifiable Credential Issuers Page
        Then The VC contains the expected response for <expectedGivenName> <expectedFamilyName> with <expectedStrengthScoreMasked> <expectedSValidityScoreMasked> and <expectedCiMasked>
        Examples:
            | userName            | page    | passportSubject | expectedGivenName | expectedFamilyName | expectedStrengthScoreMasked | expectedSValidityScoreMasked | expectedCiMasked |
            | KENNETH DECERQUEIRA | details | primaryPassport | KENNETH           | DECERQUEIRA        | MASKED                      | MASKED                       | MASKED           |
