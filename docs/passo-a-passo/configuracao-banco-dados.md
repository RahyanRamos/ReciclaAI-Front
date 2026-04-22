# Passo a passo: configuracao de banco de dados (NestJS + MySQL)

## 1. Instalar dependencias

```bash
npm install
```

Pacotes principais:

```bash
npm install typeorm @nestjs/typeorm mysql2 @nestjs/config
```

## 2. Configurar variaveis de ambiente

```bash
cp .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

Conteudo base:

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

## 3. Estrutura de configuracao

- `src/config/constants/database-source.ts`
- `src/config/database/database.providers.ts`
- `src/config/database/database.module.ts`

## 4. Provider de DataSource

O provider:

- Le variaveis `DB_*`
- Cria conexao MySQL via TypeORM `DataSource`
- Inicializa a conexao
- Em caso de falha de conexao, mantem a aplicacao ativa e registra log de erro

## 5. AppModule

`ConfigModule.forRoot({ isGlobal: true })` e `DatabaseModule` devem estar em `imports`.

## 6. Rodar

```bash
npm run start:dev
```

## 7. Observacoes

- `DB_SYNCHRONIZE=false` por padrao
- Ative `DB_LOGGING=true` apenas para diagnostico
