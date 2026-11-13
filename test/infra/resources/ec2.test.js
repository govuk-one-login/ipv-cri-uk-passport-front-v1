const {
  validateResourceProperty,
  validateInRawYaml
} = require("../helpers/helpers");

describe("@QualityGateStackTest", () => {
  describe("EC2 Resources", () => {
    describe("AWS::EC2::SecurityGroup", () => {
      it("should have GroupDescription in Properties", () => {
        validateResourceProperty(
          "AWS::EC2::SecurityGroup",
          "GroupDescription",
          (val) => !!val,
          "missing GroupDescription"
        );
      });

      it("should have VpcId in Properties", () => {
        validateResourceProperty(
          "AWS::EC2::SecurityGroup",
          "VpcId",
          (val) => !!val,
          "missing VpcId"
        );
      });

      it("should have SecurityGroupIngress or SecurityGroupEgress rules", () => {
        validateInRawYaml(
          "AWS::EC2::SecurityGroup",
          /(SecurityGroupIngress|SecurityGroupEgress):/,
          "missing ingress or egress rules"
        );
      });

      it("should not allow unrestricted inbound access (0.0.0.0/0)", () => {
        validateInRawYaml(
          "AWS::EC2::SecurityGroup",
          /^(?!.*CidrIp:\s*["']?0\.0\.0\.0\/0["']?)/m,
          "contains unrestricted inbound access (0.0.0.0/0)"
        );
      });
    });

    describe("AWS::EC2::SecurityGroupIngress", () => {
      it("should have required properties", () => {
        validateResourceProperty(
          "AWS::EC2::SecurityGroupIngress",
          "GroupId",
          (val) => !!val,
          "missing GroupId"
        );
      });
    });

    describe("AWS::EC2::SecurityGroupEgress", () => {
      it("should have required properties", () => {
        validateResourceProperty(
          "AWS::EC2::SecurityGroupEgress",
          "GroupId",
          (val) => !!val,
          "missing GroupId"
        );
      });
    });
  });
});
