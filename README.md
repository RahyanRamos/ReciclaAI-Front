# ReciclaAI - Front (Base Programacao Web 2)

# Integrantes:

Rafael Angelo Darold
Rahyan Ramos de Oliveira

# ReciclaAI — Sistema de Gerenciamento de Coleta de Recicláveis

O ReciclaAI é uma aplicação web desenvolvida como projeto acadêmico da disciplina de Programação Web 2. O sistema tem como objetivo centralizar e organizar todo o fluxo de coleta de materiais recicláveis, conectando quem solicita a coleta — pessoas físicas ou jurídicas — com os responsáveis por realizá-la, sejam catadores autônomos ou empresas especializadas.

# Objetivo da Aplicação

A plataforma busca digitalizar e tornar mais eficiente o processo de reciclagem urbana, eliminando a informalidade na comunicação entre geradores de resíduos e coletores. Por meio do sistema, um usuário pode registrar uma solicitação de coleta informando os materiais disponíveis, e um catador ou empresa pode aceitar essa solicitação e realizar a coleta. Após a conclusão, o processo pode ser avaliado, gerando um histórico de qualidade do serviço prestado.

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
