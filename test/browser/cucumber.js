require("dotenv").config();
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");

const DEFAULT_TIMEOUT = 60 * 1000;
const PROGRESS = "progress";

const commonSupport = ["./test/browser/support/**/*.js"];
const commonWiremockSteps = [
  "./test/browser/step_definitions/wiremock_steps/**/*.js"
];
const commonStubSteps = ["./test/browser/step_definitions/stub_steps/**/*.js"];

const makeReportPath = (name) =>
  path.relative(process.cwd(), path.join(repoRoot, "reports", name));

module.exports = {
  default: {
    paths: [
      "./test/browser/features/wiremock_features/**/*.feature",
      "./test/browser/features/stub_features/**/*.feature"
    ],
    require: [...commonSupport, ...commonWiremockSteps, ...commonStubSteps],
    format: [
      PROGRESS,
      `json:${makeReportPath("cucumber-report.json")}`,
      `html:${makeReportPath("index.html")}`
    ],
    timeout: DEFAULT_TIMEOUT
  },

  stub_tests: {
    paths: ["./test/browser/features/stub_features/**/*.feature"],
    require: [
      "./test/browser/support/setup.js",
      "./test/browser/step_definitions/stub_steps/**/*.js"
    ],
    format: [
      PROGRESS,
      `json:${makeReportPath("cucumber-stub-report.json")}`,
      `html:${makeReportPath("stub-index.html")}`
    ],
    timeout: DEFAULT_TIMEOUT
  },

  wiremock_tests: {
    paths: ["./test/browser/features/wiremock_features/**/*.feature"],
    require: [...commonSupport, ...commonWiremockSteps],
    format: [
      PROGRESS,
      `json:${makeReportPath("cucumber-wiremock-report.json")}`,
      `html:${makeReportPath("wiremock-index.html")}`
    ],
    timeout: DEFAULT_TIMEOUT
  }
};
