// IMPORTAÇÕES
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const { v4: uuidv4 } = require("uuid");
const path = require("path");


// CONFIGURAÇÃO INICIAL
const app = express();
const PORT = process.env.PORT || 3000;


// MIDDLEWARES GLOBAIS
app.use(helmet()); // Segurança HTTP
app.use(cors()); // Permitir requisições externas
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // Logs HTTP

// Rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));


// "BANCO DE DADOS" SIMULADO
let users = [];
let tasks = [];


// MIDDLEWARE DE AUTENTICAÇÃO
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "segredo");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido" });
  }
}


// VERSIONAMENTO DE API
const api = express.Router();
app.use("/api/v1", api);



// ROTAS DE AUTENTICAÇÃO

// Registro
api.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "Campos obrigatórios faltando" });

  const userExists = users.find(u => u.email === email);
  if (userExists)
    return res.status(400).json({ error: "Usuário já existe" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date()
  };

  users.push(newUser);

  res.status(201).json({ message: "Usuário criado com sucesso" });
});

// Login
api.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user)
    return res.status(400).json({ error: "Usuário não encontrado" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "Senha incorreta" });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "segredo",
    { expiresIn: "1h" }
  );

  res.json({ token });
});


// CRUD DE TASKS (ROTAS PROTEGIDAS)

// Criar tarefa
api.post("/tasks", authMiddleware, (req, res) => {
  const { title } = req.body;

  const newTask = {
    id: uuidv4(),
    title,
    completed: false,
    userId: req.user.id,
    createdAt: new Date()
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// Listar tarefas do usuário
api.get("/tasks", authMiddleware, (req, res) => {
  const userTasks = tasks.filter(t => t.userId === req.user.id);
  res.json(userTasks);
});

// Atualizar tarefa
api.put("/tasks/:id", authMiddleware, (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);

  if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

  if (task.userId !== req.user.id)
    return res.status(403).json({ error: "Não autorizado" });

  task.title = req.body.title ?? task.title;
  task.completed = req.body.completed ?? task.completed;

  res.json(task);
});

// Deletar tarefa
api.delete("/tasks/:id", authMiddleware, (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);

  if (index === -1)
    return res.status(404).json({ error: "Tarefa não encontrada" });

  tasks.splice(index, 1);

  res.json({ message: "Tarefa removida" });
});


// ROTA DE HEALTH CHECK
api.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});


// MIDDLEWARE GLOBAL DE ERROS
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});


// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
