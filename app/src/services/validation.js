module.exports.validatePayload = (payload) => {
  try {
    // Verifica se há exatamente 3 claims
    if (Object.keys(payload).length !== 3) {
      throw new Error("O payload deve conter exatamente 3 propriedades.");
    }

    // Verifica a propriedade 'Name'
    if (typeof payload.Name !== "string" || /\d/.test(payload.Name)) {
      throw new Error(
        "A propriedade Name não pode conter caracteres numéricos."
      );
    }

    // Verifica a propriedade 'Role'
    const allowedRoles = ["Admin", "Member", "External"];
    if (!allowedRoles.includes(payload.Role)) {
      throw new Error(
        "A propriedade Role deve conter um dos valores: Admin, Member ou External."
      );
    }

    // Verifica a propriedade 'Seed'
    const seedAsNumber = parseInt(payload.Seed);
    if (isNaN(seedAsNumber) || !isPrime(seedAsNumber)) {
      throw new Error("A propriedade Seed deve ser um número primo.");
    }

    // Verifica o tamanho máximo da propriedade 'Name'
    if (payload.Name.length > 256) {
      throw new Error(
        "O tamanho máximo da propriedade Name é de 256 caracteres."
      );
    }

    return null;
  } catch (error) {
    return error.message;
  }
};

const isPrime = (num) => {
  for (let i = 2; i < num; i++) {
    if (num % i === 0) return false;
  }
  return num > 1;
}
