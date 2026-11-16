/**
 * Configuration file for test environment variables
 * .env is loaded by test/browser/cucumber.js via process.loadEnvFile()
 * Environment variables (process.env) take precedence over .env values
 */

module.exports = {
  ENVIRONMENT: process.env.ENVIRONMENT,
  CORE_STUB_URL: process.env.coreStubUrl,
  CORE_STUB_USERNAME: process.env.coreStubUsername,
  CORE_STUB_PASSWORD: process.env.coreStubPassword,
  API_BASE_URL: process.env.API_BASE_URL
};
