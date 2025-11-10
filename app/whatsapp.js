const { Client, LocalAuth } = require("whatsapp-web.js");
const QRCode = require("qrcode"); // 👈 novo pacote para gerar imagem legível

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
  client.on("qr", async (qr) => {
    console.clear();
    console.log("📲 Escaneie o QR code com o WhatsApp do seu celular:");

    // Gera uma URL base64 que pode ser aberta no navegador
    const qrUrl = await QRCode.toDataURL(qr);
    console.log("\n👉 Copie e cole o link abaixo no seu navegador:\n");
    console.log(qrUrl);
    console.log("\nEle exibirá o QR Code para escanear.\n");
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
