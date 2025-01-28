require("express");
require("express-async-errors");
const { PORT } = require("./lib/config");
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

AppSetup.init(app, router);
RoutingService.init(router);

/* Server configuration */
const server = app.listen(PORT);

// AWS recommends the keep-alive duration of the target is longer than the idle timeout value of the load balancer (default 60s)
// to prevent possible 502 errors where the target connection has already been closed
// https://docs.aws.amazon.com/elast
server.keepAliveTimeout = 65000;

// Handles graceful shutdown of the NODE service, so that if the container is killed by a SIGTERM, it finishes processing existing connections before the server shuts down.
process.on("SIGTERM", () => {
  // eslint-disable-next-line no-console
  console.log("SIGTERM signal received: closing HTTP server");

  server.close((err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(
        `Error while calling server.close() occurred: ${err.message}`
      );
      process.exit(-1);
    } else {
      // eslint-disable-next-line no-console
      console.log("HTTP server closed");
      process.exit(0);
    }
  });
});
