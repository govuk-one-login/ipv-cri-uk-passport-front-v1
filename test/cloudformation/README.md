# CloudFormation Tests

Modular test suite for validating CloudFormation template resources and configurations.

## Structure

```
test/cloudformation/
├── helpers/
│   ├── helpers.js             # Core validation functions
│   └── constants.js           # Reusable test constants
├── resources/                 # Resource-specific tests
│   ├── apigateway.test.js
│   ├── autoscaling.test.js
│   ├── cloudformation.test.js
│   ├── cloudwatch.test.js
│   ├── dynamodb.test.js
│   ├── ec2.test.js
│   ├── ecs.test.js
│   ├── elasticache.test.js
│   ├── elb.test.js
│   ├── iam.test.js
│   ├── kms.test.js
│   ├── s3.test.js
│   ├── sns.test.js
│   └── waf.test.js
├── coverage.test.js           # Test coverage validation
├── general.test.js            # Cross-cutting validations
└── test.config.js             # Test configuration
```

## Running Tests

```bash
yarn run test:cloudformation
```

## Helper Functions

### `getResourcesByType(resourceType)`

Returns array of `[resourceName, resource]` tuples for a given AWS resource type.

### `validateResourceProperty(resourceType, propertyPath, validator, errorMsg)`

Validates a specific property across all resources of a type using a validator function.

### `validateInRawYaml(resourceType, pattern, errorMsg)`

Validates patterns in raw YAML content for complex structure checks.

## Test Categories

- **Resource Tests**: Validate specific AWS resource configurations
- **General Tests**: Cross-cutting validations (naming, tags, security)
- **Coverage Tests**: Ensure all resources have corresponding tests

## Adding New Resources

1. Add resource type mapping to `coverage.test.js`
2. Create or update appropriate test file in `resources/`
