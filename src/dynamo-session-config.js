const { SESSION_TABLE_NAME } = require("./lib/config");

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const session = require("express-session");
const DynamoDBStore = require("connect-dynamodb")(session);

const createSessionStore = () => {
  const dynamodbClient = new DynamoDBClient({
    region: "eu-west-2"
  });

  const dynamoDBSessionStore = new DynamoDBStore({
    client: dynamodbClient,
    table: SESSION_TABLE_NAME
  });

  return dynamoDBSessionStore;
};

module.exports = { createSessionStore };
