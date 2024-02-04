const logger = require("./logger");
const { format } = require("date-fns");
const { configureOpenTelemetry } = require("./trace");
configureOpenTelemetry();

let startTime;
let formattedStartTime;

let data = () => {
  startTime = Date.now();
  formattedStartTime = format(startTime, "dd/MM/yyyy - HH:mm:ss");
  return formattedStartTime;
};

const logger_ = (request) => {
  const ip = request.headers["x-forwarded-for"] || request.info.remoteAddress;
  logger.info(
    `"Date": ${data()}, "Endpoint": ${request.url.pathname} , "Request": ${
      request.method
    }, "IP": ${ip}`
  );
};

const logger_generica = (processo) => {
  logger.info(`"Date": ${data()}, "Processo": ${processo}`);
};

const logger_war = (request, validationError, obs) => {
  const ip = request.headers["x-forwarded-for"] || request.info.remoteAddress;
  logger.warn(
    `"Date": ${data()}, "Endpoint": ${request.url.pathname} , "Request": ${
      request.method
    }, "${obs}": ${validationError}, "IP": ${ip}`
  );
};

const logger_espcifica = (request, obs) => {
  const ip = request.headers["x-forwarded-for"] || request.info.remoteAddress;
  logger.warn(
    `"Date": ${data()}, "Endpoint": ${request.url.pathname} , "Request": ${
      request.method
    }, "${obs}", "IP": ${ip}`
  );
};

const logger_err = (request, validationError) => {
  const ip = request.headers["x-forwarded-for"] || request.info.remoteAddress;
  logger.error(
    `"Date": ${data()}, "Endpoint": ${request.url.pathname} , "Request": ${
      request.method
    }, "Erro inesperado": ${validationError}, "IP": ${ip}`
  );
};

module.exports = {
  logger_,
  data,
  logger_war,
  logger_err,
  logger_generica,
  logger_espcifica,
};
