# 📘 Guia Essencial – Express.js

Este documento resume os principais conceitos para iniciar no desenvolvimento com **Express.js**, entendendo sua estrutura, funcionamento, rotas, middlewares e integração com banco de dados.

---

## 🚀 1. O que é Express

Express é um framework minimalista para Node.js utilizado para construir **APIs e aplicações web no backend**.

### Principais características:
- Simples e minimalista
- Baseado em middleware
- Gerenciamento de rotas
- Fácil integração com bancos de dados
- Muito utilizado para criar APIs REST

---

## ⚙️ 2. Criando um Projeto com Express

### Inicializando o projeto:

```bash
mkdir meu-servidor
cd meu-servidor
npm init -y
npm install express
```

### Criando o servidor básico:

```bash
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
```

Execute com:

```bash
node index.js
```

---

## 🌐 3. Conceito de Rotas

Rotas definem como o servidor responde às requisições do cliente.

### Métodos HTTP principais:

| Método | Uso |
|--------|------|
| GET | Buscar dados |
| POST | Criar dados |
| PUT | Atualizar dados |
| DELETE | Remover dados |

### Exemplos:

```bash
app.get("/usuarios", (req, res) => {
  res.json([{ nome: "João" }]);
});

app.post("/usuarios", (req, res) => {
  res.send("Usuário criado");
});
```

---

## 📦 4. Entendendo Request e Response

Toda rota recebe dois parâmetros principais:

```bash
(req, res)
```

### 🔹 req (request)
Contém informações da requisição:
- req.params → parâmetros da URL
- req.query → query strings
- req.body → corpo da requisição
- req.headers → cabeçalhos

### 🔹 res (response)
Envia a resposta:
- res.send()
- res.json()
- res.status()
- res.redirect()

Exemplo com parâmetros:

```bash
app.get("/usuarios/:id", (req, res) => {
  const id = req.params.id;
  res.send(`Usuário ${id}`);
});
```

---

## 🧱 5. Middlewares

Middleware é uma função que executa antes da resposta final.

Ele pode:
- Modificar req e res
- Encerrar a requisição
- Chamar o próximo middleware com next()

### Middleware global:

```bash
app.use((req, res, next) => {
  console.log("Requisição recebida");
  next();
});
```

### Middleware para JSON:

```bash
app.use(express.json());
```

Sem isso, o `req.body` não funciona.

---

## 🗂️ 6. Organização com Router

Para projetos maiores, usamos o Router para organizar rotas.

```bash
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Lista de produtos");
});

module.exports = router;
```

No arquivo principal:

```bash
const produtosRoutes = require("./routes/produtos");
app.use("/produtos", produtosRoutes);
```

---

## 🗄️ 7. Integração com Banco de Dados

Express não possui banco próprio, mas integra facilmente com:

- MongoDB (Mongoose)
- PostgreSQL
- MySQL
- Prisma ORM
- Sequelize

Exemplo conceitual:

```bash
app.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});
```

---

## 🔐 8. Status HTTP e Tratamento de Erros

Usar os **status HTTP corretos** é fundamental em APIs REST.

### 📌 Principais códigos

| Código | Significado |
|--------|------------|
| 200 | Sucesso |
| 201 | Criado |
| 400 | Requisição inválida |
| 404 | Não encontrado |
| 500 | Erro interno |

---

## 🔹 Exemplo simples

```bash
res.status(200).json({ mensagem: "Sucesso" });
res.status(201).json({ mensagem: "Criado com sucesso" });
res.status(400).json({ erro: "Erro na requisição" });
res.status(404).json({ erro: "Não encontrado" });
res.status(500).json({ erro: "Erro interno do servidor" });
```

---

## 🔹 Tratando erros (async/await)

Forma recomendada:

```bash
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});
```

✔ Sempre retorne o status adequado  
✔ Use `try/catch` para evitar quebrar o servidor  
✔ Padronize as respostas da API

---

## 🌍 9. CORS e Segurança

Para permitir requisições externas:

```bash
npm install cors
```

```bash
const cors = require("cors");
app.use(cors());
```

Outras boas práticas:
- Validação de dados
- Sanitização
- Uso de variáveis de ambiente
- Não expor dados sensíveis

---

## 🧠 10. Estrutura Recomendada de Projeto

```
src/
 ├── routes/
 ├── controllers/
 ├── models/
 ├── middlewares/
 ├── config/
 └── server.js
```

Separação de responsabilidades:
- Routes → Definem endpoints
- Controllers → Lógica da aplicação
- Models → Banco de dados
- Middlewares → Interceptações
- Config → Configurações gerais

---

# 🔄 Fluxo de uma Requisição

Cliente → Rota → Middleware → Controller → Banco → Response

---

# 🧠 Resumo Geral

| Conceito | Função |
|----------|--------|
| Express | Framework backend para Node.js |
| Rotas | Definem endpoints |
| Request | Dados recebidos |
| Response | Resposta enviada |
| Middleware | Interceptador de requisições |
| Router | Organização modular |
| Status HTTP | Padronização de respostas |
| CORS | Permitir acesso externo |

---
