const { expect } = require("chai");
const { getResourcesByType } = require("../helpers/helpers");

describe("@QualityGateStackTest", () => {
  describe("IAM Resources", () => {
    describe("AWS::IAM::Role", () => {
      it("should have required properties", () => {
        const roles = getResourcesByType("AWS::IAM::Role");
        roles.forEach(([, role]) => {
          expect(role.Properties).to.have.property("AssumeRolePolicyDocument");
          expect(role.Properties.AssumeRolePolicyDocument).to.be.an("object");
        });
      });

      it("should have valid trust policy", () => {
        const roles = getResourcesByType("AWS::IAM::Role");
        roles.forEach(([, role]) => {
          const trustPolicy = role.Properties.AssumeRolePolicyDocument;
          expect(trustPolicy).to.have.property("Version");
          expect(trustPolicy).to.have.property("Statement");
          expect(trustPolicy.Statement).to.be.an("array");
        });
      });
    });
  });
});
