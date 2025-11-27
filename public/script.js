const API_URL = "http://localhost:3000/tarefas";
const form = document.getElementById("form-tarefa");
const lista = document.getElementById("lista-tarefas");
let editandoId = null;

async function carregarTarefas() {
  const res = await fetch(API_URL);
  const tarefas = await res.json();
  lista.innerHTML = "";
  tarefas.forEach(t => {
    const div = document.createElement("div");
    div.className = `tarefa prioridade-${t.prioridade} ${t.status === 'concluída' ? 'concluida-style' : ''}`;
    
    // O texto do botão muda dependendo do status atual
    const statusButtonText = t.status === 'concluída' ? 'Marcar como Pendente' : 'Marcar como Concluída';

    div.innerHTML = `
      <h3>${t.titulo}</h3>
      <p>${t.descricao || ""}</p>
      <small>Vence em: ${t.data_vencimento || "-"}</small>
      <small>Status: ${t.status}</small>
      <div class="botoes">
        <button class="status-toggle" 
                onclick="alternarStatus(${t.id}, '${t.status}')">
          ${statusButtonText}
        </button>
        <button class="editar" onclick="editar(${t.id})">Editar</button>
        <button class="excluir" onclick="excluir(${t.id})">Excluir</button>
      </div>`;
    lista.appendChild(div);
  });
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  
  // 1. Campos coletados do formulário (status não está mais no HTML)
  const tarefa = {
    titulo: titulo.value,
    descricao: descricao.value,
    data_vencimento: data_vencimento.value,
    prioridade: prioridade.value,
    // Status será definido pelo back-end (sempre 'pendente' na criação)
  };
  
  if (editandoId) {
    // LÓGICA DE EDIÇÃO (PUT)
    
    // O status é sempre 'pendente' na criação. Para a edição, precisamos manter o status atual
    // (pendente ou concluída) a menos que ele seja alterado pelo botão rápido. 
    
    // Para o PUT, fazemos uma requisição GET rápida para obter o status atual antes de atualizar
    const resGet = await fetch(`${API_URL}`);
    const tarefas = await resGet.json();
    const tarefaAntiga = tarefas.find(x => x.id === editandoId);
    
    const tarefaAtualizada = {
        ...tarefa, // Dados do formulário
        status: tarefaAntiga.status // Mantém o status atual do banco de dados
    };
    
    await fetch(`${API_URL}/${editandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tarefaAtualizada)
    });
    editandoId = null;
    
  } else {
    // LÓGICA DE CRIAÇÃO (POST)
    // O status é omitido, o back-end usará o DEFAULT 'pendente'
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tarefa)
    });
  }
  form.reset();
  carregarTarefas();
});

// FUNÇÃO PARA MUDANÇA RÁPIDA DE STATUS
async function alternarStatus(id, statusAtual) {
  const novoStatus = (statusAtual === 'concluída') ? 'pendente' : 'concluída';
  
  // Obtém os dados completos da tarefa antes de atualizar (para manter o título, etc.)
  const resGet = await fetch(`${API_URL}`);
  const tarefas = await resGet.json();
  const tarefaAtual = tarefas.find(t => t.id === id);

  const tarefaAtualizada = {
    titulo: tarefaAtual.titulo,
    descricao: tarefaAtual.descricao,
    data_vencimento: tarefaAtual.data_vencimento,
    prioridade: tarefaAtual.prioridade,
    status: novoStatus // Altera apenas o status
  };
  
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tarefaAtualizada)
  });
  
  carregarTarefas();
}

async function editar(id) {
  const res = await fetch(`${API_URL}`);
  const tarefas = await res.json();
  const t = tarefas.find(x => x.id === id);
  
  // Preenche os campos do formulário (status foi omitido)
  titulo.value = t.titulo;
  descricao.value = t.descricao;
  data_vencimento.value = t.data_vencimento;
  prioridade.value = t.prioridade;
  // O CAMPO status NÃO EXISTE MAIS NO HTML, ENTÃO NÃO É PREENCHIDO
  
  editandoId = id;
}

async function excluir(id) {
  if (confirm("Deseja excluir esta tarefa?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    carregarTarefas();
  }
}

// Expõe a função para ser usada pelo onclick no HTML
window.alternarStatus = alternarStatus;
window.editar = editar;
window.excluir = excluir;


carregarTarefas();