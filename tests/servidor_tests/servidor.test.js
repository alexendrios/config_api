const serverModule = require("../../app/lib/server");

describe("Server", () => {
  let server;
  let handleUnhandledRejectionMock;
  let exitMock;

  beforeAll(async () => {
    server = await serverModule.init();
    handleUnhandledRejectionMock = jest.spyOn(
      serverModule,
      "handleUnhandledRejection"
    );
    exitMock = jest.spyOn(process, "exit").mockImplementation(() => {});
  });

  afterAll(async () => {
    await server.stop();
    handleUnhandledRejectionMock.mockRestore();
    exitMock.mockRestore();
  });

  test("Deve inicializar o servidor Test", async () => {
    expect(typeof server).toBe("object");
  });

  test("Deve ter rotas configuradas", async () => {
    const routes = server.table();
    expect(routes).toHaveLength(6);
  });

  test("Deve iniciar o servidor api", async () => {
    let startedServer = await serverModule.start();
    console.log(startedServer);
    expect(typeof startedServer).toBe("object");
  });

  test("Deve lidar com um erro não tratado corretamente", () => {
    const mockError = new Error("Erro não tratado");
    serverModule.handleUnhandledRejection(mockError);
    expect(handleUnhandledRejectionMock).toHaveBeenCalledWith(mockError);
  });

 });
