const {
  SESSION_TABLE_NAME,
  SESSION_SECRET,
  SESSION_TTL
} = require("./lib/config");

const dynamoSessionConfig = require("./dynamo-session-config");

const init = () => {
  const sessionConfig = {
    cookieName: "service_session",
    secret: SESSION_SECRET,
    cookieOptions: { maxAge: SESSION_TTL },
    ...(SESSION_TABLE_NAME && {
      sessionStore: dynamoSessionConfig.createSessionStore()
    })
  };

  return sessionConfig;
};

const isDynamo = () => {
  return !!SESSION_TABLE_NAME;
};

module.exports = { init, isDynamo };
