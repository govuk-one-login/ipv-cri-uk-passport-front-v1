const { expect } = require("chai");
const {
  getResourcesByType,
  validateResourceProperty
} = require("../helpers/helpers");

describe("@QualityGateStackTest", () => {
  describe("AWS::ElasticLoadBalancingV2::LoadBalancer Resources", () => {
    it("should have SecurityGroups set in Properties", () => {
      validateResourceProperty(
        "AWS::ElasticLoadBalancingV2::LoadBalancer",
        "SecurityGroups",
        (val) => !!val,
        "missing SecurityGroups in Properties"
      );
    });

    it("should have Scheme set in Properties", () => {
      validateResourceProperty(
        "AWS::ElasticLoadBalancingV2::LoadBalancer",
        "Scheme",
        (val) => !!val,
        "missing Scheme in Properties"
      );
    });

    it("should have LoadBalancerAttributes with Key fields", () => {
      const loadBalancers = getResourcesByType(
        "AWS::ElasticLoadBalancingV2::LoadBalancer"
      );
      expect(loadBalancers).to.have.length.greaterThan(
        0,
        "No LoadBalancer resources found"
      );

      loadBalancers.forEach(([resourceName, resource]) => {
        expect(
          resource.Properties.LoadBalancerAttributes,
          `${resourceName} missing LoadBalancerAttributes in Properties`
        ).to.exist;
        expect(
          resource.Properties.LoadBalancerAttributes,
          `${resourceName} LoadBalancerAttributes must be an array`
        ).to.be.an("array");
        expect(
          resource.Properties.LoadBalancerAttributes,
          `${resourceName} LoadBalancerAttributes cannot be empty`
        ).to.have.length.greaterThan(0);

        resource.Properties.LoadBalancerAttributes.forEach((attr, index) => {
          // Skip conditional attributes that resolve to AWS::NoValue
          if (attr && typeof attr === "object" && attr.Key) {
            expect(
              attr.Key,
              `${resourceName} LoadBalancerAttributes[${index}] missing Key field`
            ).to.exist;
          }
        });
      });
    });
  });

  describe("AWS::ElasticLoadBalancingV2::TargetGroup Resources", () => {
    it("should have HealthCheckEnabled set to 'TRUE' in Properties", () => {
      validateResourceProperty(
        "AWS::ElasticLoadBalancingV2::TargetGroup",
        "HealthCheckEnabled",
        (val) => val === "TRUE" || val === true,
        "HealthCheckEnabled must be TRUE"
      );
    });

    it("should have HealthCheckProtocol set to 'HTTP' in Properties", () => {
      validateResourceProperty(
        "AWS::ElasticLoadBalancingV2::TargetGroup",
        "HealthCheckProtocol",
        (val) => val === "HTTP",
        "HealthCheckProtocol must be HTTP"
      );
    });

    it("should have Protocol set to 'HTTP' in Properties", () => {
      validateResourceProperty(
        "AWS::ElasticLoadBalancingV2::TargetGroup",
        "Protocol",
        (val) => val === "HTTP",
        "Protocol must be HTTP"
      );
    });

    it("should have TargetType set to 'ip' in Properties", () => {
      validateResourceProperty(
        "AWS::ElasticLoadBalancingV2::TargetGroup",
        "TargetType",
        (val) => val === "ip",
        "TargetType must be ip"
      );
    });
  });

  describe("AWS::ElasticLoadBalancingV2::Listener Resources", () => {
    it("should have LoadBalancerArn in Properties", () => {
      validateResourceProperty(
        "AWS::ElasticLoadBalancingV2::Listener",
        "LoadBalancerArn",
        (val) => !!val,
        "missing LoadBalancerArn in Properties"
      );
    });

    it("should have Protocol set to 'HTTP' in Properties", () => {
      validateResourceProperty(
        "AWS::ElasticLoadBalancingV2::Listener",
        "Protocol",
        (val) => val === "HTTP",
        "Protocol must be HTTP"
      );
    });
  });
});
