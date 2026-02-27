const { validateResourceProperty } = require("../helpers/helpers");

describe("@QualityGateStackTest", () => {
  describe("AWS::ApplicationAutoScaling::ScalableTarget Resources", () => {
    it("should have MinCapacity specified", () => {
      validateResourceProperty(
        "AWS::ApplicationAutoScaling::ScalableTarget",
        "MinCapacity",
        (val) => val !== undefined,
        "missing MinCapacity"
      );
    });

    it("should have MaxCapacity specified", () => {
      validateResourceProperty(
        "AWS::ApplicationAutoScaling::ScalableTarget",
        "MaxCapacity",
        (val) => val !== undefined,
        "missing MaxCapacity"
      );
    });

    it("should have ResourceId specified", () => {
      validateResourceProperty(
        "AWS::ApplicationAutoScaling::ScalableTarget",
        "ResourceId",
        (val) => !!val,
        "missing ResourceId"
      );
    });

    it("should have ScalableDimension specified", () => {
      validateResourceProperty(
        "AWS::ApplicationAutoScaling::ScalableTarget",
        "ScalableDimension",
        (val) => !!val,
        "missing ScalableDimension"
      );
    });

    it("should have ServiceNamespace specified", () => {
      validateResourceProperty(
        "AWS::ApplicationAutoScaling::ScalableTarget",
        "ServiceNamespace",
        (val) => !!val,
        "missing ServiceNamespace"
      );
    });
  });
});
