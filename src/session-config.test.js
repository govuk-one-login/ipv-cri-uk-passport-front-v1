const sessionConfig = require("./session-config");
const sessionDbConfig = require("./dynamo-session-config");

describe("app", () => {
  const sandbox = sinon.createSandbox();
  beforeEach(() => {
    sandbox
      .stub(sessionDbConfig, "createSessionStore")
      .returns("sessionStoreMock");
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("setup session", () => {
    it("should initialise session config", () => {
      var initialisedSessionConfig = sessionConfig.init();
      expect(initialisedSessionConfig).to.deep.equal({
        cookieName: "service_session",
        secret: "1234",
        cookieOptions: { maxAge: 7200000 },
        ...("table-name" && { sessionStore: "sessionStoreMock" })
      });
    });

    it("should return true if table name is set", () => {
      var isDynamo = sessionConfig.isDynamo();
      expect(isDynamo).to.be.true;
    });
  });
});
