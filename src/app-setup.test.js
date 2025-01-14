const AppSetup = require("./app-setup");
const path = require("path");
const sessionConfig = require("./session-config");
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
      AppSetup.init(app, router);

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

    it("should set API config variables", () => {
      AppSetup.init(app, router);

      sinon.assert.calledWith(
        app.set,
        "API.BASE_URL",
        "http://localhost:5007/"
      );
      sinon.assert.calledWith(app.set, "API.PATHS.SESSION", "session");
      sinon.assert.calledWith(
        app.set,
        "API.PATHS.AUTHORIZATION",
        "authorization"
      );
    });

    it("should set Oauth paths", () => {
      AppSetup.init(app, router);

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
        port: 5050,
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
        //Ignoring middleware setup as arrow function cannot be asserted
        dev: true
      };
      sinon.assert.calledOnce(setup);
      sinon.assert.calledWithMatch(setup, options);
    });
  });
});
