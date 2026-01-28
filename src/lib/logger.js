import pino from "pino";

export const get = (label) => {
  return pino({
    name: ":ipv-cri-f2f-front",
    level: process.env.LOGS_LEVEL ?? "info",
    messageKey: "message", // rename default msg property to message,
    label,
    formatters: {
      level(label) {
        return { level: label.toUpperCase() };
      }
    }
  });
};
