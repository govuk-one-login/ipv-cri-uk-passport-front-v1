const { BeforeAll, AfterAll } = require("@cucumber/cucumber");
const { spawn } = require("node:child_process");
const net = require("node:net");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..", "..");
const MOCK_PORT = 8050;
const APP_PORT = 5050;
const STARTUP_TIMEOUT_MS = 60_000;
const POLL_INTERVAL_MS = 500;

process.env.API_BASE_URL = `http://127.0.0.1:${MOCK_PORT}`;

const processes = [];

const start = (command, args, env = {}) => {
  const child = spawn(command, args, {
    cwd: repoRoot,
    env: { ...process.env, ...env },
    stdio: "inherit",
    detached: true
  });
  processes.push(child);
};

const waitForPort = (port) =>
  new Promise((resolve, reject) => {
    const deadline = Date.now() + STARTUP_TIMEOUT_MS;

    const attempt = () => {
      if (Date.now() > deadline) {
        return reject(new Error(`Timed out waiting for port ${port}`));
      }
      const socket = net.createConnection(port, "127.0.0.1");
      socket.on("connect", () => {
        socket.destroy();
        resolve();
      });
      socket.on("error", () => {
        socket.destroy();
        setTimeout(attempt, POLL_INTERVAL_MS);
      });
    };

    attempt();
  });

BeforeAll({ timeout: STARTUP_TIMEOUT_MS }, async function () {
  start("npx", [
    "wiremock",
    "--port",
    String(MOCK_PORT),
    "--root-dir",
    "test/mocks"
  ]);
  start("node", ["src/app.js"], {
    NODE_ENV: "development",
    MAY_2025_REBRAND_ENABLED: "true",
    DEVICE_INTELLIGENCE_ENABLED: "true",
    USE_PINO_LOGGER: "true"
  });

  await Promise.all([waitForPort(MOCK_PORT), waitForPort(APP_PORT)]);
});

const stop = () => {
  while (processes.length > 0) {
    const child = processes.pop();
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch {
      // already exited
    }
  }
};

process.on("exit", stop);
process.on("SIGINT", () => process.exit(130));
process.on("SIGTERM", () => process.exit(143));

AfterAll(stop);
