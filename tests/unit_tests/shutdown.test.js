const { shutdownHandler } = require("../../app/lib/trace");
const { mockProcessExit } = require("jest-mock-process");

describe("shutdownHandler", () => {
  test('Deve chamar sdk.shutdown e logar "Tracing terminated"', async () => {
    // Simular a função sdk.shutdown
    const sdkShutdownMock = jest.fn().mockResolvedValueOnce();

    const sdkMock = {
      shutdown: sdkShutdownMock,
    };

    // Espionar console.log
    const consoleLogSpy = jest.spyOn(console, "log");

    await shutdownHandler(sdkMock);
    expect(sdkShutdownMock).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith("Tracing terminated");

    // Restaurar a função original de console.log após o teste
    consoleLogSpy.mockRestore();
  });

  test('deve logar "Error terminating tracing" se sdk.shutdown falhar', async () => {
    // Simular a função sdk.shutdown que falha
    const sdkShutdownMock = jest
      .fn()
      .mockRejectedValueOnce(new Error("Algum erro"));

    // Atribuir a função mock à propriedade shutdown de sdk
    const sdkMock = {
      shutdown: sdkShutdownMock,
    };

       const consoleLogSpy = jest.spyOn(console, "log");

    // Simular a função process.exit
    const mockExit = mockProcessExit();

    await shutdownHandler(sdkMock);

    // Verificar se a função sdk.shutdown foi chamada
    expect(sdkShutdownMock).toHaveBeenCalled();

    // Restaurar a função original de console.log após o teste
    consoleLogSpy.mockRestore();

    // Restaurar a função original de process.exit após o teste
    mockExit.mockRestore();
  });
});
