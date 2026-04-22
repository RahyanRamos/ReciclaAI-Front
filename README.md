# ReciclaAI - Front (Base Programacao Web 2)

Sistema base em NestJS para administracao de reciclagens, seguindo a arquitetura tecnica do projeto exemplo com EJS + layout global e TypeORM + MySQL.

## Pre-requisitos

- Node.js 20+
- npm 10+
- MySQL 8+

## Instalacao

```bash
npm install
```

## Configuracao `.env`

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

2. Preencha:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=reciclaai_front
DB_SYNCHRONIZE=false
DB_LOGGING=false
PORT=3000
```

## Como rodar

```bash
npm run start:dev
```

Aplicacao: `http://localhost:3000`

## Rotas disponiveis

- `GET /` dashboard administrativo
- `GET /sobre` informacoes do sistema
- `GET /login` tela de login
- `GET /status` status da aplicacao (JSON)
- `GET /usuarios` administracao de usuarios
- `GET /materiais` catalogo de materiais reciclaveis
- `GET /solicitacoes` solicitacoes de coleta
- `GET /coletas` coletas realizadas
- `GET /equipes` equipes de coleta
- `GET /avaliacoes` avaliacoes das coletas

## Modulos de dominio (baseado no PDF do projeto)

- Usuarios (PF/PJ, cliente, catador, empresa)
- Materiais reciclaveis
- Solicitacoes de coleta
- Coletas realizadas
- Equipes de coleta
- Avaliacoes

## Scripts

- `npm run lint`
- `npm test`
- `npm run test:e2e`
- `npm run build`

## Erros comuns

### 1. Porta em uso

Erro: `EADDRINUSE`

Solucao:
- Alterar `PORT` no `.env`
- Encerrar processo que ocupa a porta

### 2. npm nao encontrado

Erro: `npm is not recognized`

Solucao:
- Reinstalar Node.js com PATH
- Reabrir terminal
- Conferir com `node -v` e `npm -v`

### 3. Tabela inexistente no MySQL

Erro em alguma tela de modulo: tabela nao encontrada (`ER_NO_SUCH_TABLE`)

Solucao:
- Criar schema e tabelas do modulo correspondente (ex.: `coletas`, `materiais`)
- Em ambiente local, usar `DB_SYNCHRONIZE=true` temporariamente para gerar tabelas
- Voltar para `DB_SYNCHRONIZE=false` depois da criacao

## Documentacao passo a passo

- `docs/passo-a-passo/configuracao-banco-dados.md`
- `docs/passo-a-passo/configuracao-helpers.md`
- `docs/passo-a-passo/configuracao-views-e-rotas.md`
