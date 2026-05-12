# Digital Identity Passport Credential Issuer

This the front-end code for V1 of the UK Passport Credential Issuer(CRI) for the Identity Proofing and Verification (IPV) system within the GDS digital identity platform, GOV.UK Sign In.

Passport front V1 was created as part of all CRI's standardizing on using -

- [common-express](https://github.com/alphagov/di-ipv-cri-common-express) for common processing steps and error handling.
- [hmpo-form-wizard](https://github.com/HMPO/hmpo-form-wizard) for routes and field validation.

## Code Owners

This repo has a `CODEOWNERS` file in the root and is configured to require PRs to reviewed by Code Owners.

## Environment Variables

- `API_BASE_URL` - URL to the cri-passport-back api.
- `PORT` - Default port to run webserver on. (Default to `3000`)
- `SESSION_SECRET` - Secret used when configuring the HMPO session.
- `GOOGLE_ANALYTICS_4_GTM_CONTAINER_ID` - Container ID for GA4 tracking.
- `UNIVERSAL_ANALYTICS_GTM_CONTAINER_ID` - Container ID for UA tracking.
- `GA4_ENABLED` - Feature flag to enable GA4, defaulted to `"true"`
- `UA_ENABLED` - Feature flag to enable UA, defaulted to `"false"`
- `GA4_PAGE_VIEW_ENABLED`- Feature flag to enable GA4 page view tracking, defaulted to `"true"`
- `GA4_FORM_RESPONSE_ENABLED`- Feature flag to enable GA4 form response tracking, defaulted to `"true"`
- `GA4_FORM_ERROR_ENABLED`- Feature flag to enable GA4 form error tracking, defaulted to `"true"`
- `GA4_FORM_CHANGE_ENABLED`- Feature flag to enable GA4 form change tracking, defaulted to `"true"`
- `GA4_NAVIGATION_ENABLED`- Feature flag to enable GA4 navigation tracking, defaulted to `"true"`
- `GA4_SELECT_CONTENT_ENABLED`- Feature flag to enable GA4 select content tracking, defaulted to `"true"`
- `LANGUAGE_TOGGLE_DISABLED` - Feature flag to disable Language Toggle, defaulted to `true`
- `MAY_2025_REBRAND_ENABLED` - Feature flag to enable the May 2025 GOV.UK branding change, defaults to `false`

## Local Testing

```bash
export API_BASE_URL=<URL> PORT=5050
yarn install && yarn build && yarn run dev
```

## Linting

Check with `yarn lint`

Apply with `yarn lint-apply`

## Unit Tests

Run with `yarn run test`

## Automation Tests

Run with `yarn run test:browser:ci`

## Core Stub Tests

There are E2E tests which run against the core stub, in the Dev, Build and Staging environments.

To execute these tests run:

`yarn run test:browser:stub:ci`

To build the Docker image run:

`docker build --tag passport-cri-test-image -f Dockerfile ..`

To build the Docker image on a Mac using Arm64 run:

`DOCKER_DEFAULT_PLATFORM=linux/amd64 docker build --tag passport-cri-test-image -f test/Dockerfile .`

To execute the tests in docker run:

`docker run -e STACK_NAME=local passport-cri-test-image` - add `-e ENVIRONMENT=dev` to run in Dev environment

## Pre-Commit Checking / Verification

Completely optional, there is a `.pre-commit-config.yaml` configuration setup in this repo, this uses [pre-commit](https://pre-commit.com/) to verify your commit before actually commiting, it runs the following checks:

- Check Json files for formatting issues
- Fixes end of file issues (it will auto correct if it spots an issue - you will need to run the git commit again after it has fixed the issue)
- It automatically removes trailing whitespaces (again will need to run commit again after it detects and fixes the issue)
- Detects aws credentials or private keys accidentally added to the repo
- runs cloud formation linter and detects issues
- runs checkov and checks for any issues.

### Dependency Installation

To use this locally you will first need to install the dependencies, this can be done in 2 ways:

#### Method 1 - Python pip

Run the following in a terminal:

```
sudo -H pip3 install checkov pre-commit cfn-lint
```

this should work across platforms

#### Method 2 - Brew

If you have brew installed please run the following:

```
brew install pre-commit ;\
brew install cfn-lint ;\
brew install checkov
```

### Post Installation Configuration

once installed run:

```
pre-commit install
```

To update the various versions of the pre-commit plugins, this can be done by running:

```
pre-commit autoupdate && pre-commit install
```

This will install / configure the pre-commit git hooks, if it detects an issue while committing it will produce an output like the following:

```
 git commit -a
check json...........................................(no files to check)Skipped
fix end of files.........................................................Passed
trim trailing whitespace.................................................Passed
detect aws credentials...................................................Passed
detect private key.......................................................Passed
AWS CloudFormation Linter................................................Failed
- hook id: cfn-lint
- exit code: 4
W3011 Both UpdateReplacePolicy and DeletionPolicy are needed to protect Resources/PublicHostedZone from deletion
core/deploy/dns-zones/template.yaml:20:3
Checkov..............................................(no files to check)Skipped
- hook id: checkov
```

To remove the pre-commit hooks should there be an issue

```
pre-commit uninstall
```
### Quality Gate Tags

All browser tests should be tagged with `@QualityGateIntegrationTest`. If a test runs in our pipelines (ie in Build), and tests live features, we should tag them with `@QualityGateRegressionTest`.
If the test is for an in-development feature, we should tag it with `@QualityGateNewFeatureTest`.
Infrastructure and stack validation tests should be tagged with `@QualityGateStackTest`.

Once a feature goes live, `@QualityGateNewFeatureTest` tags need to be updated to `@QualityGateRegressionTest`.
To facilitate this update, API tests for in-development work should be placed in their own feature files, if possible, so the tests can be tagged at the Feature level rather than the Scenario level.
Ideally, tests tagged with `@QualityGateNewFeatureTest` should be marked with a TODO and reference a post-go-live clean-up ticket so they can be easily identified and updated.
