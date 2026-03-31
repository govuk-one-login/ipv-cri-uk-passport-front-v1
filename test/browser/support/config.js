/**
 * Configuration file for test environment variables
 * Loads defaults from .env file
 * Environment variables (process.env) take precedence over .env values
 */
require("dotenv/config");

module.exports = {
  ENVIRONMENT: process.env.ENVIRONMENT,
  CORE_STUB_URL: process.env.coreStubUrl,
  CORE_STUB_USERNAME: process.env.coreStubUsername,
  CORE_STUB_PASSWORD: process.env.coreStubPassword,
  API_BASE_URL: process.env.API_BASE_URL
};
