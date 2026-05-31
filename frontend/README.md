# MedAgenda - Frontend

Interface web do projeto MedAgenda — sistema de agendamento de consultas médicas voltado para idosos e seus familiares.

## Tecnologias

- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui (Radix UI)
- React Router v7

## Execução local

Copie o arquivo de variáveis de ambiente e ajuste conforme necessário:

```bash
cp .env.example .env
```

Instale as dependências e inicie o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Variáveis de ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_URL` | URL base da API backend | `http://localhost:3000` |
