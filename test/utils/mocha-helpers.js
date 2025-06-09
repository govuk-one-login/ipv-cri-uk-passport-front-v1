import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import chaiAsPromised from "chai-as-promised";
import reqres from "reqres";
import JourneyModel from "hmpo-form-wizard/lib/journey-model.js";
import WizardModel from "hmpo-form-wizard/lib/wizard-model.js";

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

const expect = chai.expect;

global.sinon = sinon;
global.expect = expect;

global.setupDefaultMocks = () => {
  const req = reqres.req({
    form: { values: {} },
    axios: {
      get: sinon.fake(),
      post: sinon.fake()
    },
    ordnanceAxios: {
      get: sinon.fake()
    }
  });

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

  const res = reqres.res({});
  const next = sinon.fake();
  return {
    req,
    res,
    next
  };
};
