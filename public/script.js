const API_URL = "http://localhost:3000/tarefas";
const form = document.getElementById("form-tarefa");
const lista = document.getElementById("lista-tarefas");
let editandoId = null;


const inputData = document.getElementById("data_vencimento");
const hoje = new Date().toISOString().split("T")[0];
inputData.min = hoje;


async function carregarTarefas() {
  const res = await fetch(API_URL);
  const tarefas = await res.json();
  lista.innerHTML = "";
  tarefas.forEach(t => {
    const div = document.createElement("div");
    div.className = `tarefa prioridade-${t.prioridade} ${t.status === 'concluída' ? 'concluida-style' : ''}`;
    
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
  
  const tarefa = {
    titulo: titulo.value,
    descricao: descricao.value,
    data_vencimento: data_vencimento.value,
    prioridade: prioridade.value,
  };
  
  if (editandoId) {
    const resGet = await fetch(`${API_URL}`);
    const tarefas = await resGet.json();
    const tarefaAntiga = tarefas.find(x => x.id === editandoId);
    
    const tarefaAtualizada = {
        ...tarefa,
        status: tarefaAntiga.status
    };
    
    await fetch(`${API_URL}/${editandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tarefaAtualizada)
    });
    editandoId = null;
    
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tarefa)
    });
  }
  form.reset();
  carregarTarefas();
});

async function alternarStatus(id, statusAtual) {
  const novoStatus = (statusAtual === 'concluída') ? 'pendente' : 'concluída';
  
  const resGet = await fetch(`${API_URL}`);
  const tarefas = await resGet.json();
  const tarefaAtual = tarefas.find(t => t.id === id);

  const tarefaAtualizada = {
    titulo: tarefaAtual.titulo,
    descricao: tarefaAtual.descricao,
    data_vencimento: tarefaAtual.data_vencimento,
    prioridade: tarefaAtual.prioridade,
    status: novoStatus
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
  
  titulo.value = t.titulo;
  descricao.value = t.descricao;
  data_vencimento.value = t.data_vencimento;
  prioridade.value = t.prioridade;
  
  editandoId = id;
}

async function excluir(id) {
  if (confirm("Deseja excluir esta tarefa?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    carregarTarefas();
  }
}

window.alternarStatus = alternarStatus;
window.editar = editar;
window.excluir = excluir;

carregarTarefas();
