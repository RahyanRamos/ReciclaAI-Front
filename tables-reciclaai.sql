CREATE DATABASE IF NOT EXISTS reciclaai
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE reciclaai;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(140) NOT NULL,
  email VARCHAR(160) NOT NULL,
  tipoPessoa ENUM('PF', 'PJ') NOT NULL DEFAULT 'PF',
  perfil ENUM('CLIENTE', 'CATADOR', 'EMPRESA') NOT NULL DEFAULT 'CLIENTE',
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS materiais (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  categoria VARCHAR(80) NOT NULL,
  unidadeMedida VARCHAR(30) NOT NULL DEFAULT 'kg',
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS solicitacoes_coleta (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(200) NOT NULL,
  localizacao VARCHAR(150) NOT NULL,
  status ENUM('ABERTA', 'AGENDADA', 'CONCLUIDA', 'CANCELADA') NOT NULL DEFAULT 'ABERTA',
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS coletas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  dataColeta DATE NOT NULL,
  status ENUM('PENDENTE', 'EM_ROTA', 'CONCLUIDA', 'CANCELADA') NOT NULL DEFAULT 'PENDENTE',
  observacao TEXT NULL,
  solicitacao_id INT UNSIGNED NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_coletas_solicitacao FOREIGN KEY (solicitacao_id) REFERENCES solicitacoes_coleta (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS solicitacao_materiais (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  solicitacao_id INT UNSIGNED NOT NULL,
  material_id INT UNSIGNED NOT NULL,
  quantidadeEstimada DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  CONSTRAINT fk_solicitacao_materiais_solicitacao FOREIGN KEY (solicitacao_id) REFERENCES solicitacoes_coleta (id) ON DELETE CASCADE,
  CONSTRAINT fk_solicitacao_materiais_material FOREIGN KEY (material_id) REFERENCES materiais (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS coleta_materiais (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  coleta_id INT UNSIGNED NOT NULL,
  material_id INT UNSIGNED NOT NULL,
  quantidadeEstimada DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  CONSTRAINT fk_coleta_materiais_coleta FOREIGN KEY (coleta_id) REFERENCES coletas (id) ON DELETE CASCADE,
  CONSTRAINT fk_coleta_materiais_material FOREIGN KEY (material_id) REFERENCES materiais (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS equipes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  empresaResponsavel VARCHAR(140) NOT NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS avaliacoes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nota TINYINT NOT NULL,
  comentario VARCHAR(250) NULL,
  dataAvaliacao DATE NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- USUARIOS
INSERT INTO usuarios (nome, email, tipoPessoa, perfil, ativo, criado_em, atualizado_em) VALUES
('Ana Souza', 'ana.souza@reciclaai.com', 'PF', 'CLIENTE', 1, NOW(), NOW()),
('Carlos Lima', 'carlos.lima@reciclaai.com', 'PF', 'CATADOR', 1, NOW(), NOW()),
('Coop Verde Norte', 'contato@coopverdenorte.com', 'PJ', 'EMPRESA', 1, NOW(), NOW()),
('Marina Alves', 'marina.alves@reciclaai.com', 'PF', 'CLIENTE', 1, NOW(), NOW()),
('Joao Mendes', 'joao.mendes@reciclaai.com', 'PF', 'CATADOR', 0, NOW(), NOW());

-- MATERIAIS
INSERT INTO materiais (nome, categoria, unidadeMedida, ativo, criado_em, atualizado_em) VALUES
('Papel branco', 'Papel', 'kg', 1, NOW(), NOW()),
('Plastico PET', 'Plastico', 'kg', 1, NOW(), NOW()),
('Lata de aluminio', 'Metal', 'kg', 1, NOW(), NOW()),
('Vidro transparente', 'Vidro', 'kg', 1, NOW(), NOW()),
('Eletronicos pequenos', 'Eletronico', 'un', 1, NOW(), NOW());

-- SOLICITACOES DE COLETA
INSERT INTO solicitacoes_coleta (descricao, localizacao, status, criado_em, atualizado_em) VALUES
('Coleta residencial de papel e plastico', 'Rua das Flores, 120 - Ji-Parana', 'ABERTA', NOW(), NOW()),
('Material reciclavel de escritorio', 'Av. Marechal, 980 - Ji-Parana', 'AGENDADA', NOW(), NOW()),
('Coleta mensal condominio bloco A', 'Rua Amazonas, 450 - Ji-Parana', 'CONCLUIDA', NOW(), NOW()),
('Retirada de latas e vidros', 'Rua T-15, 210 - Ji-Parana', 'CANCELADA', NOW(), NOW()),
('Descarte de caixas de papelao', 'Av. Brasil, 3300 - Ji-Parana', 'ABERTA', NOW(), NOW());

-- MATERIAIS DA SOLICITACAO
INSERT INTO solicitacao_materiais (solicitacao_id, material_id, quantidadeEstimada) VALUES
(1, 1, 7.50),
(1, 2, 5.00),
(2, 1, 35.00),
(3, 3, 20.00),
(3, 4, 28.75),
(4, 3, 10.00),
(4, 4, 12.00),
(5, 1, 18.30);

-- COLETAS
INSERT INTO coletas (dataColeta, status, observacao, solicitacao_id, criado_em, atualizado_em) VALUES
('2026-04-15', 'CONCLUIDA', 'Coleta finalizada sem ocorrencias', 3, NOW(), NOW()),
('2026-04-16', 'CONCLUIDA', 'Volume abaixo do estimado', NULL, NOW(), NOW()),
('2026-04-17', 'CANCELADA', 'Cliente nao estava no local', 4, NOW(), NOW()),
('2026-04-19', 'EM_ROTA', 'Equipe em deslocamento', 2, NOW(), NOW()),
('2026-04-21', 'PENDENTE', 'Aguardando confirmacao da equipe', NULL, NOW(), NOW());

-- MATERIAIS DA COLETA
INSERT INTO coleta_materiais (coleta_id, material_id, quantidadeEstimada) VALUES
(1, 3, 20.00),
(1, 4, 28.75),
(3, 3, 10.00),
(3, 4, 12.00),
(4, 1, 35.00);

-- EQUIPES
INSERT INTO equipes (nome, empresaResponsavel, ativo, criado_em, atualizado_em) VALUES
('Equipe Centro', 'Coop Verde Norte', 1, NOW(), NOW()),
('Equipe Bairro Novo', 'EcoColeta LTDA', 1, NOW(), NOW()),
('Equipe Industrial', 'Recicla Ji-Parana', 1, NOW(), NOW()),
('Equipe Norte', 'Coop Verde Norte', 0, NOW(), NOW()),
('Equipe Sul', 'EcoColeta LTDA', 1, NOW(), NOW());

-- AVALIACOES
INSERT INTO avaliacoes (nota, comentario, dataAvaliacao, criado_em, atualizado_em) VALUES
(5, 'Atendimento excelente e rapido.', '2026-04-15', NOW(), NOW()),
(4, 'Equipe educada e pontual.', '2026-04-16', NOW(), NOW()),
(3, 'Servico bom, mas atrasou um pouco.', '2026-04-17', NOW(), NOW()),
(2, 'Nao houve coleta no horario combinado.', '2026-04-18', NOW(), NOW()),
(5, 'Processo muito organizado.', '2026-04-20', NOW(), NOW());
