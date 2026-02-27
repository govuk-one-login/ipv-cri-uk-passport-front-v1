module.exports = {
  // Test execution settings
  timeout: 10000,

  // Template location
  templatePath: "./deploy/template.yaml",

  // Log retention settings
  defaultLogRetentionDays: 30,

  // Test environment settings
  skipSlowTests: process.env.SKIP_SLOW_TESTS === "true",

  // Validation rules
  rules: {
    requireDeletionPolicy: true,
    requireTags: true,
    allowHardcodedAccountIds: false,
    requireEncryption: true,
    maxResourcesPerType: 50
  },

  // Custom matchers
  matchers: {
    hasValidArn: (arn) => arn.startsWith("arn:aws:"),
    hasValidCidr: (cidr) => /^\d+\.\d+\.\d+\.\d+\/\d+$/.test(cidr),
    isValidPort: (port) => port >= 1 && port <= 65535
  }
};
