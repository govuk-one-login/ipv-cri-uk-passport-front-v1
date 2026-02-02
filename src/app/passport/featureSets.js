const { PACKAGE_NAME } = require("../../lib/config").API;
const logger =
  require("@govuk-one-login/di-ipv-cri-common-express/src/bootstrap/lib/logger").get(
    PACKAGE_NAME
  );

module.exports = function (req, res, next) {
  try {
    const featureSet = req.query.featureSet;
    const isValidFeatureSet = /^\w{1,32}$/.test(featureSet);
    if (!isValidFeatureSet) {
      throw new Error("Invalid feature set ID");
    }

    if (featureSet !== undefined) {
      logger.info("feature set is " + featureSet);
      req.session.featureSet = featureSet;
    }
    next();
  } catch (error) {
    return next(error);
  }
};
