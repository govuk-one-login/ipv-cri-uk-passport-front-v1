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
let serverAlreadyExiting = false;
let exitCode = 0;
const MAX_EXIT_WAIT = 30000;
process.on("SIGTERM", () => {
  if (serverAlreadyExiting) {
    // eslint-disable-next-line no-console
    console.log("SIGTERM signal received: Server close already called");
    return;
  }
  serverAlreadyExiting = true;

  // eslint-disable-next-line no-console
  console.log("SIGTERM signal received: closing HTTP server");

  // Stop accepting new connections
  server.close((err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(
        `Error while calling server.close() occurred: ${err.message}`
      );

      exitCode = 1;
    } else {
      // eslint-disable-next-line no-console
      console.log("HTTP server closed");
    }
  });

  // There maybe active timers in the event loop preventing a clean exit.
  // Give remaining active connections some time to compelte
  // Then exit, this also closes any connection with keep-alive set
  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.log(`Waiting ${MAX_EXIT_WAIT}ms for before exiting fully`);

    // Close any active connections that have not closed (KeepAlives/Idle etc)
    server.closeAllConnections();

    // eslint-disable-next-line no-console
    console.log(`Calling process exit ${exitCode}`);
    process.exit(exitCode);
  }, MAX_EXIT_WAIT);
});
