const {
  validateResourceProperty,
  loadTemplate
} = require("../helpers/helpers");

describe("@QualityGateStackTest", () => {
  describe("AWS::S3::Bucket Resources", () => {
    it("should have BucketEncryption configured", () => {
      validateResourceProperty(
        "AWS::S3::Bucket",
        "BucketEncryption",
        (val) => !!val,
        "missing BucketEncryption"
      );
    });

    it("should have PublicAccessBlockConfiguration", () => {
      validateResourceProperty(
        "AWS::S3::Bucket",
        "PublicAccessBlockConfiguration",
        (val) => !!val,
        "missing PublicAccessBlockConfiguration"
      );
    });

    it("should have VersioningConfiguration", () => {
      validateResourceProperty(
        "AWS::S3::Bucket",
        "VersioningConfiguration",
        (val) => !!val,
        "missing VersioningConfiguration"
      );
    });

    it("should have BucketName specified", () => {
      validateResourceProperty(
        "AWS::S3::Bucket",
        "BucketName",
        (val) => !!val,
        "missing BucketName"
      );
    });
  });

  describe("AWS::S3::BucketPolicy Resources", () => {
    it("should have PolicyDocument", () => {
      validateResourceProperty(
        "AWS::S3::BucketPolicy",
        "PolicyDocument",
        (val) => !!val,
        "missing PolicyDocument"
      );
    });

    it("should have Bucket reference", () => {
      validateResourceProperty(
        "AWS::S3::BucketPolicy",
        "Bucket",
        (val) => !!val,
        "missing Bucket reference"
      );
    });

    it("should enforce TLS version requirements", () => {
      const { templateContent } = loadTemplate();
      const hasNumericLessThan = templateContent.includes("NumericLessThan:");
      const hasTlsVersion = templateContent.includes('"s3:TlsVersion"');

      if (!hasNumericLessThan || !hasTlsVersion) {
        throw new Error("S3 bucket policy missing TLS version enforcement");
      }
    });
  });
});
