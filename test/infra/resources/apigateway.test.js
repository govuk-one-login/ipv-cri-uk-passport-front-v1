const { expect } = require("chai");
const { getResourcesByType } = require("../helpers/helpers");

describe("@QualityGateStackTest", () => {
  describe("API Gateway V2 Resources", () => {
    describe("AWS::ApiGatewayV2::Api", () => {
      it("should have required properties", () => {
        const apis = getResourcesByType("AWS::ApiGatewayV2::Api");
        apis.forEach(([, api]) => {
          expect(api.Properties).to.have.property("Name");
          expect(api.Properties).to.have.property("ProtocolType");
        });
      });
    });

    describe("AWS::ApiGatewayV2::Integration", () => {
      it("should have required properties", () => {
        const integrations = getResourcesByType(
          "AWS::ApiGatewayV2::Integration"
        );
        integrations.forEach(([, integration]) => {
          expect(integration.Properties).to.have.property("ApiId");
          expect(integration.Properties).to.have.property("IntegrationType");
        });
      });
    });

    describe("AWS::ApiGatewayV2::Route", () => {
      it("should have required properties", () => {
        const routes = getResourcesByType("AWS::ApiGatewayV2::Route");
        routes.forEach(([, route]) => {
          expect(route.Properties).to.have.property("ApiId");
          expect(route.Properties).to.have.property("RouteKey");
        });
      });
    });

    describe("AWS::ApiGatewayV2::Stage", () => {
      it("should have required properties", () => {
        const stages = getResourcesByType("AWS::ApiGatewayV2::Stage");
        stages.forEach(([, stage]) => {
          expect(stage.Properties).to.have.property("ApiId");
          expect(stage.Properties).to.have.property("StageName");
        });
      });
    });
  });
});
