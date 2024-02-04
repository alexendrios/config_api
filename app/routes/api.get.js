const { logger_ } = require("../lib/traceLog");

module.exports = [
  {
    method: "GET",
    path: "/",
    handler: (request, h) => {
      logger_(request);
      return {
        message: "API JWT no AR",
        company: "ITAU",
        description: "Desafio QA",
      };
    },
  },

  {
    method: "*",
    path: "/{any*}",
    handler: (request, h) => {
      logger_(request);
      return h.response({ message: "Rota não encontrada" }).code(404);
    },
  },
];
