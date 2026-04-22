# Passo a passo: views com layout EJS e rotas do ReciclaAI

## 1. Estrutura de views

```text
views/
  layouts/
    main.ejs
    partials/
      nav-header.ejs
      header.ejs
      sidebar.ejs
      footer.ejs
      preloader.ejs
  autenticacao/login.ejs
  inicial.ejs
  _sobre.ejs
  usuario/inicial.ejs
  material/inicial.ejs
  solicitacao/inicial.ejs
  coleta/inicial.ejs
  equipe/inicial.ejs
  avaliacao/inicial.ejs
```

## 2. Layout global

No `main.ts`:

```ts
app.setBaseViewsDir(join(__dirname, '..', 'views'));
app.setViewEngine('ejs');
app.use(expressEjsLayouts);
app.set('layout', 'layouts/main');
```

## 3. Rotas

- `GET /`
- `GET /sobre`
- `GET /login`
- `GET /status`
- `GET /usuarios`
- `GET /materiais`
- `GET /solicitacoes`
- `GET /coletas`
- `GET /equipes`
- `GET /avaliacoes`

## 4. Padrao dos controllers

Cada controller de modulo:

- chama o service para listar registros
- renderiza a view `modulo/inicial`
- envia flags para tratar banco indisponivel/tabela inexistente

## 5. Beneficios

- Padrao unico de navegacao
- Estrutura modular pronta para CRUD completo
- Facil extensao para futuras telas do projeto
