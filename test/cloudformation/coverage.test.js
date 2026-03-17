const { expect } = require("chai");
const { getAllResourceTypes } = require("./helpers/helpers");
const fs = require("node:fs");
const path = require("node:path");

describe("@QualityGateStackTest", () => {
  describe("Test Coverage Validation", () => {
    it("should have tests for all resource types in template", () => {
      const allResourceTypes = getAllResourceTypes();
      const resourcesDir = path.join(__dirname, "resources");
      const testFiles = new Set(
        fs.readdirSync(resourcesDir).filter((f) => f.endsWith(".test.js"))
      );

      // Map of resource types to expected test files
      const resourceTypeMapping = {
        "AWS::S3::Bucket": "s3.test.js",
        "AWS::S3::BucketPolicy": "s3.test.js",
        "AWS::KMS::Key": "kms.test.js",
        "AWS::SNS::Topic": "sns.test.js",
        "AWS::SNS::TopicPolicy": "sns.test.js",
        "AWS::SNS::Subscription": "sns.test.js",
        "AWS::DynamoDB::Table": "dynamodb.test.js",
        "AWS::EC2::SecurityGroup": "ec2.test.js",
        "AWS::EC2::SecurityGroupIngress": "ec2.test.js",
        "AWS::EC2::SecurityGroupEgress": "ec2.test.js",
        "AWS::ElasticLoadBalancingV2::LoadBalancer": "elb.test.js",
        "AWS::ElasticLoadBalancingV2::TargetGroup": "elb.test.js",
        "AWS::ElasticLoadBalancingV2::Listener": "elb.test.js",
        "AWS::CloudWatch::Alarm": "cloudwatch.test.js",
        "AWS::Logs::MetricFilter": "cloudwatch.test.js",
        "AWS::Logs::LogGroup": "cloudwatch.test.js",
        "AWS::Logs::SubscriptionFilter": "cloudwatch.test.js",
        "AWS::ApplicationAutoScaling::ScalableTarget": "autoscaling.test.js",
        "AWS::ApplicationAutoScaling::ScalingPolicy": "autoscaling.test.js",
        "AWS::WAFv2::WebACLAssociation": "waf.test.js",
        "AWS::ECS::Cluster": "ecs.test.js",
        "AWS::ECS::Service": "ecs.test.js",
        "AWS::ECS::TaskDefinition": "ecs.test.js",
        "AWS::IAM::Role": "iam.test.js",
        "AWS::CloudFormation::Stack": "cloudformation.test.js",
        "AWS::ApiGatewayV2::Api": "apigateway.test.js",
        "AWS::ApiGatewayV2::Integration": "apigateway.test.js",
        "AWS::ApiGatewayV2::Route": "apigateway.test.js",
        "AWS::ApiGatewayV2::Stage": "apigateway.test.js"
      };

      const missingTests = [];
      allResourceTypes.forEach((resourceType) => {
        const expectedFile = resourceTypeMapping[resourceType];
        if (!expectedFile) {
          missingTests.push(`No test mapping defined for ${resourceType}`);
        } else if (!testFiles.has(expectedFile)) {
          missingTests.push(
            `Missing test file ${expectedFile} for ${resourceType}`
          );
        }
      });

      if (missingTests.length > 0) {
        expect.fail(`Test coverage gaps found:\n${missingTests.join("\n")}`);
      }
    });

    it("should not have orphaned test files", () => {
      const allResourceTypes = getAllResourceTypes();
      const resourcesDir = path.join(__dirname, "resources");
      const testFiles = fs
        .readdirSync(resourcesDir)
        .filter((f) => f.endsWith(".test.js"));

      // Map of resource types to expected test files (same as above)
      const resourceTypeMapping = {
        "AWS::S3::Bucket": "s3.test.js",
        "AWS::S3::BucketPolicy": "s3.test.js",
        "AWS::KMS::Key": "kms.test.js",
        "AWS::SNS::Topic": "sns.test.js",
        "AWS::SNS::TopicPolicy": "sns.test.js",
        "AWS::SNS::Subscription": "sns.test.js",
        "AWS::DynamoDB::Table": "dynamodb.test.js",
        "AWS::EC2::SecurityGroup": "ec2.test.js",
        "AWS::EC2::SecurityGroupIngress": "ec2.test.js",
        "AWS::EC2::SecurityGroupEgress": "ec2.test.js",
        "AWS::ElasticLoadBalancingV2::LoadBalancer": "elb.test.js",
        "AWS::ElasticLoadBalancingV2::TargetGroup": "elb.test.js",
        "AWS::ElasticLoadBalancingV2::Listener": "elb.test.js",
        "AWS::CloudWatch::Alarm": "cloudwatch.test.js",
        "AWS::Logs::MetricFilter": "cloudwatch.test.js",
        "AWS::Logs::LogGroup": "cloudwatch.test.js",
        "AWS::Logs::SubscriptionFilter": "cloudwatch.test.js",
        "AWS::ApplicationAutoScaling::ScalableTarget": "autoscaling.test.js",
        "AWS::ApplicationAutoScaling::ScalingPolicy": "autoscaling.test.js",
        "AWS::WAFv2::WebACLAssociation": "waf.test.js",
        "AWS::ECS::Cluster": "ecs.test.js",
        "AWS::ECS::Service": "ecs.test.js",
        "AWS::ECS::TaskDefinition": "ecs.test.js",
        "AWS::IAM::Role": "iam.test.js",
        "AWS::CloudFormation::Stack": "cloudformation.test.js",
        "AWS::ApiGatewayV2::Api": "apigateway.test.js",
        "AWS::ApiGatewayV2::Integration": "apigateway.test.js",
        "AWS::ApiGatewayV2::Route": "apigateway.test.js",
        "AWS::ApiGatewayV2::Stage": "apigateway.test.js"
      };

      // Get expected test files from resource types in template
      const expectedTestFiles = new Set(
        allResourceTypes
          .map((type) => resourceTypeMapping[type])
          .filter(Boolean)
      );

      const orphanedFiles = testFiles.filter((file) => {
        return (
          !expectedTestFiles.has(file) &&
          !["general.test.js", "coverage.test.js"].includes(file)
        );
      });

      if (orphanedFiles.length > 0) {
        // eslint-disable-next-line no-console
        console.warn(
          `Warning: Potentially orphaned test files: ${orphanedFiles.join(", ")}`
        );
      }
    });
  });
});
