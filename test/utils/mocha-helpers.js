process.env.SESSION_SECRET = "1234";
process.env.SESSION_TABLE_NAME = "table-name";
process.env.USE_PINO_LOGGER = "true";

import { expect, should, use } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import chaiAsPromised from "chai-as-promised";
import JourneyModel from "hmpo-form-wizard/lib/journey-model.js";
import WizardModel from "hmpo-form-wizard/lib/wizard-model.js";

should();
use(sinonChai);
use(chaiAsPromised);

global.sinon = sinon;
global.expect = expect;

global.setupDefaultMocks = () => {
  const req = {
    form: { values: {} },
    axios: {
      get: sinon.fake(),
      post: sinon.fake()
    },
    ordnanceAxios: {
      get: sinon.fake()
    },
    session: {
      "hmpo-wizard-previous": {}
    }
  };

  req.journeyModel = new JourneyModel(null, {
    req,
    key: "test"
  });

  req.sessionModel = new WizardModel(null, {
    req,
    key: "test",
    journeyModel: req.journeyModel,
    fields: {}
  });

  const res = {
    redirect: sinon.fake()
  };

  const next = sinon.fake();
  return {
    req,
    res,
    next
  };
};
