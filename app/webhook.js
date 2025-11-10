const express = require("express");
const bodyParser = require("body-parser");
const { getClient, isReady } = require("./whatsapp.js");

const app = express();
app.use(bodyParser.json());

// ✅ Endpoint de teste
app.get("/", (req, res) => {
  res.json({
    message: "Servidor ativo ✅",
    whatsapp_status: { client_exists: !!getClient(), is_ready: isReady() },
  });
});

// ✅ Endpoint de webhook (exemplo)
app.post("/webhook", async (req, res) => {
  const client = getClient();

  if (!client || !isReady()) {
    return res.status(503).json({
      error: "WhatsApp client não está pronto. Aguarde a conexão.",
      message: "O cliente WhatsApp ainda está inicializando. Aguarde alguns segundos e tente novamente.",
      how_to_check: "Faça uma requisição GET para http://localhost:3005/ para verificar o status",
      status: { client_exists: !!client, is_ready_flag: isReady() },
    });
  }

  const { number, message } = req.body;

  if (!number || !message) {
    return res.status(400).json({ error: "Número e mensagem são obrigatórios." });
  }

  try {
    await client.sendMessage(`${number}@c.us`, message);
    res.json({ success: true, message: "Mensagem enviada com sucesso ✅" });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = app;
