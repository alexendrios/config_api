const Hapi = require("@hapi/hapi");
const logger = require("./logger");
const routes = require("../routes/claims.routes");
const api = require("../routes/api.get");
const { data } = require("../lib/traceLog");
const client = require("prom-client");
const {
  configureOpenTelemetry,
  shutdownHandler,
} = require("./trace"); 

require("dotenv").config();
const serverPort = process.env.PORT || 4000;
const testPort = process.env.TEST_PORT || 5000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 3000 });
configureOpenTelemetry();


const server = Hapi.server({
  port: process.env.NODE_ENV === "test" ? testPort : serverPort,
  host: "0.0.0.0",
  routes: {
    cors: {
      additionalExposedHeaders: ["x-forwarded-for"],
    },
  },
});

server.route(routes);
server.route(api);

class UnhandledRejectionHandler {
  handle(err) {
    logger.error(`"Data": ${data()}, "API": ${err}`);
    process.exit(1);
  }
}

const handler = new UnhandledRejectionHandler();

process.on("unhandledRejection", handler.handle);

const path = require("path");
const fs = require("fs");
const winston = require("winston");

const logDirectory = "logs_Service";

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const fileErrorTransport = new winston.transports.File({
  filename: path.join(logDirectory, "error_service.log"),
  level: "error",
});

const fileCombinedTransport = new winston.transports.File({
  filename: path.join(logDirectory, "service.log"),
});

const customLogger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    fileErrorTransport,
    fileCombinedTransport,
  ],
});

module.exports = {
  init: async () => {
    await server.initialize();
    customLogger.info(
      `"Data": ${data()}, "Testes_Servidor rodando em": ${server.info.uri}`
    );
    return server;
  },
  start: async () => {
    await server.start();
    customLogger.info(
      `"Data": ${data()}, "Servidor_rodando": ${server.info.uri}`
    );
    return server;
  },
  handleUnhandledRejection: handler.handle,
  logger: customLogger,
  shutdownHandler, 
};
