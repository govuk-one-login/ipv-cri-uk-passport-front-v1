const { SESSION_TABLE_NAME } = require("./lib/config");

const AWS = require("aws-sdk");
const session = require("express-session");
const DynamoDBStore = require("connect-dynamodb")(session);

const createSessionStore = () => {
  AWS.config.update({
    region: "eu-west-2"
  });
  const dynamodb = new AWS.DynamoDB();

  const dynamoDBSessionStore = new DynamoDBStore({
    client: dynamodb,
    table: SESSION_TABLE_NAME
  });

  return dynamoDBSessionStore;
};

module.exports = { createSessionStore };
