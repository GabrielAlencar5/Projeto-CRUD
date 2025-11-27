import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = await open({
  filename: "./backend/database.db",
  driver: sqlite3.Database
});

await db.exec(`
CREATE TABLE IF NOT EXISTS tarefas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  data_vencimento TEXT,
  prioridade TEXT CHECK(prioridade IN ('baixa','média','alta')),
  status TEXT CHECK(status IN ('pendente','em andamento','concluída')) DEFAULT 'pendente'
)
`);

app.get("/tarefas", async (req, res) => {
  const tarefas = await db.all("SELECT * FROM tarefas");
  res.json(tarefas);
});

app.post("/tarefas", async (req, res) => {
  const { titulo, descricao, data_vencimento, prioridade, status } = req.body;
  await db.run(
    "INSERT INTO tarefas (titulo, descricao, data_vencimento, prioridade, status) VALUES (?, ?, ?, ?, ?)",
    [titulo, descricao, data_vencimento, prioridade, status || "pendente"]
  );
  res.json({ message: "Tarefa criada" });
});

app.put("/tarefas/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, data_vencimento, prioridade, status } = req.body;
  await db.run(
    "UPDATE tarefas SET titulo=?, descricao=?, data_vencimento=?, prioridade=?, status=? WHERE id=?",
    [titulo, descricao, data_vencimento, prioridade, status, id]
  );
  res.json({ message: "Tarefa atualizada" });
});

app.delete("/tarefas/:id", async (req, res) => {
  const { id } = req.params;
  await db.run("DELETE FROM tarefas WHERE id=?", [id]);
  res.json({ message: "Tarefa removida" });
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
