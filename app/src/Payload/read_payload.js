const fs = require("fs");
const path = require("path");

function readPayload(file_) {
  const rootPath = path.resolve(__dirname, "..");
  const filePath = path.join(rootPath, "/ressources/payloads/" + file_);

  try {
    const data = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(data);

    return jsonData;
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error("Arquivo não encontrado:", err.message);
    } else if (err instanceof SyntaxError) {
      console.error("Erro de sintaxe no JSON:", err.message);
    } else {
      console.error("Erro ao ler o arquivo:", err.message);
    }
    return null;
  }
}

module.exports = readPayload;
