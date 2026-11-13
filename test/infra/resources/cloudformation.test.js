const { expect } = require("chai");
const { getResourcesByType } = require("../helpers/helpers");

describe("@QualityGateStackTest", () => {
  describe("CloudFormation Resources", () => {
    describe("AWS::CloudFormation::Stack", () => {
      it("should have required properties", () => {
        const stacks = getResourcesByType("AWS::CloudFormation::Stack");
        stacks.forEach(([, stack]) => {
          expect(stack.Properties).to.have.property("TemplateURL");
        });
      });

      it("should have valid template URL", () => {
        const stacks = getResourcesByType("AWS::CloudFormation::Stack");
        stacks.forEach(([, stack]) => {
          if (stack.Properties?.TemplateURL) {
            expect(stack.Properties.TemplateURL).to.be.a("string");
          }
        });
      });
    });
  });
});
