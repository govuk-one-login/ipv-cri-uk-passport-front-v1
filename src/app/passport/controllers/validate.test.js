const BaseController = require("hmpo-form-wizard").Controller;
const ValidateController = require("./validate");

const SESSION_ID = "passport123";

const checkPassportRequestBody = {
  passportNumber: "123456789",
  surname: "Jones Smith",
  forenames: ["Dan"],
  dateOfBirth: "10/02/1975",
  expiryDate: "15/01/2035"
};

const checkPassportResponseBody = {
  session_id: SESSION_ID,
  redirect_uri: "https://client.example.com",
  state: "some-state"
};

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

  const stubCustomFetch = (responseBody) =>
    sandbox.stub().resolves({ json: async () => responseBody });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    const setup = setupDefaultMocks();
    req = setup.req;
    res = setup.res;
    next = setup.next;

    req.session.tokenId = SESSION_ID;
    req.session.authParams = { client_id: "some-client" };
    buildSessionModel(req);
  });

  afterEach(() => sandbox.restore());

  it("should be an instance of BaseController", () => {
    expect(validate).to.be.an.instanceof(BaseController);
  });

  it("should send passport details to check-passport", async () => {
    req.customFetch = stubCustomFetch(checkPassportResponseBody);
    await validate.saveValues(req, res, next);

    expect(req.customFetch).to.have.been.calledOnceWithExactly(
      "/check-passport",
      {
        method: "POST",
        jsonBody: checkPassportRequestBody,
        headers: { session_id: SESSION_ID },
        timeoutMs: 30_000
      }
    );
  });

  it("should set redirect_uri and state on session authParams", async () => {
    req.customFetch = stubCustomFetch(checkPassportResponseBody);
    await validate.saveValues(req, res, next);

    expect(req.session.authParams.redirect_uri).to.eq(
      "https://client.example.com"
    );
    expect(req.session.authParams.state).to.eq("some-state");
    expect(next).to.have.been.calledOnceWithExactly();
  });

  it("should include first and middle names in forenames sent to check-passport", async () => {
    req.sessionModel.set("middleNames", "Joe");
    req.customFetch = stubCustomFetch(checkPassportResponseBody);
    await validate.saveValues(req, res, next);

    expect(req.customFetch).to.have.been.calledOnceWithExactly(
      "/check-passport",
      {
        method: "POST",
        jsonBody: {
          ...checkPassportRequestBody,
          forenames: ["Dan", "Joe"]
        },
        headers: { session_id: SESSION_ID },
        timeoutMs: 30_000
      }
    );
  });

  it("should forward errors to the callback", async () => {
    const someError = new Error("self-destruct sequence initiated");
    someError.stack =
      "Error: self-destruct sequence initiated\n    at validate (test)"; // reduce noisy test output

    req.customFetch = sandbox.stub().rejects(someError);
    await validate.saveValues(req, res, next);

    expect(next).to.have.been.calledOnceWithExactly(someError);
  });

  it("should set showRetryMessage to true when check-passport returns retry result", async () => {
    const apiRetryResponse = {
      result: "retry"
    };
    req.customFetch = stubCustomFetch(apiRetryResponse);
    await validate.saveValues(req, res, next);

    expect(req.sessionModel.get("showRetryMessage")).to.be.true;
    expect(next).to.have.been.calledOnceWithExactly();
  });

  it("should not set showRetryMessage when check-passport does not return retry result", async () => {
    req.customFetch = stubCustomFetch(checkPassportResponseBody);
    await validate.saveValues(req, res, next);

    expect(req.sessionModel.get("showRetryMessage")).to.be.undefined;
    expect(next).to.have.been.calledOnceWithExactly();
  });
});
