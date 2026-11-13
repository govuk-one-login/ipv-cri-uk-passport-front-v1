const { expect } = require("chai");
const { getResourcesByType } = require("../helpers/helpers");

describe("@QualityGateStackTest", () => {
  describe("ECS Resources", () => {
    describe("AWS::ECS::Cluster", () => {
      it("should have valid cluster configuration", () => {
        const clusters = getResourcesByType("AWS::ECS::Cluster");
        clusters.forEach(([, cluster]) => {
          expect(cluster.Properties).to.be.an("object");
        });
      });
    });

    describe("AWS::ECS::Service", () => {
      it("should have required properties", () => {
        const services = getResourcesByType("AWS::ECS::Service");
        services.forEach(([, service]) => {
          expect(service.Properties).to.have.property("TaskDefinition");
          expect(service.Properties).to.have.property("Cluster");
        });
      });
    });

    describe("AWS::ECS::TaskDefinition", () => {
      it("should have required properties", () => {
        const taskDefs = getResourcesByType("AWS::ECS::TaskDefinition");
        taskDefs.forEach(([, taskDef]) => {
          expect(taskDef.Properties).to.have.property("ContainerDefinitions");
          expect(taskDef.Properties.ContainerDefinitions).to.be.an("array");
        });
      });
    });
  });
});
