const { API, APP, LOG_LEVEL } = require("./lib/config");

const commonExpress = require("@govuk-one-login/di-ipv-cri-common-express");

const { setGTM, setLanguageToggle, setDeviceIntelligence } =
  commonExpress.lib.settings;
const { setAPIConfig, setOAuthPaths } = require("./lib/settings");
const sessionConfigService = require("./session-config");
const overloadProtectionConfigService = require("./overload-protection-config");

const path = require("path");
const helmetConfig = require("@govuk-one-login/di-ipv-cri-common-express/src/lib/helmet");
const setHeaders = commonExpress.lib.headers;
const {
  setI18n
} = require("@govuk-one-login/di-ipv-cri-common-express/src/lib/i18next");
// Common express relies on 0/1 strings
const showLanguageToggle = APP.LANGUAGE_TOGGLE_DISABLED === "true" ? "0" : "1";
const {
  frontendVitalSignsInitFromApp
} = require("@govuk-one-login/frontend-vital-signs");

const init = (app, router) => {
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
    ga4Enabled: APP.GTM.GA4_ENABLED,
    uaEnabled: APP.GTM.UA_ENABLED,
    ga4PageViewEnabled: APP.GTM.GA4_PAGE_VIEW_ENABLED,
    ga4FormResponseEnabled: APP.GTM.GA4_FORM_RESPONSE_ENABLED,
    ga4FormErrorEnabled: APP.GTM.GA4_FORM_ERROR_ENABLED,
    ga4FormChangeEnabled: APP.GTM.GA4_FORM_CHANGE_ENABLED,
    ga4NavigationEnabled: APP.GTM.GA4_NAVIGATION_ENABLED,
    ga4SelectContentEnabled: APP.GTM.GA4_SELECT_CONTENT_ENABLED,
    analyticsDataSensitive: APP.GTM.ANALYTICS_DATA_SENSITIVE
  });

  setDeviceIntelligence({
    app,
    deviceIntelligenceEnabled: APP.DEVICE_INTELLIGENCE_ENABLED,
    deviceIntelligenceDomain: APP.DEVICE_INTELLIGENCE_DOMAIN
  });

  setLanguageToggle({ app, showLanguageToggle: showLanguageToggle });
  setI18n({
    router,
    config: {
      secure: true,
      cookieDomain: APP.GTM.ANALYTICS_COOKIE_DOMAIN
    }
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
  const overloadProtectionConfig = overloadProtectionConfigService.init();

  const { app, router } = setup({
    config: { APP_ROOT: __dirname },
    port: false, /// Disabling the bootstrap starting the server.
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
      path.resolve("node_modules/@govuk-one-login/"),
      "views"
    ],
    middlewareSetupFn: (app) => {
      frontendVitalSignsInitFromApp(app, {
        interval: 60000,
        logLevel: "info",
        metrics: [
          "requestsPerSecond",
          "avgResponseTime",
          "maxConcurrentConnections",
          "eventLoopDelay",
          "eventLoopUtilization"
        ],
        staticPaths: [
          /^\/assets\/.*/,
          "/ga4-assets",
          "/javascript",
          "/javascripts",
          "/images",
          "/stylesheets"
        ]
      });
      app.use(setHeaders);
    },
    overloadProtection: overloadProtectionConfig,
    dev: true
  });
  return { app, router };
};

module.exports = { init, create };
