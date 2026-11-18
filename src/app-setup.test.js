const AppSetup = require("./app-setup");
const path = require("path");
const sessionConfig = require("./session-config");
const commonExpress = require("@govuk-one-login/di-ipv-cri-common-express");
const helmetConfig = require("@govuk-one-login/di-ipv-cri-common-express/src/lib/helmet");

describe("app-setup", () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    app = {
      set: sandbox.stub(),
      use: sandbox.stub()
    };
    router = {
      use: sandbox.stub()
    };
    setup = sandbox.stub().returns({ app, router });

    isDynamoBool = new Boolean(true);
    sessionConfigMap = sandbox.stub();

    sandbox.stub(sessionConfig, "init").returns({
      cookieName: "service_session",
      secret: 1234,
      cookieOptions: { maxAge: 7200000 },
      ...("table-name" && { sessionStore: {} })
    });
    sandbox.stub(sessionConfig, "isDynamo").returns(isDynamoBool);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("setup app", () => {
    it("should set GTM variables", () => {
      AppSetup.init(app);

      sinon.assert.calledWith(
        app.set,
        "APP.GTM.GA4_CONTAINER_ID",
        "GTM-XXXXXXX"
      );
      sinon.assert.calledWith(
        app.set,
        "APP.GTM.ANALYTICS_COOKIE_DOMAIN",
        "localhost"
      );
      sinon.assert.calledWith(app.set, "APP.GTM.UA_CONTAINER_ID", "UA-XXXXXXX");
      sinon.assert.calledWith(app.set, "APP.GTM.UA_ENABLED", false);
      sinon.assert.calledWith(app.set, "APP.GTM.GA4_ENABLED", true);
    });

    it("should set Device Intelligence  variables", () => {
      AppSetup.init(app);

      sinon.assert.calledWith(
        app.set,
        "APP.DEVICE_INTELLIGENCE_ENABLED",
        false
      );
      sinon.assert.calledWith(
        app.set,
        "APP.DEVICE_INTELLIGENCE_DOMAIN",
        "localhost"
      );
      sinon.assert.calledWith(
        app.set,
        "APP.DEVICE_INTELLIGENCE_ENABLED",
        false
      );
      sinon.assert.calledWith(
        app.set,
        "APP.DEVICE_INTELLIGENCE_DOMAIN",
        "localhost"
      );
    });

    it("should set API config variables", () => {
      AppSetup.init(app);

      sinon.assert.calledWith(app.set, "API.BASE_URL", "http://localhost:5007");
      sinon.assert.calledWith(app.set, "API.PATHS.SESSION", "/session");
      sinon.assert.calledWith(
        app.set,
        "API.PATHS.AUTHORIZATION",
        "/authorization"
      );
    });

    it("should set Oauth paths", () => {
      AppSetup.init(app);

      sinon.assert.calledWith(app.set, "APP.PATHS.ENTRYPOINT", "/");
    });

    it("should set application config", () => {
      const { app, router } = AppSetup.create(setup);

      const loggerConfig = {
        consoleLevel: "request",
        console: true,
        consoleJSON: true,
        app: false
      };

      const options = {
        config: { APP_ROOT: __dirname },
        port: false,
        logs: loggerConfig,
        session: {
          cookieName: "service_session",
          secret: 1234,
          cookieOptions: { maxAge: 7200000 },
          ...("table-name" && { sessionStore: {} })
        },
        helmet: helmetConfig,
        redis: isDynamoBool ? false : commonExpress.lib.redis(),
        urls: {
          public: "/public",
          publicImages: "/public/images"
        },
        publicDirs: ["../dist/public"],
        publicImagesDirs: ["../dist/public/images"],
        views: [
          path.resolve(
            path.dirname(
              require.resolve("@govuk-one-login/di-ipv-cri-common-express")
            ),
            "components"
          ),
          path.resolve("node_modules/@govuk-one-login/"),
          "views"
        ]
      };
      sinon.assert.calledOnce(setup);
      sinon.assert.calledWithMatch(setup, options);
    });

    it("should set up i18next at app level in middlewareSetupFn", () => {
      const setI18n = sandbox.stub(commonExpress.lib.i18n, "setI18n");

      AppSetup.create(setup);
      const { middlewareSetupFn } = setup.firstCall.args[0];
      middlewareSetupFn(app);

      sinon.assert.calledOnceWithMatch(setI18n, {
        router: app,
        config: { secure: true, cookieDomain: "localhost" }
      });
    });

    it("should set language toggle locals after i18next in middlewareSetupFn", () => {
      const setI18n = sandbox.stub(commonExpress.lib.i18n, "setI18n");

      AppSetup.create(setup);
      const { middlewareSetupFn } = setup.firstCall.args[0];
      middlewareSetupFn(app);

      sinon.assert.calledWith(
        app.use,
        commonExpress.lib.locals.getLanguageToggle
      );
      sinon.assert.callOrder(
        setI18n,
        app.use.withArgs(commonExpress.lib.locals.getLanguageToggle)
      );
    });
  });
});
