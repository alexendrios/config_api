const read = require("../../app/src/Payload/read_payload");
const fs = require("fs");

let resultado;

// Simulando o fs.readFileSync
jest.mock("fs");

describe("Função readPayload", () => {
  test("Deve ler e analisar corretamente um arquivo JSON", () => {
    const mockData = '{"chave": "valor"}';
    fs.readFileSync.mockReturnValueOnce(mockData);
    resultado = read("test.json");
    expect(resultado).toEqual({ chave: "valor" });
  });

  test("Deve lidar com erro na leitura do arquivo", () => {
    fs.readFileSync.mockImplementation(() => {
      throw new Error("Erro simulado do readFileSync");
    });

    resultado = read("inexistente.json");
    expect(resultado).toBeNull();
  });

  test("Deve lidar com erro na análise JSON", () => {
    fs.readFileSync.mockReturnValueOnce("json inválido");
    resultado = read("invalido.json");
    expect(resultado).toBeNull();
  });

  test("deve lidar com erro quando o arquivo não é encontrado", () => {
    // Simula um erro ENOENT (Arquivo não encontrado)
    fs.readFileSync.mockImplementation(() => {
      const error = new Error("Arquivo não encontrado");
      error.code = "ENOENT"; 
      throw error;
    });

    resultado = read("inexistente.json");
    expect(resultado).toBeNull();
  });
});
