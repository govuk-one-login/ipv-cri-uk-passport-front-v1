require("express");
require("express-async-errors");
const { setup } = require("hmpo-app");
const addLanguageParam = require("@govuk-one-login/frontend-language-toggle/build/cjs/language-param-setter.cjs");

const RoutingService = require("./router");
const AppSetup = require("./app-setup");

const { app, router } = AppSetup.create(setup);
app.get("nunjucks").addGlobal("getContext", function () {
  return {
    keys: Object.keys(this.ctx),
    ctx: this.ctx.ctx
  };
});

app.get("nunjucks").addGlobal("addLanguageParam", addLanguageParam);
console.log("test");

AppSetup.init(app, router);
RoutingService.init(router);
