const API_URL = "http://localhost:3000/api/v1";
let token = null;

/* Log visual da API no console da interface */
function logApi(data) {
  const consoleBox = document.getElementById("apiConsole");
  consoleBox.textContent = JSON.stringify(data, null, 2);
}

/* Função genérica para requisições HTTP */
async function apiRequest(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  /* Adiciona token JWT no header se existir */
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  /* Adiciona body na requisição se necessário */
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  /* Exibe detalhes completos da requisição e resposta */
  logApi({
    request: {
      url: `${API_URL}${endpoint}`,
      method,
      headers: options.headers,
      body,
    },
    response: {
      status: response.status,
      ok: response.ok,
      data,
    },
  });

  return data;
}

/* Registrar novo usuário */
async function register() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  await apiRequest("/auth/register", "POST", {
    name,
    email,
    password,
  });
}

/* Realizar login e armazenar token */
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const data = await apiRequest("/auth/login", "POST", {
    email,
    password,
  });

  if (data?.token) {
    token = data.token;
    document.getElementById("tokenDisplay").textContent = token;
    loadTasks();
  }
}

/* Criar nova tarefa */
async function createTask() {
  const title = document.getElementById("taskTitle").value;
  if (!title) return;

  await apiRequest("/tasks", "POST", { title });

  document.getElementById("taskTitle").value = "";
  loadTasks();
}

/* Buscar e renderizar tarefas do usuário */
async function loadTasks() {
  if (!token) return;

  const tasks = await apiRequest("/tasks", "GET");

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  if (!Array.isArray(tasks)) return;

  tasks.forEach(task => {
    const li = document.createElement("li");

    const titleSpan = document.createElement("span");
    titleSpan.textContent = task.title;
    titleSpan.style.marginRight = "10px";

    /* Marca visualmente tarefas concluídas */
    if (task.completed) {
      titleSpan.style.textDecoration = "line-through";
    }

    /* Botão para alternar status (PUT) */
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = task.completed ? "Desmarcar" : "Concluir";
    toggleBtn.style.marginRight = "5px";

    toggleBtn.addEventListener("click", async () => {
      await updateTask(task.id, {
        completed: !task.completed,
      });
    });

    /* Botão para remover tarefa (DELETE) */
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Excluir";
    deleteBtn.style.backgroundColor = "red";
    deleteBtn.style.color = "white";

    deleteBtn.addEventListener("click", async () => {
      await deleteTask(task.id);
    });

    li.appendChild(titleSpan);
    li.appendChild(toggleBtn);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}

/* Atualizar tarefa existente */
async function updateTask(taskId, updatedData) {
  await apiRequest(`/tasks/${taskId}`, "PUT", updatedData);
  loadTasks();
}

/* Deletar tarefa */
async function deleteTask(taskId) {
  await apiRequest(`/tasks/${taskId}`, "DELETE");
  loadTasks();
}

/* Event listeners (compatível com CSP do Helmet) */
document.getElementById("registerBtn")
  .addEventListener("click", register);

document.getElementById("loginBtn")
  .addEventListener("click", login);

document.getElementById("createTaskBtn")
  .addEventListener("click", createTask);
