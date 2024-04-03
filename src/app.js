require("express");
require("express-async-errors");
const { setup } = require("hmpo-app");

const RoutingService = require("./router");
const AppSetup = require("./app-setup");

const { app, router } = AppSetup.create(setup);

app.get("nunjucks").addGlobal("getContext", function () {
  return {
    keys: Object.keys(this.ctx),
    ctx: this.ctx.ctx
  };
});

AppSetup.init(app);
RoutingService.init(router);
