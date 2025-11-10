# Como Enviar Mensagens

## 🚀 Rota Simples para Testes: `POST /send`

Use esta rota para enviar mensagens diretamente sem precisar do formato do Chatwoot.

### URL
```
POST http://localhost:3005/send
```

### Headers
```
Content-Type: application/json
```

### Body (JSON)
```json
{
  "number": "5511999999999",
  "message": "Olá, esta é uma mensagem de teste"
}
```

### Exemplo com cURL
```bash
curl -X POST http://localhost:3005/send \
  -H "Content-Type: application/json" \
  -d '{
    "number": "5511999999999",
    "message": "Olá, esta é uma mensagem de teste"
  }'
```

### Exemplo com JavaScript (fetch)
```javascript
fetch('http://localhost:3005/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    number: '5511999999999',
    message: 'Olá, esta é uma mensagem de teste'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 📡 Rota do Chatwoot: `POST /webhook`

Use esta rota quando o Chatwoot enviar mensagens automaticamente.

### URL
```
POST http://localhost:3005/webhook
```

### Formato esperado (Chatwoot)
```json
{
  "message_type": "outgoing",
  "private": false,
  "content": "Mensagem a ser enviada",
  "conversation": {
    "meta": {
      "sender": {
        "phone_number": "+5511999999999"
      }
    }
  }
}
```

### Campos obrigatórios:
- `message_type`: deve ser `"outgoing"`
- `content`: texto da mensagem
- `conversation.meta.sender.phone_number`: número do WhatsApp (com ou sem +)

---

## 📝 Formato do Número

O número pode ser enviado com ou sem formatação:
- `5511999999999` ✅
- `+5511999999999` ✅
- `55 11 99999-9999` ✅ (espaços serão removidos)

O código automaticamente formata para: `5511999999999@c.us`

---

## ✅ Resposta de Sucesso

```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso",
  "sent_to": "5511999999999@c.us"
}
```

## ❌ Resposta de Erro

```json
{
  "error": "Mensagem de erro aqui"
}
```

