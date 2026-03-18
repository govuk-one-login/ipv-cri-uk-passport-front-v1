/**
 * Configuration file for test environment variables
 * Loads defaults from .env file
 * Environment variables (process.env) take precedence over .env values
 */
import "dotenv/config";

export default {
  ENVIRONMENT: process.env.ENVIRONMENT,
  CORE_STUB_URL: process.env.CORE_STUB_URL,
  CORE_STUB_USERNAME: process.env.CORE_STUB_USERNAME,
  CORE_STUB_PASSWORD: process.env.CORE_STUB_PASSWORD,
  API_BASE_URL: process.env.API_BASE_URL
};
