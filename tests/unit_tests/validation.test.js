const { validatePayload } = require("../../app/src/services/validation");
const read = require('../../app/src/Payload/read_payload');

describe("Validação do payload", () => {
  let payload;
  let errorMessage;

  test("Caso 1 - JWT, as informações contidas atendem a descrição", () => {
    payload = read("payload_sucesso.json");
    expect(validatePayload(payload)).toBeNull();
  });

  test("Caso 2 - Abrindo o JWT, a Claim Name possui caracter de números", () => {
    payload = read("payload_numero_claim.json");
    errorMessage = validatePayload(payload);
    expect(errorMessage).toEqual(
      "A propriedade Name não pode conter caracteres numéricos."
    );
  });

  test("Caso 3 - Abrindo o JWT, foi encontrado mais de 3 claims", () => {
        payload = read("payload_mais_tres_claim.json");
        errorMessage = validatePayload(payload);
        expect(errorMessage).toEqual(
          "O payload deve conter exatamente 3 propriedades."
        );
  });

  test("Caso 4 - A claim Role deve conter apenas 1 dos três valores (Admin, Member e External)",
    () => {
      payload = read("payload_key_roule_sem_valor.json");
      errorMessage = validatePayload(payload);
      expect(errorMessage).toEqual(
        "A propriedade Role deve conter um dos valores: Admin, Member ou External."
      );
    });

    test("Caso 5 - A claim Seed deve ser um número primo", () => {
       payload = read("payload_claim_seed_numero_nao_primo.json");
       errorMessage = validatePayload(payload);
       expect(errorMessage).toEqual(
        "A propriedade Seed deve ser um número primo."
      );
    });

    test("Caso 6 - O tamanho máximo da claim Name é de 256 caracteres.", () => {
      payload = read("payload_claim_name_caractere_maior_256.json");
      errorMessage = validatePayload(payload);
      expect(errorMessage).toEqual(
        "O tamanho máximo da propriedade Name é de 256 caracteres."
      );
    });
    
});
