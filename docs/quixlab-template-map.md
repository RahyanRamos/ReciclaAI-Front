# Mapa do template Quixlab no ReciclaAI

## Origem

- Template adicionado em `quixlab-bootstrap-main/theme`.
- A pasta original fica ignorada pelo Git em `.gitignore`.
- Os assets usados pela aplicacao ficam em `public`, separados por `css`, `js`, `vendor`, `icons` e `images`.

## Estrutura do template

- `css/style.css`: folha principal do Quixlab.
- `js/custom.min.js`: comportamento global do painel.
- `js/quixnav-init.js`: inicializacao do menu lateral usado no ReciclaAI.
- `icons`: bibliotecas de icones do template.
- `images`: logos, avatares e imagens demonstrativas.
- `vendor`: plugins Bootstrap, tabelas, formularios, graficos, calendario, alertas e utilitarios.

## Paginas HTML mapeadas

O template possui 61 paginas HTML de referencia:

- Dashboard: `index.html`, `widgets.html`.
- Layouts: `blank.html`, `layout-blank.html`, `layout-boxed.html`, `layout-compact-nav.html`, `layout-dark.html`, `layout-fixed-header.html`, `layout-fixed-sidebar.html`, `layout-horizontal.html`, `layout-light.html`, `layout-one-column.html`, `layout-two-column.html`, `layout-vertical.html`, `layout-wide.html`.
- Autenticacao e erros: `page-login.html`, `page-register.html`, `page-lock.html`, `page-error-400.html`, `page-error-403.html`, `page-error-404.html`, `page-error-500.html`, `page-error-503.html`.
- Tabelas: `table-basic.html`, `table-datatable.html`.
- Formularios: `form-basic.html`, `form-editor.html`, `form-picker.html`, `form-step.html`, `form-validation.html`.
- UI Bootstrap: `ui-accordion.html`, `ui-alert.html`, `ui-badge.html`, `ui-button.html`, `ui-button-group.html`, `ui-cards.html`, `ui-carousel.html`, `ui-dropdown.html`, `ui-list-group.html`, `ui-media-object.html`, `ui-modal.html`, `ui-pagination.html`, `ui-popover.html`, `ui-progressbar.html`, `ui-tab.html`, `ui-typography.html`.
- Apps e plugins: `app-calender.html`, `app-profile.html`, `email-compose.html`, `email-inbox.html`, `email-read.html`, `uc-nestedable.html`, `uc-noui-slider.html`, `uc-sweetalert.html`, `uc-toastr.html`.
- Graficos: `chart-chartist.html`, `chart-chartjs.html`, `chart-flot.html`, `chart-morris.html`, `chart-peity.html`, `chart-sparkline.html`.

## Mapeamento aplicado no ReciclaAI

- Layout base: `views/layouts/main.ejs` usa `style.css`, `global.min.js`, `quixnav-init.js` e `custom.min.js`.
- Preloader: `views/layouts/partials/preloader.ejs`.
- Header e perfil: `views/layouts/partials/header.ejs`.
- Marca e controle lateral: `views/layouts/partials/nav-header.ejs`.
- Menu lateral: `views/layouts/partials/sidebar.ejs`.
- Breadcrumb/titulo: `views/layouts/partials/page-title.ejs`.
- Alertas de banco/tabela: `views/layouts/partials/database-alerts.ejs`.
- Cards de metricas: `views/layouts/partials/metric-card.ejs`.
- Estado vazio de tabelas: `views/layouts/partials/empty-table-row.ejs`.

## Decisoes de refatoracao

- As telas de listagem passaram a usar cards, tabelas responsivas, badges de status e metricas no topo.
- O dashboard passou a usar widgets do Quixlab e uma tabela de rotas com status.
- A tela de login foi alinhada ao visual de autenticacao do template.
- Scripts de graficos e mapas foram removidos do layout principal porque as telas atuais nao renderizam esses componentes.
- Ajustes especificos do ReciclaAI ficam em `public/css/reciclaai.css`, sem alterar o CSS gerado do template.
