const BaseController = require("hmpo-form-wizard").Controller;

const {
  API: {
    BASE_URL,
    PATHS: { CHECK }
  }
} = require("../../../lib/config");

const {
  createPersonalDataHeaders
} = require("@govuk-one-login/frontend-passthrough-headers");
const LOGGER = require("../../../utils/logger");

class ValidateController extends BaseController {
  async saveValues(req, res, callback) {
    const firstName = req.sessionModel.get("firstName");
    const middleNames = req.sessionModel.get("middleNames");
    const forenames =
      middleNames === ""
        ? firstName.split(" ")
        : firstName.split(" ").concat(middleNames.split(" "));
    const attributes = {
      passportNumber: req.sessionModel.get("passportNumber"),
      surname: req.sessionModel.get("surname"),
      forenames: forenames,
      dateOfBirth: req.sessionModel.get("dateOfBirth"),
      expiryDate: req.sessionModel.get("expiryDate")
    };

    try {
      const headers = {
        session_id: req.session.tokenId,
        ...createPersonalDataHeaders(`${BASE_URL}${CHECK}`, req)
      };

      LOGGER.info("validate: calling check-passport lambda");

      const checkPassportResponse = await req.customFetch(CHECK, {
        method: "POST",
        jsonBody: attributes,
        headers
      });
      const body = await checkPassportResponse.json();

      if (body?.result === "retry") {
        req.sessionModel.set("showRetryMessage", true);
        LOGGER.info("validate: passport retry");
      } else {
        req.session.authParams.redirect_uri = body.redirect_uri;
        req.session.authParams.state = body.state;
        LOGGER.info("validate: redirecting user to callback");
      }

      callback();
    } catch (err) {
      LOGGER.logError(req, err, { messagePrefix: "validate" });
      callback(err);
    }
  }
}

module.exports = ValidateController;
