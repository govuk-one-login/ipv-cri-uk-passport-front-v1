const {
  validateResourceProperty,
  validateInRawYaml
} = require("../helpers/helpers");

describe("@QualityGateStackTest", () => {
  describe("AWS::DynamoDB::Table Resources", () => {
    it("should have SSESpecification with SSEEnabled", () => {
      validateInRawYaml(
        "AWS::DynamoDB::Table",
        /SSEEnabled:\s*true/,
        "missing SSEEnabled: true"
      );
    });

    it("should have SSEType set to KMS in SSESpecification", () => {
      validateInRawYaml(
        "AWS::DynamoDB::Table",
        /SSEType:\s*KMS\s*$/m,
        "missing SSEType: KMS in SSESpecification"
      );
    });

    it("should have KeySchema with at least HASH key", () => {
      validateInRawYaml(
        "AWS::DynamoDB::Table",
        /KeyType:\s*["']?HASH["']?/,
        "missing HASH key in KeySchema"
      );
    });

    it("should have TableName specified", () => {
      validateResourceProperty(
        "AWS::DynamoDB::Table",
        "TableName",
        (val) => !!val,
        "missing TableName in Properties"
      );
    });

    it("should have KeySchema defined", () => {
      validateResourceProperty(
        "AWS::DynamoDB::Table",
        "KeySchema",
        (val) => val && Array.isArray(val) && val.length > 0,
        "missing or empty KeySchema"
      );
    });
  });
});
