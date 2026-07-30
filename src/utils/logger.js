const { name } = require("../../package.json");

const wrapper = require("@govuk-one-login/di-ipv-cri-common-express").bootstrap
  .logger;

/** @type {import("pino").Logger} */
const LOGGER = wrapper.get(name);

/**
 * @param {import("express").Request} req
 * @param {Error} err
 * @param {{ messagePrefix?: string }} [options]
 */
LOGGER.logError = (req, err, options) =>
  wrapper.logError(req, err, { logger: LOGGER, ...options });

module.exports = LOGGER;
