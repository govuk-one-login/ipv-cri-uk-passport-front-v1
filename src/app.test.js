const path = require("path");
const commonExpress = require("@govuk-one-login/di-ipv-cri-common-express");

const {
  API,
  APP,
  PORT,
  SESSION_SECRET,
  SESSION_TABLE_NAME,
  SESSION_TTL,
  LOG_LEVEL
} = require("./lib/config");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

describe("app", () => {
  beforeEach(() => {
    setup = sinon.stub();
    setGTM = sinon.stub();
    setDeviceIntelligence = sinon.stub();
    app = sinon.stub();
    AWS = {
      DynamoDBClient: sinon.stub(),
      config: {
        update: sinon.stub()
      }
    };
    DynamoDBStore = sinon.stub();
  });

  afterEach(() => {
    console.log("TEST COMPLETE");
  });

  describe("setup app", () => {
    it("should set App", () => {
      const loggerConfig = {
        consoleLevel: LOG_LEVEL,
        console: true,
        consoleJSON: true,
        app: false
      };

      AWS.config.update({
        region: "eu-west-2"
      });
      const dynamodbClient = new DynamoDBClient({});

      const dynamoDBSessionStore = new DynamoDBStore({
        client: dynamodbClient,
        table: SESSION_TABLE_NAME
      });

      const helmetConfig = require("@govuk-one-login/di-ipv-cri-common-express");

      const sessionConfig = {
        cookieName: "service_session",
        secret: SESSION_SECRET,
        cookieOptions: { maxAge: SESSION_TTL },
        ...(SESSION_TABLE_NAME && { sessionStore: dynamoDBSessionStore })
      };

      let options = {
        config: { APP_ROOT: __dirname },
        port: PORT,
        logs: loggerConfig,
        session: sessionConfig,
        helmet: helmetConfig,
        redis: SESSION_TABLE_NAME ? false : commonExpress.lib.redis(),
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
      };

      setup(options);

      expect(setup).to.have.been.calledWithExactly(options);
      sinon.assert.calledWith(setup, sinon.match.has("port", 5050));
    });

    it("should set GTM variables", () => {
      let options = {
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
      };

      setGTM(options);

      expect(setGTM).to.have.been.calledWithExactly(options);
      sinon.assert.calledWith(
        setGTM,
        sinon.match.has("ga4ContainerId", "GTM-XXXXXXX")
      );
      sinon.assert.calledWith(
        setGTM,
        sinon.match.has("uaContainerId", "UA-XXXXXXX")
      );
      sinon.assert.calledWith(
        setGTM,
        sinon.match.has("analyticsCookieDomain", "localhost")
      );
      sinon.assert.calledWith(setGTM, sinon.match.has("ga4Enabled", true));
      sinon.assert.calledWith(setGTM, sinon.match.has("uaEnabled", false));
    });

    it("should set Device Intelligence variables", () => {
      let options = {
        app,
        deviceIntelligenceEnabled: APP.DEVICE_INTELLIGENCE_ENABLED,
        deviceIntelligenceDomain: APP.DEVICE_INTELLIGENCE_DOMAIN
      };

      setDeviceIntelligence(options);

      expect(setDeviceIntelligence).to.have.been.calledWithExactly(options);
      sinon.assert.calledWith(
        setDeviceIntelligence,
        sinon.match.has("deviceIntelligenceEnabled", false)
      );
      sinon.assert.calledWith(
        setDeviceIntelligence,
        sinon.match.has("deviceIntelligenceDomain", "localhost")
      );
      sinon.assert.calledWith(
        setDeviceIntelligence,
        sinon.match.has("deviceIntelligenceEnabled", false)
      );
      sinon.assert.calledWith(
        setDeviceIntelligence,
        sinon.match.has("deviceIntelligenceDomain", "localhost")
      );
    });
  });
});
