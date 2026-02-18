const {
  validateInRawYaml,
  getResourcesByType,
  findInRawYaml
} = require("../helpers/helpers");
const { expect } = require("chai");

describe("@QualityGateStackTest", () => {
  describe("AWS::KMS::Key Resources", () => {
    it("should have EnableKeyRotation set to true", () => {
      validateInRawYaml(
        "AWS::KMS::Key",
        /EnableKeyRotation:\s*true/,
        "missing EnableKeyRotation: true"
      );
    });

    it("should have KeyPolicy with proper IAM permissions", () => {
      validateInRawYaml("AWS::KMS::Key", /KeyPolicy:/, "missing KeyPolicy");
    });

    it("should have account root access for key management", () => {
      validateInRawYaml(
        "AWS::KMS::Key",
        /arn:aws:iam::(\d+|\$\{AWS::AccountId\}):root/,
        "missing account root access in KeyPolicy"
      );
    });

    it("should have service-specific permissions for intended services", () => {
      validateInRawYaml(
        "AWS::KMS::Key",
        /Service:/,
        "missing Service principal in KeyPolicy"
      );
    });

    it("should have DeletionPolicy for production keys", () => {
      const kmsKeys = getResourcesByType("AWS::KMS::Key");
      const excludedKeys = new Set(["LoggingKmsKey", "AlarmSNSTopicKey"]);
      const failures = [];

      kmsKeys.forEach(([resourceName]) => {
        if (!excludedKeys.has(resourceName)) {
          if (!findInRawYaml(resourceName, /DeletionPolicy:/)) {
            failures.push(
              `${resourceName} missing DeletionPolicy for key protection`
            );
          }
        }
      });

      if (failures.length > 0) {
        expect.fail(
          `Found ${failures.length} KMS Key(s) without DeletionPolicy:\n${failures.join("\n")}`
        );
      }
    });
  });
});
