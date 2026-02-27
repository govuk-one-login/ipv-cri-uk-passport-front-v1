const { expect } = require("chai");
const { loadTemplate } = require("./helpers/helpers");
const {
  SENSITIVE_RESOURCE_TYPES,
  TAGGABLE_RESOURCE_TYPES,
  ALLOWED_ACCOUNT_IDS
} = require("./helpers/constants");

describe("@QualityGateStackTest", () => {
  describe("General Resource Validation", () => {
    let template, templateLines, templateContent;

    before(() => {
      ({ template, templateLines, templateContent } = loadTemplate());
    });

    it("should have Type configured for all resources", () => {
      const resources = Object.entries(template.Resources || {});

      expect(resources).to.have.length.greaterThan(
        0,
        "No resources found in template"
      );

      resources.forEach(([resourceName, resource]) => {
        expect(resource.Type, `${resourceName} missing Type`).to.exist;
        expect(
          resource.Type,
          `${resourceName} Type must start with AWS::`
        ).to.match(/^AWS::/);
      });
    });

    it("should not use hardcoded account IDs", () => {
      const accountIdPattern = /\b\d{12}\b/;

      templateLines.forEach((line, index) => {
        const match = accountIdPattern.exec(line);
        if (match && !ALLOWED_ACCOUNT_IDS.has(match[0])) {
          expect.fail(
            `Line ${index + 1}: Found hardcoded account ID ${match[0]}. Use !Ref AWS::AccountId instead`
          );
        }
      });
    });

    it("should have DeletionPolicy set for sensitive resources", () => {
      const sensitiveResources = Object.entries(template.Resources).filter(
        ([, resource]) => SENSITIVE_RESOURCE_TYPES.has(resource.Type)
      );

      const failures = [];
      sensitiveResources.forEach(([resourceName, resource]) => {
        const resourceMatch = new RegExp(`^  ${resourceName}:`, "m");
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

          if (!/^ {4}DeletionPolicy:/m.test(resourceSection)) {
            failures.push(
              `${resourceName} (${resource.Type}) missing DeletionPolicy`
            );
          }
        }
      });

      if (failures.length > 0) {
        expect.fail(
          `Found ${failures.length} sensitive resource(s) without DeletionPolicy:\n${failures.join("\n")}`
        );
      }
    });

    it("should have tags for taggable resources", () => {
      const taggableResources = Object.entries(template.Resources).filter(
        ([, resource]) => TAGGABLE_RESOURCE_TYPES.has(resource.Type)
      );

      const failures = [];
      taggableResources.forEach(([resourceName, resource]) => {
        if (
          !resource.Properties?.Tags ||
          resource.Properties.Tags.length === 0
        ) {
          failures.push(`${resourceName} (${resource.Type}) missing Tags`);
        }
      });

      if (failures.length > 0) {
        expect.fail(
          `Found ${failures.length} taggable resource(s) without Tags:\n${failures.join("\n")}`
        );
      }
    });

    it("should have valid CloudFormation intrinsic functions", () => {
      const invalidFunctions = [];
      const validFunctions = new Set([
        "Ref",
        "GetAtt",
        "Sub",
        "Join",
        "If",
        "Equals",
        "Not",
        "Or",
        "And",
        "FindInMap",
        "Select",
        "Split",
        "ImportValue",
        "Base64",
        "Cidr",
        "GetAZs"
      ]);

      templateLines.forEach((line, index) => {
        const fnMatch = line.match(/!(\w+)/g);
        if (fnMatch) {
          fnMatch.forEach((fn) => {
            const funcName = fn.substring(1);
            if (!validFunctions.has(funcName)) {
              invalidFunctions.push(
                `Line ${index + 1}: Invalid function '${fn}'`
              );
            }
          });
        }
      });

      if (invalidFunctions.length > 0) {
        expect.fail(
          `Found invalid CloudFormation functions:\n${invalidFunctions.join("\n")}`
        );
      }
    });

    it("should have consistent resource naming convention", () => {
      const resources = Object.keys(template.Resources || {});
      const failures = [];

      resources.forEach((resourceName) => {
        // Check PascalCase naming
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(resourceName)) {
          failures.push(
            `Resource '${resourceName}' does not follow PascalCase naming convention`
          );
        }
      });

      if (failures.length > 0) {
        expect.fail(
          `Found ${failures.length} resource(s) with invalid naming:\n${failures.join("\n")}`
        );
      }
    });
  });
});
