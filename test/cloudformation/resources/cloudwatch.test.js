const { expect } = require("chai");
const {
  getResourcesByType,
  validateResourceProperty,
  validateInRawYaml,
  loadTemplate
} = require("../helpers/helpers");
const { VALID_COMPARISON_OPERATORS } = require("../helpers/constants");

describe("@QualityGateStackTest", () => {
  describe("CloudWatch and Logs Resources", () => {
    describe("AWS::CloudWatch::Alarm", () => {
      it("should have AlarmName in Properties", () => {
        validateResourceProperty(
          "AWS::CloudWatch::Alarm",
          "AlarmName",
          (val) => !!val,
          "missing AlarmName in Properties"
        );
      });

      it("should have valid ComparisonOperator", () => {
        validateResourceProperty(
          "AWS::CloudWatch::Alarm",
          "ComparisonOperator",
          (val) => VALID_COMPARISON_OPERATORS.includes(val),
          `ComparisonOperator must be one of: ${VALID_COMPARISON_OPERATORS.join(", ")}`
        );
      });

      // To be discused with the team - how do we want canary roll backs to trigger (slack etc)
      it("should have ActionsEnabled set to true", () => {
        const alarms = getResourcesByType("AWS::CloudWatch::Alarm");
        const failures = [];

        alarms.forEach(([resourceName, resource]) => {
          if (
            !resource.Condition ||
            resource.Condition !== "UseCanaryDeployment"
          ) {
            const resourceMatch = new RegExp(`^  ${resourceName}:`, "m");
            const { templateContent } = loadTemplate();
            const resourceIndex = templateContent.search(resourceMatch);

            if (resourceIndex !== -1) {
              const afterResource = templateContent.substring(resourceIndex);
              const nextResourceMatch = afterResource
                .substring(1)
                .search(/^ {2}\w+:/m);
              const resourceSection =
                nextResourceMatch === -1
                  ? afterResource
                  : afterResource.substring(0, nextResourceMatch + 1);

              if (!/ActionsEnabled:\s*true/.test(resourceSection)) {
                failures.push(`${resourceName} missing ActionsEnabled: true`);
              }
            }
          }
        });

        if (failures.length > 0) {
          expect.fail(
            `Found ${failures.length} CloudWatch Alarm(s) without ActionsEnabled: true:\n${failures.join("\n")}`
          );
        }
      });

      it("should have MetricName or Metrics in Properties", () => {
        const alarms = getResourcesByType("AWS::CloudWatch::Alarm");
        const failures = [];

        alarms.forEach(([resourceName, resource]) => {
          const hasMetricName = !!resource.Properties.MetricName;
          const hasMetrics = !!resource.Properties.Metrics;
          if (!(hasMetricName || hasMetrics)) {
            failures.push(
              `${resourceName} missing both MetricName and Metrics in Properties`
            );
          }
        });

        if (failures.length > 0) {
          expect.fail(
            `Found ${failures.length} CloudWatch Alarm(s) without MetricName or Metrics:\n${failures.join("\n")}`
          );
        }
      });
    });

    describe("AWS::Logs::MetricFilter", () => {
      it("should have LogGroupName in Properties", () => {
        validateResourceProperty(
          "AWS::Logs::MetricFilter",
          "LogGroupName",
          (val) => !!val,
          "missing LogGroupName in Properties"
        );
      });

      it("should have FilterPattern in Properties", () => {
        validateResourceProperty(
          "AWS::Logs::MetricFilter",
          "FilterPattern",
          (val) => !!val,
          "missing FilterPattern in Properties"
        );
      });

      it("should have MetricTransformations array in Properties", () => {
        validateResourceProperty(
          "AWS::Logs::MetricFilter",
          "MetricTransformations",
          (val) => !!val,
          "missing MetricTransformations in Properties"
        );
      });

      it("should have MetricName in each MetricTransformation", () => {
        validateInRawYaml(
          "AWS::Logs::MetricFilter",
          /MetricName:/,
          "missing MetricName in MetricTransformations"
        );
      });

      it("should have MetricNamespace in each MetricTransformation", () => {
        validateInRawYaml(
          "AWS::Logs::MetricFilter",
          /MetricNamespace:/,
          "missing MetricNamespace in MetricTransformations"
        );
      });
    });

    describe("AWS::Logs::LogGroup", () => {
      it("should have LogGroupName in Properties", () => {
        validateResourceProperty(
          "AWS::Logs::LogGroup",
          "LogGroupName",
          (val) => !!val,
          "missing LogGroupName in Properties"
        );
      });
    });

    describe("AWS::Logs::SubscriptionFilter", () => {
      it("should have required properties", () => {
        validateResourceProperty(
          "AWS::Logs::SubscriptionFilter",
          "LogGroupName",
          (val) => !!val,
          "missing LogGroupName in Properties"
        );
      });

      it("should have FilterPattern in Properties", () => {
        validateResourceProperty(
          "AWS::Logs::SubscriptionFilter",
          "FilterPattern",
          (val) => val !== undefined,
          "missing FilterPattern in Properties"
        );
      });
    });
  });
});
