const BaseController = require("hmpo-form-wizard").Controller;
const ValidateController = require("./validate");

const SESSION_ID = "passport123";

const buildSessionModel = (req) => {
  req.sessionModel.set("passportNumber", "123456789");
  req.sessionModel.set("surname", "Jones Smith");
  req.sessionModel.set("middleNames", "");
  req.sessionModel.set("firstName", "Dan");
  req.sessionModel.set("dateOfBirth", "10/02/1975");
  req.sessionModel.set("expiryDate", "15/01/2035");
};

describe("validate controller", () => {
  const validate = new ValidateController({ route: "/test" });

  let req;
  let res;
  let next;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    const setup = setupDefaultMocks();
    req = setup.req;
    res = setup.res;
    next = setup.next;

    req.session.tokenId = SESSION_ID;
    req.session.authParams = { redirect_uri: "https://foo.bar.dev" };
  });
  afterEach(() => sandbox.restore());

  it("should be an instance of BaseController", () => {
    expect(validate).to.be.an.instanceof(BaseController);
  });

  it("should set redirect_uri from API on session authParams", async () => {
    buildSessionModel(req);

    const data = {
      redirect_uri: "https://client.example.com",
      state: "TEST"
    };

    const resolvedPromise = new Promise((resolve) => resolve({ data }));
    req.axios.post = sandbox.stub().returns(resolvedPromise);

    await validate.saveValues(req, res, next);

    sandbox.assert.calledWith(
      req.axios.post,
      sinon.match("check-passport"),
      {
        passportNumber: "123456789",
        surname: "Jones Smith",
        forenames: ["Dan"],
        dateOfBirth: "10/02/1975",
        expiryDate: "15/01/2035"
      },
      {
        headers: {
          session_id: SESSION_ID
        }
      }
    );

    expect(req.session.authParams.redirect_uri).to.eq(
      "https://client.example.com"
    );
  });

  it("should concat firstName and middleNames into forenames", async () => {
    buildSessionModel(req);
    req.sessionModel.set("middleNames", "Joe");

    const data = {
      redirect_uri: "https://client.example.com",
      state: "TEST"
    };

    const resolvedPromise = new Promise((resolve) => resolve({ data }));
    req.axios.post = sandbox.stub().returns(resolvedPromise);

    await validate.saveValues(req, res, next);

    sandbox.assert.calledWith(
      req.axios.post,
      sinon.match("check-passport"),
      {
        passportNumber: "123456789",
        surname: "Jones Smith",
        forenames: ["Dan", "Joe"],
        dateOfBirth: "10/02/1975",
        expiryDate: "15/01/2035"
      },
      {
        headers: {
          session_id: SESSION_ID
        }
      }
    );

    expect(req.session.authParams.redirect_uri).to.eq(
      "https://client.example.com"
    );
  });

  it("should forward errors to the callback", async () => {
    buildSessionModel(req);

    const axiosError = new Error("self-destruct sequence initiated");
    axiosError.stack =
      "Error: self-destruct sequence initiated\n    at validate (test)"; // reduce noisy test output
    req.axios.post = sandbox.stub().rejects(axiosError);

    await validate.saveValues(req, res, next);

    expect(next).to.have.been.calledOnceWithExactly(axiosError);
  });

  it("should set showRetryMessage to true when api returns retry result", async () => {
    buildSessionModel(req);

    const data = {
      result: "retry"
    };

    const resolvedPromise = new Promise((resolve) => resolve({ data }));
    req.axios.post = sandbox.stub().returns(resolvedPromise);

    await validate.saveValues(req, res, next);

    const showRetryMessage = req.sessionModel.get("showRetryMessage");
    expect(showRetryMessage).to.equal(true);
    expect(next).to.have.been.calledOnce;
  });

  it("should call callback if retry not set", async () => {
    buildSessionModel(req);
    req.sessionModel.set("middleNames", "Joe");

    const data = {
      redirect_uri: "http://example.com",
      state: "test-state"
    };

    const resolvedPromise = new Promise((resolve) => resolve({ data }));
    req.axios.post = sandbox.stub().returns(resolvedPromise);
    await validate.saveValues(req, res, next);

    const showRetryMessage = req.sessionModel.get("showRetryMessage");
    expect(showRetryMessage).to.equal(undefined);
    expect(next).to.have.been.calledOnce;
  });
});
