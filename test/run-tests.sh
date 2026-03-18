#!/usr/bin/env bash

set -e

REPORT_DIR="${TEST_REPORT_DIR:=$PWD}"

export BROWSER="${BROWSER:-chrome-headless}"
export NO_CHROME_SANDBOX=true

# Added to accommodate ssm stack
if [[ -z "${CFN_StackName}" ]]; then
  if [[ -z "${SAM_STACK_NAME}" ]]; then
    export STACK_NAME="local"
  else
    export STACK_NAME="${SAM_STACK_NAME}"
  fi
else
  export STACK_NAME="${CFN_StackName}"
fi

# Added to accommodate ssm stack
if [[ -z "${ENVIRONMENT}" ]]; then
  if [[ -z "${TEST_ENVIRONMENT}" ]]; then
    export ENVIRONMENT="build"
  else
    export ENVIRONMENT="${TEST_ENVIRONMENT}"
  fi
else
  export ENVIRONMENT="${ENVIRONMENT}"
fi

echo "ENVIRONMENT: ${ENVIRONMENT}"
echo "STACK_NAME: ${STACK_NAME}"

if [ "${STACK_NAME}" != "local" ]; then
  echo "Fetching test configuration from AWS SSM Parameter Store..."

  export JOURNEY_TAG=$(aws ssm get-parameter --name "/tests/passport-cri-front/TestTag" --region eu-west-2 | jq -r ".Parameter.Value")

  PARAMETERS_NAMES=(coreStubPassword coreStubUrl coreStubUsername)
  tLen=${#PARAMETERS_NAMES[@]}
  for (( i=0; i<${tLen}; i++ ));
  do
    PARAMETER_NAME="/tests/${STACK_NAME}/${PARAMETERS_NAMES[$i]}"
    echo "Fetching ${PARAMETER_NAME}"
    PARAMETER=$(aws ssm get-parameter --name "${PARAMETER_NAME}" --region eu-west-2)
    VALUE=$(echo "$PARAMETER" | jq '.Parameter.Value')
    NAME=$(echo "$PARAMETER" | jq '.Parameter.Name' | cut -d "/" -f4 | sed 's/.$//')

    eval $(echo "export ${NAME}=${VALUE}")
  done
else
  export JOURNEY_TAG="${TEST_TAG:-@stub-test}"
  echo "Using local configuration"
fi

echo "TEST_TAG: ${JOURNEY_TAG}"

# Run tests
cd /home/node
echo "Running Cucumber tests with tag: ${JOURNEY_TAG}"
mkdir -p test/browser/reports
npx cucumber-js --config test/browser/cucumber.js --profile stub_tests --tags "${JOURNEY_TAG}"

# Copy test reports to output directory
if [ -d "test/browser/reports" ]; then
  mkdir -p "$REPORT_DIR/test-results"
  cp -r test/browser/reports/* "$REPORT_DIR/test-results/" || true
  echo "Test reports copied to $REPORT_DIR/test-results"
fi

echo "Tests completed successfully!"
