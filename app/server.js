require("dotenv").config();
const express = require("express");
const whatsapp = require("./whatsapp.js");
const webhookApp = require("./webhook.js");

const PORT = process.env.PORT || 3005;
const app = express();

console.log("🚀 Inicializando cliente WhatsApp...");
whatsapp.startWhatsApp();

// Usa o app do webhook como base
app.use("/", webhookApp);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`\n🌐 Webhook server running on port ${PORT}`);
  console.log(`📡 Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/\n`);
});
