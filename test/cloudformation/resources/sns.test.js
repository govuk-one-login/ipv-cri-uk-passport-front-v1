const { validateResourceProperty } = require("../helpers/helpers");

describe("@QualityGateStackTest", () => {
  describe("SNS Resources", () => {
    describe("AWS::SNS::Topic", () => {
      it("should have KmsMasterKeyId in Properties", () => {
        validateResourceProperty(
          "AWS::SNS::Topic",
          "KmsMasterKeyId",
          (val) => !!val,
          "missing KmsMasterKeyId for encryption"
        );
      });

      it("should have DisplayName in Properties", () => {
        validateResourceProperty(
          "AWS::SNS::Topic",
          "DisplayName",
          (val) => !!val,
          "missing DisplayName"
        );
      });
    });

    describe("AWS::SNS::TopicPolicy", () => {
      it("should have required properties", () => {
        validateResourceProperty(
          "AWS::SNS::TopicPolicy",
          "Topics",
          (val) => !!val,
          "missing Topics"
        );
      });
    });

    describe("AWS::SNS::Subscription", () => {
      it("should have required properties", () => {
        validateResourceProperty(
          "AWS::SNS::Subscription",
          "TopicArn",
          (val) => !!val,
          "missing TopicArn"
        );
      });

      it("should have Protocol in Properties", () => {
        validateResourceProperty(
          "AWS::SNS::Subscription",
          "Protocol",
          (val) => !!val,
          "missing Protocol"
        );
      });
    });
  });
});
