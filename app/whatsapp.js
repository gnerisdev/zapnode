const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

let client;
let ready = false;

function startWhatsApp() {
  client = new Client({
    authStrategy: new LocalAuth({
      clientId: "zapnode-session",
      dataPath: "./.wwebjs_auth"
    }),
    puppeteer: {
      headless: true, // Render não tem interface gráfica
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu"
      ]
    }
  });

  // Quando gerar o QR
  client.on("qr", (qr) => {
    console.clear();
    console.log("📲 Escaneie o QR code com o WhatsApp do seu celular:\n");
    
    // Exibe o QR code diretamente no terminal
    qrcode.generate(qr, { small: true });
    console.log("\n");
  });

  client.on("authenticated", () => {
    console.log("✅ Autenticado com sucesso!");
  });

  client.on("ready", () => {
    ready = true;
    console.log("🎉 WhatsApp pronto para uso!");
  });

  client.on("auth_failure", (msg) => {
    ready = false;
    console.error("❌ Falha de autenticação:", msg);
  });

  client.on("disconnected", (reason) => {
    ready = false;
    console.log("⚠️ Cliente desconectado:", reason);
    console.log("🔄 Tentando reconectar...");
    setTimeout(startWhatsApp, 5000);
  });

  client.initialize().catch(err => {
    console.error("❌ Erro ao inicializar cliente:", err);
  });
}

function getClient() {
  return client;
}

function isReady() {
  return ready;
}

module.exports = { startWhatsApp, getClient, isReady };
