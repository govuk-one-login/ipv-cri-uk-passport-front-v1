const { API, APP, PORT, LOG_LEVEL } = require("./lib/config");

const commonExpress = require("@govuk-one-login/di-ipv-cri-common-express");

const { setGTM } = commonExpress.lib.settings;
const { setAPIConfig, setOAuthPaths } = require("./lib/settings");
const sessionConfigService = require("./session-config");

const path = require("path");
const helmetConfig = commonExpress.lib.helmet;
const setHeaders = commonExpress.lib.headers;

const init = (app) => {
  setAPIConfig({
    app,
    baseUrl: API.BASE_URL,
    sessionPath: API.PATHS.SESSION,
    authorizationPath: API.PATHS.AUTHORIZATION
  });

  setOAuthPaths({ app, entryPointPath: APP.PATHS.PASSPORT });

  setGTM({
    app,
    ga4ContainerId: APP.GTM.GA4_ID,
    uaContainerId: APP.GTM.UA_ID,
    analyticsCookieDomain: APP.GTM.ANALYTICS_COOKIE_DOMAIN,
    ga4Disabled: APP.GTM.GA4_DISABLED,
    uaDisabled: APP.GTM.UA_DISABLED
  });
};

const create = (setup) => {
  const loggerConfig = {
    consoleLevel: LOG_LEVEL,
    console: true,
    consoleJSON: true,
    app: false,
    requestMeta: {
      sessionId: "session.sessionId"
    },
    meta: {
      sessionId: "session.sessionId"
    }
  };

  const sessionConfig = sessionConfigService.init();

  const { app, router } = setup({
    config: { APP_ROOT: __dirname },
    port: PORT,
    logs: loggerConfig,
    session: sessionConfig,
    helmet: helmetConfig,
    redis: sessionConfigService.isDynamo() ? false : commonExpress.lib.redis(),
    urls: {
      public: "/public",
      publicImages: "/public/images"
    },
    publicDirs: ["../dist/public"],
    publicImagesDirs: ["../dist/public/images"],
    translation: {
      allowedLangs: ["en", "cy"],
      fallbackLang: ["en"],
      cookie: { name: "lng" }
    },
    views: [
      path.resolve(
        path.dirname(
          require.resolve("@govuk-one-login/di-ipv-cri-common-express")
        ),
        "components"
      ),
      "views"
    ],
    middlewareSetupFn: (app) => {
      app.use(setHeaders);
    },
    dev: true
  });
  return { app, router };
};

module.exports = { init, create };
