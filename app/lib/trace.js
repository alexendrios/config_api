const opentelemetry = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const { PrometheusExporter } = require("@opentelemetry/exporter-prometheus");
const { ConsoleSpanExporter } = require("@opentelemetry/sdk-trace-base");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");

const configureOpenTelemetry = async () => {
  const traceExporter = new ConsoleSpanExporter();
  const sdk = new opentelemetry.NodeSDK({
    metricReader: new PrometheusExporter({
      port: 9464,
    }),
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "api-jwt",
    }),
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();

  process.on("SIGTERM", () => {
    shutdownHandler(sdk);
  });
};

const shutdownHandler = (sdk) => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error));
};

module.exports = { configureOpenTelemetry, shutdownHandler };
