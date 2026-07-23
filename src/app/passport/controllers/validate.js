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
      const headers = /** @type {import("axios").RawAxiosRequestHeaders} */ {
        session_id: req.session.tokenId,
        ...createPersonalDataHeaders(`${BASE_URL}${CHECK}`, req)
      };

      LOGGER.info("validate: calling check-passport lambda");
      const checkPassportResponse = await req.axios.post(
        `${CHECK}`,
        attributes,
        { headers }
      );

      if (checkPassportResponse.data?.result === "retry") {
        LOGGER.info("validate: passport retry");
        req.sessionModel.set("showRetryMessage", true);
      } else {
        req.session.authParams.redirect_uri =
          checkPassportResponse.data.redirect_uri;
        req.session.authParams.state = checkPassportResponse.data.state;

        LOGGER.info("validate: redirecting user to callBack with url");
      }

      callback();
    } catch (err) {
      let prefix = "error thrown in validate controller";

      if (
        !req.session.authParams?.state ||
        !req.session.authParams?.redirect_uri
      ) {
        prefix = "failed to retrieve authorization redirect_uri or state";
      }

      super.saveValues(req, res, () => {
        LOGGER.logError(req, err, { messagePrefix: prefix });

        const error = {
          error: "server_error",
          error_description: prefix
        };
        req.sessionModel.set("error", error);
        callback(err);
      });
    }
  }
}

module.exports = ValidateController;
