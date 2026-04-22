# Passo a passo: configuracao de helpers para EJS

## 1. Estrutura

```text
src/helpers/
  date.helper.ts
  money.helper.ts
  index.ts
```

## 2. Registro global

No `index.ts`, os helpers sao registrados em `app.locals`:

```ts
const helpers: Record<string, unknown> = {
  dateFormat,
  moneyFormat,
};

export const registerHelpers = (app: Application): void => {
  Object.assign(app.locals, helpers);
};
```

## 3. Bootstrap

Em `src/main.ts`:

```ts
registerHelpers(app.getHttpAdapter().getInstance());
```

## 4. Uso nas views

```ejs
<%= dateFormat(coleta.criadoEm) %>
<%= moneyFormat(valor) %>
```

## 5. Resultado

Qualquer view EJS passa a acessar os helpers sem precisar enviar manualmente via controller.
