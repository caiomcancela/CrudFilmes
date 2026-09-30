# CineArq

CineArq é uma aplicação web para cadastrar, visualizar, editar e excluir filmes de um catálogo pessoal. O projeto possui uma interface em Angular, uma API REST em Node.js com Express e persistência em PostgreSQL/Supabase.

## Como rodar

É necessário ter Node.js e um banco PostgreSQL configurado. Crie `backend/.env` a partir de `backend/.env.example` e informe a `DATABASE_URL`.

Em um terminal, inicie o backend:

```bash
cd backend
npm install
npm run dev
```

Em outro terminal, inicie o frontend:

```bash
cd frontend
npm install
npm start
```

Acesse `http://localhost:4200`. A API será executada em `http://localhost:3000` por padrão.
