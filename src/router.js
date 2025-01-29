const commonExpress = require("@govuk-one-login/di-ipv-cri-common-express");
const { getGTM, getLanguageToggle } = commonExpress.lib.locals;
const setScenarioHeaders = commonExpress.lib.scenarioHeaders;
const setAxiosDefaults = commonExpress.lib.axios;

const steps = require("./app/passport/steps");
const fields = require("./app/passport/fields");
const featureSets = require("./app/passport/featureSets");
const wizard = require("hmpo-form-wizard");
const overloadProtection = require("./app/passport/overloadProtection");

const init = (router) => {
  router.use(overloadProtection);

  router.use(getGTM);
  router.use(getLanguageToggle);
  router.use(setScenarioHeaders);
  router.use(setAxiosDefaults);
  router.use(featureSets);

  router.use("/oauth2", commonExpress.routes.oauth2);

  const wizardOptions = {
    name: "cri-uk-passport-front",
    journeyName: "passport",
    templatePath: "passport"
  };

  router.use(wizard(steps, fields, wizardOptions));

  router.use(commonExpress.lib.errorHandling.redirectAsErrorToCallback);
};

module.exports = { init };
