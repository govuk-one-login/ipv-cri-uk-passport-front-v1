/**
 * Configuration reader utility
 * Reads configuration from config.js with environment variables taking precedence
 */
const config = require("./config");

class ConfigurationReader {
  /**
   * @param {string} keyName - The configuration key
   * @returns {string} The configuration value
   * @throws {Error} If key is not found in either source
   */
  static get(keyName) {
    const envValue = process.env[keyName];
    if (envValue !== undefined) {
      return envValue;
    }

    const configValue = config[keyName];
    if (configValue !== undefined) {
      return configValue;
    }

    throw new Error(
      `Configuration key "${keyName}" not found in environment variables or config.js`
    );
  }

  /**
   * Gets environment value or throws error if not found
   * Only checks process.env, not config.js
   *
   * @param {string} variable - The environment variable name
   * @returns {string} The environment variable value
   * @throws {Error} If environment variable is not set
   */
  static getEnvironmentVariableOrError(variable) {
    const value = process.env[variable];
    if (value === undefined) {
      throw new Error(`Environment variable "${variable}" is not set`);
    }
    return value;
  }

  /**
   * Gets environment value with a default fallback
   *
   * @param {string} keyName - The configuration key
   * @param {string} defaultValue - Default value if not found
   * @returns {string} The configuration value or default
   */
  static getWithDefault(keyName, defaultValue) {
    try {
      return this.get(keyName);
    } catch {
      return defaultValue;
    }
  }
}

module.exports = ConfigurationReader;
