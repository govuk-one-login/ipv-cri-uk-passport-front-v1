// Resource type constants
const RESOURCE_TYPES = {
  S3_BUCKET: "AWS::S3::Bucket",
  S3_BUCKET_POLICY: "AWS::S3::BucketPolicy",
  KMS_KEY: "AWS::KMS::Key",
  SNS_TOPIC: "AWS::SNS::Topic",
  SNS_TOPIC_POLICY: "AWS::SNS::TopicPolicy",
  DYNAMODB_TABLE: "AWS::DynamoDB::Table",
  CLOUDWATCH_ALARM: "AWS::CloudWatch::Alarm",
  LOGS_METRIC_FILTER: "AWS::Logs::MetricFilter",
  IAM_ROLE: "AWS::IAM::Role",
  EC2_SECURITY_GROUP: "AWS::EC2::SecurityGroup",
  EC2_SECURITY_GROUP_INGRESS: "AWS::EC2::SecurityGroupIngress",
  ELB_LOAD_BALANCER: "AWS::ElasticLoadBalancingV2::LoadBalancer",
  ELB_TARGET_GROUP: "AWS::ElasticLoadBalancingV2::TargetGroup",
  ELB_LISTENER: "AWS::ElasticLoadBalancingV2::Listener",
  WAFV2_WEBACL_ASSOCIATION: "AWS::WAFv2::WebACLAssociation",
  ELASTICACHE_SUBNET_GROUP: "AWS::ElastiCache::SubnetGroup",
  ELASTICACHE_PARAMETER_GROUP: "AWS::ElastiCache::ParameterGroup",
  APPLICATION_AUTOSCALING_SCALABLE_TARGET:
    "AWS::ApplicationAutoScaling::ScalableTarget",
  APPLICATION_AUTOSCALING_SCALING_POLICY:
    "AWS::ApplicationAutoScaling::ScalingPolicy"
};

// Sensitive resource types that require DeletionPolicy
const SENSITIVE_RESOURCE_TYPES = new Set([
  "AWS::RDS::DBInstance",
  "AWS::RDS::DBCluster"
]);

// Taggable resource types
const TAGGABLE_RESOURCE_TYPES = new Set([
  "AWS::ECS::Cluster",
  "AWS::ECS::Service",
  "AWS::ECS::TaskDefinition",
  "AWS::ElasticLoadBalancingV2::LoadBalancer"
]);

// Valid CloudWatch units
const VALID_CLOUDWATCH_UNITS = [
  "Seconds",
  "Microseconds",
  "Milliseconds",
  "Bytes",
  "Kilobytes",
  "Megabytes",
  "Gigabytes",
  "Terabytes",
  "Bits",
  "Kilobits",
  "Megabits",
  "Gigabits",
  "Terabits",
  "Percent",
  "Count",
  "Count/Second",
  "Bytes/Second",
  "Kilobytes/Second",
  "Megabytes/Second",
  "Gigabytes/Second",
  "Terabytes/Second",
  "Bits/Second",
  "Kilobits/Second",
  "Megabits/Second",
  "Gigabits/Second",
  "Terabits/Second",
  "None"
];

// Valid comparison operators for CloudWatch alarms
const VALID_COMPARISON_OPERATORS = [
  "GreaterThanThreshold",
  "GreaterThanOrEqualToThreshold",
  "LessThanThreshold",
  "LessThanOrEqualToThreshold",
  "LessThanLowerOrGreaterThanUpperThreshold",
  "LessThanLowerThreshold",
  "GreaterThanUpperThreshold"
];

// Valid scaling policy types
const VALID_SCALING_POLICY_TYPES = [
  "TargetTrackingScaling",
  "StepScaling",
  "PredictiveScaling"
];

// Allowed hardcoded account IDs
const ALLOWED_ACCOUNT_IDS = new Set([
  "216552277552",
  "885513274347",
  "652711504416"
]);

module.exports = {
  RESOURCE_TYPES,
  SENSITIVE_RESOURCE_TYPES,
  TAGGABLE_RESOURCE_TYPES,
  VALID_CLOUDWATCH_UNITS,
  VALID_COMPARISON_OPERATORS,
  VALID_SCALING_POLICY_TYPES,
  ALLOWED_ACCOUNT_IDS
};
