// BEGIN-NOSCAN
//Integration test to test hmpo form wizard middleware needs investigation
//require("express");
//require("express-async-errors");
//const { setup } = require("hmpo-app");
//
//const RoutingService = require("./router");
//const AppSetup = require("./app-setup");
//const sessionConfig = require("./session-config");
//
//const chai = require("chai");
//const chaiHttp = require("chai-http");
//
//// Configure chai
//chai.use(chaiHttp);
//chai.should();
//
//describe("router-setup", () => {
//  const sandbox = sinon.createSandbox();
//
//  beforeEach(() => {
//    sandbox.stub(sessionConfig, "init").returns({});
//    sandbox.stub(sessionConfig, "isDynamo").returns(false);
//  });
//
//  afterEach(() => {
//    sandbox.restore();
//  });
//
//  describe("setup router", () => {
//    it("should check router can access GTM fields", (done) => {
//      const { app, router } = AppSetup.create(setup);
//
//      app.get("nunjucks").addGlobal("getContext", function () {
//        return {
//          keys: Object.keys(this.ctx),
//          ctx: this.ctx.ctx
//        };
//      });
//
//      AppSetup.init(app);
//      RoutingService.init(router);
//
//      var agent = chai.request.agent("http://localhost:5030");
//      agent
//        .get("/oauth2/authorize?request=JWT.value&client_id=ipv-core-test")
//        .end(function (err, res) {
//                  console.log("CHECK 1: "+JSON.stringify(res.locals));
//
//          expect(res).to.have.status(302);
//          expect(res).to.have.cookie('hmpo-wizard-sc');
//          expect(res).to.have.cookie('hmpo.sid');
//
//          done();
//        });
//    });
//  });
//});
// END-NOSCAN
