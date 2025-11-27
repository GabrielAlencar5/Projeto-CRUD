#  CRUD de Tarefas (Node.js + Express + SQLite)

Este projeto é um sistema simples de **CRUD de tarefas**, desenvolvido com **Node.js**, **Express** e **SQLite**.  
Inclui um backend funcional e pode ser integrado com qualquer frontend (HTML, React, etc.).

---

##  Funcionalidades

- Criar tarefas  
- Listar tarefas  
- Editar tarefas  
- Deletar tarefas  
- Armazena dados localmente em `database.db`  
- API simples e fácil de integrar  

---

##  Tecnologias utilizadas

### **Backend**
- **Node.js** – Ambiente para execução do JavaScript no servidor  
- **Express** – Framework minimalista para criação de APIs  
- **SQLite** – Banco de dados leve e rápido baseado em arquivo  
- **sqlite & sqlite3** – Drivers para manipular o banco  
- **Cors** – Permite comunicação com o frontend  
- **Body-parser** – Interpreta dados JSON enviados nas requisições

---

##  Instalação e Configuração

###  1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/crud-tarefas.git
```

###  2. Entre na pasta do projeto

```bash
cd crud-tarefas
```

###  3. Instale as dependências

```bash
npm install
```

###  4. Estrutura recomendada

```
crud-tarefas/
│── server.js
│── database.db  (gerado automaticamente)
│── package.json
│── public/
│     ├── index.html
│     ├── script.js
│     └── style.css
```

###  5. Execute o servidor

```bash
node server.js
```

Se aparecer:

```
Servidor rodando em http://localhost:3000
```

 Seu backend está funcionando!

---

##  Endpoints da API

###  Listar tarefas
```
GET /tarefas
```

###  Criar tarefa
```
POST /tarefas
Content-Type: application/json

{
  "titulo": "Estudar Node.js",
  "descricao": "Praticar CRUD",
  "data_vencimento": "2025-01-20",
  "prioridade": "alta",
  "status": "pendente"
}
```

###  Atualizar tarefa
```
PUT /tarefas/:id
```

###  Remover tarefa
```
DELETE /tarefas/:id
```

---

##  Exemplos de Uso

###  Testando no navegador
```
http://localhost:3000/tarefas
```

###  Testando com cURL
```bash
curl -X GET http://localhost:3000/tarefas
```

### Testando com Postman / Insomnia
- Crie requisições GET, POST, PUT e DELETE apontando para  
  `http://localhost:3000/tarefas`

---

## Sobre o projeto
Este é um projeto simples e didático, ideal para aprendizado de:
- APIs REST
- Banco de dados SQLite
- Node.js e Express
- Integração frontend-backend

---

## Licença
Este projeto é de uso livre para fins educativos.

---

Feito com por Gabriel.
