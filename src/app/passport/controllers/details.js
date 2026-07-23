const BaseController = require("hmpo-form-wizard").Controller;
const DateControllerMixin = require("hmpo-components").mixins.Date;

const DateController = DateControllerMixin(BaseController);

const LOGGER = require("../../../utils/logger");

class PassportDetailsController extends DateController {
  _padYear(value, offset) {
    LOGGER.info(`offset value of ${offset} ignored as no padding is applied`);
    return value;
  }
  async saveValues(req, res, callback) {
    super.saveValues(req, res, () => {
      req.sessionModel.set("showRetryMessage", false);
      callback();
    });
  }
}
module.exports = PassportDetailsController;
