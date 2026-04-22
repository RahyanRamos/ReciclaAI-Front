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
  volumeEstimado DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status ENUM('ABERTA', 'AGENDADA', 'CONCLUIDA', 'CANCELADA') NOT NULL DEFAULT 'ABERTA',
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS coletas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  dataColeta DATE NOT NULL,
  pesoTotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status ENUM('PENDENTE', 'EM_ROTA', 'CONCLUIDA', 'CANCELADA') NOT NULL DEFAULT 'PENDENTE',
  observacao TEXT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
INSERT INTO solicitacoes_coleta (descricao, localizacao, volumeEstimado, status, criado_em, atualizado_em) VALUES
('Coleta residencial de papel e plastico', 'Rua das Flores, 120 - Ji-Parana', 12.50, 'ABERTA', NOW(), NOW()),
('Material reciclavel de escritorio', 'Av. Marechal, 980 - Ji-Parana', 35.00, 'AGENDADA', NOW(), NOW()),
('Coleta mensal condominio bloco A', 'Rua Amazonas, 450 - Ji-Parana', 48.75, 'CONCLUIDA', NOW(), NOW()),
('Retirada de latas e vidros', 'Rua T-15, 210 - Ji-Parana', 22.00, 'CANCELADA', NOW(), NOW()),
('Descarte de caixas de papelao', 'Av. Brasil, 3300 - Ji-Parana', 18.30, 'ABERTA', NOW(), NOW());

-- COLETAS
INSERT INTO coletas (dataColeta, pesoTotal, status, observacao, criado_em, atualizado_em) VALUES
('2026-04-15', 14.20, 'CONCLUIDA', 'Coleta finalizada sem ocorrencias', NOW(), NOW()),
('2026-04-16', 9.80, 'CONCLUIDA', 'Volume abaixo do estimado', NOW(), NOW()),
('2026-04-17', 0.00, 'CANCELADA', 'Cliente nao estava no local', NOW(), NOW()),
('2026-04-19', 27.40, 'EM_ROTA', 'Equipe em deslocamento', NOW(), NOW()),
('2026-04-21', 0.00, 'PENDENTE', 'Aguardando confirmacao da equipe', NOW(), NOW());

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
