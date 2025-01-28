const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("overloadProtection", () => {
  let protectStub, loggerStub, routerStub, overloadProtection;

  beforeEach(() => {
    protectStub = sinon.stub();
    loggerStub = { info: sinon.stub() };
    routerStub = { use: sinon.stub() };

    overloadProtection = proxyquire("./overloadProtection", {
      "hmpo-logger": { get: () => loggerStub },
      "express/lib/router": routerStub,
      "overload-protection": () => protectStub
    });
  });

  it("should enable overload protection and log info", () => {
    protectStub.returns(true);
    const req = {};
    const res = {};
    const next = sinon.stub();

    overloadProtection(req, res, next);

    expect(routerStub.use.calledWith(protectStub)).to.be.true;
    expect(loggerStub.info.calledWith("Overload protection enabled")).to.be
      .true;
    expect(next.called).to.be.false;
  });

  it("should call next middleware if protection is not enabled", () => {
    protectStub.returns(false);
    const req = {};
    const res = {};
    const next = sinon.stub();

    overloadProtection(req, res, next);

    expect(routerStub.use.called).to.be.false;
    expect(loggerStub.info.called).to.be.false;
    expect(next.called).to.be.true;
  });

  it("should call next with error if an exception is thrown", () => {
    const error = new Error("Test error");
    protectStub.throws(error);
    const req = {};
    const res = {};
    const next = sinon.stub();

    overloadProtection(req, res, next);

    expect(next.calledWith(error)).to.be.true;
  });
});
