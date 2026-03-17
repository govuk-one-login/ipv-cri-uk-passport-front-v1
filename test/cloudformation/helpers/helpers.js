const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const { expect } = require("chai");

// Cached template data
let template;
let templateContent;
let templateLines;

function loadTemplate() {
  if (!template) {
    const templatePath = path.resolve("./deploy/template.yaml");
    templateContent = fs.readFileSync(templatePath, "utf8");
    templateLines = templateContent.split("\n");

    const cfnSchema = yaml.DEFAULT_SCHEMA.extend([
      new yaml.Type("!Ref", {
        kind: "scalar",
        construct: (data) => ({ Ref: data })
      }),
      new yaml.Type("!GetAtt", {
        kind: "scalar",
        construct: (data) => ({ "Fn::GetAtt": data })
      }),
      new yaml.Type("!Sub", {
        kind: "scalar",
        construct: (data) => ({ "Fn::Sub": data })
      }),
      new yaml.Type("!Sub", {
        kind: "sequence",
        construct: (data) => ({ "Fn::Sub": data })
      }),
      new yaml.Type("!Join", {
        kind: "sequence",
        construct: (data) => ({ "Fn::Join": data })
      }),
      new yaml.Type("!Equals", {
        kind: "sequence",
        construct: (data) => ({ "Fn::Equals": data })
      }),
      new yaml.Type("!If", {
        kind: "sequence",
        construct: (data) => ({ "Fn::If": data })
      }),
      new yaml.Type("!Not", {
        kind: "sequence",
        construct: (data) => ({ "Fn::Not": data })
      }),
      new yaml.Type("!Or", {
        kind: "sequence",
        construct: (data) => ({ "Fn::Or": data })
      }),
      new yaml.Type("!And", {
        kind: "sequence",
        construct: (data) => ({ "Fn::And": data })
      }),
      new yaml.Type("!FindInMap", {
        kind: "sequence",
        construct: (data) => ({ "Fn::FindInMap": data })
      }),
      new yaml.Type("!Select", {
        kind: "sequence",
        construct: (data) => ({ "Fn::Select": data })
      }),
      new yaml.Type("!Split", {
        kind: "sequence",
        construct: (data) => ({ "Fn::Split": data })
      }),
      new yaml.Type("!ImportValue", {
        kind: "scalar",
        construct: (data) => ({ "Fn::ImportValue": data })
      }),
      new yaml.Type("!Base64", {
        kind: "scalar",
        construct: (data) => ({ "Fn::Base64": data })
      }),
      new yaml.Type("!Cidr", {
        kind: "sequence",
        construct: (data) => ({ "Fn::Cidr": data })
      }),
      new yaml.Type("!GetAZs", {
        kind: "scalar",
        construct: (data) => ({ "Fn::GetAZs": data })
      })
    ]);

    template = yaml.load(templateContent, { schema: cfnSchema });
  }
  return { template, templateContent, templateLines };
}

function getResourcesByType(resourceType) {
  const { template } = loadTemplate();
  return Object.entries(template.Resources || {}).filter(
    ([, resource]) => resource.Type === resourceType
  );
}

// Enhanced helper with consistent error handling
function validateResourceProperty(
  resourceType,
  propertyPath,
  validator,
  errorMsg
) {
  const resources = getResourcesByType(resourceType);

  if (resources.length === 0) {
    throw new Error(`No ${resourceType} resources found in template`);
  }

  const failures = [];
  resources.forEach(([name, resource]) => {
    const value = resource.Properties?.[propertyPath];
    if (!validator(value)) {
      const message = errorMsg || `invalid ${propertyPath}`;
      failures.push(`${name} ${message}`);
    }
  });

  if (failures.length > 0) {
    const issuesList = failures.join("\n");
    const errorMessage = `Found ${failures.length} ${resourceType} resource(s) with issues:\n${issuesList}`;
    expect.fail(errorMessage);
  }
}

// Enhanced helper for raw YAML validation
function validateInRawYaml(resourceType, pattern, errorMsg) {
  const resources = getResourcesByType(resourceType);

  if (resources.length === 0) {
    throw new Error(`No ${resourceType} resources found in template`);
  }

  const failures = [];
  resources.forEach(([resourceName]) => {
    if (!findInRawYaml(resourceName, pattern)) {
      failures.push(`${resourceName} ${errorMsg}`);
    }
  });

  if (failures.length > 0) {
    const issuesList = failures.join("\n");
    const errorMessage = `Found ${failures.length} ${resourceType} resource(s) with issues:\n${issuesList}`;
    expect.fail(errorMessage);
  }
}

function findInRawYaml(resourceName, pattern) {
  const { templateContent } = loadTemplate();
  const resourceMatch = new RegExp(`^  ${resourceName}:`, "m");
  const resourceIndex = templateContent.search(resourceMatch);

  if (resourceIndex === -1) return null;

  const afterResource = templateContent.substring(resourceIndex);
  const nextResourceMatch = afterResource.substring(1).search(/^ {2}\w+:/m);
  const resourceSection =
    nextResourceMatch === -1
      ? afterResource
      : afterResource.substring(0, nextResourceMatch + 1);

  return pattern.test(resourceSection);
}

// Test coverage helper
function getAllResourceTypes() {
  const { template } = loadTemplate();
  return [
    ...new Set(Object.values(template.Resources || {}).map((r) => r.Type))
  ];
}

module.exports = {
  loadTemplate,
  getResourcesByType,
  validateResourceProperty,
  validateInRawYaml,
  findInRawYaml,
  getAllResourceTypes,
  // Legacy exports for backward compatibility
  testResourceProperty: validateResourceProperty
};
