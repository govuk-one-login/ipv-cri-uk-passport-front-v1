const { expect } = require("chai");
const { getResourcesByType } = require("../helpers/helpers");

describe("@QualityGateStackTest", () => {
  describe("WAF Resources", () => {
    describe("AWS::WAFv2::WebACLAssociation", () => {
      it("should have required properties", () => {
        const associations = getResourcesByType(
          "AWS::WAFv2::WebACLAssociation"
        );
        associations.forEach(([, association]) => {
          expect(association.Properties).to.have.property("ResourceArn");
          expect(association.Properties).to.have.property("WebACLArn");
        });
      });
    });
  });
});
