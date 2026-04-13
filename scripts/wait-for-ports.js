#!/usr/bin/env node
// simple script to replace 'wait-on' dependency
// usage: node scripts/wait-for-ports.js host:port [host:port ...]

const net = require("node:net");

const POLL_INTERVAL_MS = 500;
const TIMEOUT_MS = 60_000;

function awaitHostPort(host, port) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + TIMEOUT_MS;

    function attempt() {
      if (Date.now() > deadline) {
        return reject(new Error(`Timed out waiting for ${host}:${port}`));
      }
      const socket = net.createConnection(port, host);
      socket.on("connect", () => {
        socket.destroy();
        console.log(`ready: ${host}:${port}`);
        resolve();
      });
      socket.on("error", () => {
        socket.destroy();
        setTimeout(attempt, POLL_INTERVAL_MS);
      });
    }

    attempt();
  });
}

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error("usage: node scripts/wait-for-ports.js host:port [host:port ...]");
  process.exit(1);
}

Promise.all(
  targets.map((address) => {
    const lastColon = address.lastIndexOf(":");
    const host = address.slice(0, lastColon);
    const port = Number(address.slice(lastColon + 1));
    return awaitHostPort(host, port);
  }),
).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
